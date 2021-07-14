import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';

import ButtonsBar from '../ui/ButtonsBar';
import ShareModal from '../ui/ShareModal';
import Repl from './Repl';

import { base64encode } from '../../src/utils';

const BASE_URL = '';
const WS_ENDPOINT = '';
const POST_ENDPOINT = `${BASE_URL}/save`;
const GET_ENDPOINT = `${BASE_URL}/get`;
const BASE_DOMAIN = 'superrepl.com';

const defaultContents = `# Write your scenario here and press Run to run it!
config:
  # Replace this with your API's base URL:
  target: "https://superrepl.com"
scenarios:
  - flow:
    - get:
        url: "/"
        expect:
          statusCode: 200
    - get:
        url: "/dinosaurs"
        expect:
          # no dinosaurs expected
          statusCode: 404
`;

const saveScenario = async (code, items) => {
  try {
    const scenario = btoa(code);
    const output = items.reduce((s, item) => {
      if (item.data) {
        return `${s}${item.data}`;
      }

      return s;
    }, '');

    const response = await fetch(POST_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        scenario,
        output: base64encode(output),
      }),
    });

    if (response.ok) {
      const { key } = await response.json();

      console.log(`response key`, key);
      return `https://${BASE_DOMAIN}/#/${key}`;
    }
  } catch (err) {
    console.log(err);
  }
};

const copyToClipBoard = async (value) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value);
  } else {
    console.log('cannot copy to clipboard');
  }
};

const MainContent = () => {
  const [scenarioValue, setScenario] = useState(defaultContents);
  const [resultItems, setResultItems] = useState([]);
  const [runButton, disableRunButton] = useState(false);
  const [shareModalVisible, showShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const ws = useRef(null);

  useEffect(() => {
    if (ws.current && ws.current.readyState === 1) {
      return;
    }

    ws.current = new WebSocket(WS_ENDPOINT);

    ws.current.onopen = () => {
      console.log('WS open');
      console.log(ws.current);
    };

    ws.current.onerror = () => {
      console.log('WS error');
      console.log(ws.current);
    };

    ws.current.onclose = () => console.log('closing websocket');
  });

  useEffect(() => {
    if (ws.current && ws.current.onmessage) return;

    ws.current.onmessage = function (event) {
      const eventData = JSON.parse(event.data);

      if (eventData.event === 'output') {
        setResultItems((current) =>
          sortBy([...current, eventData], (x) => x.ts),
        );
      } else if (eventData.event === 'done') {
        console.log('Run done');

        disableRunButton(false);
      }
    };
  }, []);

  const run = () => {
    disableRunButton(true);

    // TODO: Reconnect if needed - ensure we're connected first
    if (resultItems.length > 0) {
      setResultItems([]);
    }

    const enc = btoa(scenarioValue);

    ws.current.send(JSON.stringify({ input: enc, opts: {} }));
  };

  const onEditorChange = (newValue) => {
    setScenario(newValue);
  };

  const share = async () => {
    const scenarioUrl = await saveScenario(scenarioValue, resultItems);

    setShareUrl(scenarioUrl);
    showShareModal(true);
  };

  return (
    <div className="app-content py-4 px-12">
      <Repl
        code={scenarioValue}
        items={resultItems}
        onChange={onEditorChange}
      />

      <ShareModal
        show={shareModalVisible}
        onClose={() => showShareModal(false)}
        onCopy={() => copyToClipBoard(shareUrl)}
        shareUrl={shareUrl}
      />

      <ButtonsBar
        runScenario={run}
        runDisabled={runButton}
        shareScenario={share}
      />

      <hr className="mt-12 mb-3" />
    </div>
  );
};

export default MainContent;
