const AWS = require('aws-sdk');
const util = require('util');
const tmp = require('tmp');
const EventEmitter = require('events');
const path = require('path');
const atob = require('atob');
const { writeFileSync } = require('fs');
const childProcess = require('child_process');
const Yaml = require('js-yaml');
const uuid = require('uuid');

let scheduled = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports.connect = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify('ok'),
  };
};

module.exports.disconnect = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify('ok'),
  };
};

const sendMessageToClient = (url, connectionId, payload) => {
  scheduled += 1;

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
          scheduled -= 1;
          reject(err);
        }
        scheduled -= 1;
        resolve(data);
      },
    );
  });
};

const sanitize = (inputScript) => {
  return inputScript;
};

const addOverrides = (inputScript) => {
  return inputScript;
};

const runArtillery = (script, opts, events) => {
  let child;
  return new Promise((resolve, reject) => {
    const tempFile = tmp.fileSync();

    let doc = {};
    const args = [];

    try {
      doc = Yaml.load(script);
    } catch (err) {
      console.log(err);
      doc = {};
    }

    doc.config.phases = [
      {
        duration: 1,
        arrivalCount: 1,
      },
    ];

    doc.config.plugins = { expect: {} };

    args.push('run');
    args.push('-q');
    args.push(tempFile.name);

    writeFileSync(tempFile.name, JSON.stringify(doc));

    child = childProcess.spawn(
      'node',
      [
        path.join(__dirname, 'node_modules', 'artillery', 'bin', 'artillery'),
      ].concat(args),
      {},
    );

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
      child.stdout.on('end', () => {});
    } else {
      reject(new Error('no stdout'));
    }
  });
};
module.exports.runArtillery = runArtillery;

function flush() {
  return new Promise((resolve) => {
    const i = setInterval(() => {
      if (scheduled === 0) {
        clearInterval(i);
        resolve();
      }
    }, 500);
  });
}

// default route for all WS messages
module.exports.wsRun = async (event) => {
  let { input } = JSON.parse(event.body);
  input = atob(input);
  // TODO: Parse in here
  const runnableScript = addOverrides(sanitize(input));

  const domain = event.requestContext.domainName;
  const { stage, connectionId } = event.requestContext;
  const callbackUrlForAWS = util.format(
    util.format('https://%s/%s', domain, stage),
  );

  const events = new EventEmitter();

  events.on('output', async (s) => {
    await sendMessageToClient(callbackUrlForAWS, connectionId, {
      event: 'output',
      data: s,
      ts: Date.now(),
    });
  });

  events.on('done', async () => {
    await sendMessageToClient(callbackUrlForAWS, connectionId, {
      event: 'done',
    });
  });

  await runArtillery(runnableScript, {}, events);
  await flush();

  return {
    statusCode: 200,
  };
};

const scenarioItem = (scenario, output) => {
  return {
    id: uuid.v4(),
    scenario,
    output,
    submittedAt: new Date().getTime(),
  };
};

module.exports.saveScenario = async (event) => {
  try {
    const { scenario, output } = JSON.parse(event.body);
    const data = scenarioItem(scenario, output);
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    await dynamoDb
      .put({
        TableName: process.env.SCENARIOS_TABLE,
        Item: data,
      })
      .promise();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        key: data.id,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        err,
      }),
    };
  }
};

module.exports.getScenario = async (event) => {
  try {
    const { key } = event.pathParameters;

    if (!key) {
      return {
        headers: corsHeaders,
        statusCode: 400,
      };
    }

    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    const { Item: item } = await dynamoDb
      .get({
        TableName: process.env.SCENARIOS_TABLE,
        Key: {
          id: key,
        },
      })
      .promise();

    if (!item) {
      return {
        headers: corsHeaders,
        statusCode: 404,
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(item),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        err,
      }),
    };
  }
};
