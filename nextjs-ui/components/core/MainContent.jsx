import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import sortBy from 'lodash.sortby';

import ButtonsBar from '../ui/ButtonsBar';
import ShareModal from '../ui/ShareModal';
import Repl from './Repl';

import {
  saveScenario,
  copyToClipBoard,
  getScenarioKey,
  getScenario,
} from '../../src/utils';

const WS_ENDPOINT = '';

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

const MainContent = () => {
  const [scenarioValue, setScenario] = useState(defaultContents);
  const [resultItems, setResultItems] = useState([]);
  const [runButton, disableRunButton] = useState(false);
  const [shareModalVisible, showShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  const ws = useRef(null);

  const router = useRouter();

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

  useEffect(() => {
    const loadScenario = async () => {
      const scenarioKey = getScenarioKey(router.query, router.asPath);

      if (scenarioKey) {
        const { scenario, output } = await getScenario(scenarioKey);

        if (scenario && output) {
          setScenario(scenario);
          setResultItems([{ data: output }]);
        }
      }
    };

    loadScenario();
  }, [router.query, router.asPath]);

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
    if (resultItems.length === 0) {
      console.log('no results to share');

      return;
    }

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
