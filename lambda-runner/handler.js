'use strict';

const AWS = require('aws-sdk');
const util = require('util');
const tmp = require('tmp');
const EventEmitter = require('events');
const path = require('path');
const atob = require('atob');
const { writeFileSync } = require('fs');
const childProcess = require('child_process');
const Yaml = require('js-yaml');

module.exports.connect = async(event) => {
  return {
    statusCode: 200,
    body: JSON.stringify('ok')
  };
};

module.exports.disconnect = async(event) => {
  return {
    statusCode: 200,
    body: JSON.stringify('ok')
  };
};

const sendMessageToClient = (url, connectionId, payload) => {
  scheduled++;
  return new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId,
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          scheduled--;
          reject(err);
        }
        scheduled--;
        resolve(data);
      }
    );
  });
}

const sanitize = (inputScript) => {
  return inputScript;
}

const addOverrides = (inputScript) => {
  return inputScript;
}

const runArtillery = (script, opts, events) => {
  let child;
  return new Promise((resolve, reject) => {
    const tempFile = tmp.fileSync();

    let doc = {};
    let args = [];

    try {
      doc = Yaml.load(script);
    } catch(err) {
      console.log(err);
      doc = {};
    }

    doc.config.phases = [
        {
          "duration": 1,
          "arrivalCount": 1
        }
      ];

    doc.config.plugins = {"expect":{}};
  
    args.push('run');
    args.push('-q');
    args.push(tempFile.name);


    writeFileSync(tempFile.name, JSON.stringify(doc));

    child = childProcess.spawn('node', [path.join(__dirname, 'node_modules', 'artillery', 'bin', 'artillery')].concat(args), {});

    child.on('close', (code) => {
      events.emit('done', code);
      resolve();
    });

    if (child.stdout) {
      child.stdout.on('data', (output) => {
        events.emit('output', output.toString());
      });
      child.stderr.on('data', (output) => {
        events.emit('output', output.toString());
      });
      child.stdout.on('end', () => {
      });
    } else {
      reject(new Error('no stdout'));
    }
  });
};
module.exports.runArtillery = runArtillery;

let scheduled = 0;

function flush() {
  return new Promise((resolve, reject) => {
    let i = setInterval(function() {
      if (scheduled == 0) {
        clearInterval(i);
        resolve();
      }
    }, 500);
  });
}

// default route for all WS messages
module.exports.wsRun = async (event, context) => {
  let { input, opts } = JSON.parse(event.body);
  input = atob(input);
  // TODO: Parse in here
  const runnableScript = addOverrides(sanitize(input));

  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrlForAWS = util.format(util.format('https://%s/%s', domain, stage));
  
  const events = new EventEmitter();

  events.on('output', async (s) => {
    await sendMessageToClient(callbackUrlForAWS, connectionId, {event: 'output', data: s, ts: Date.now()});  
  });

  events.on('done', async () => {    
    await sendMessageToClient(callbackUrlForAWS, connectionId, {event: 'done'});
  });

  await runArtillery(runnableScript, {}, events);
  await flush();

  return {
    statusCode: 200,
  };
}