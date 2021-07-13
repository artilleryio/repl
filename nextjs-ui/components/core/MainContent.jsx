import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';

import ButtonsBar from '../ui/ButtonsBar';
import ShareModal from '../ui/ShareModal';
import Repl from './Repl';

const ENDPOINT = 'wss://7iuux5aza6.execute-api.us-east-1.amazonaws.com/dev';

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

  const ws = useRef(null);

  useEffect(() => {
    if (ws.current && ws.current.readyState === 1) {
      return;
    }

    ws.current = new WebSocket(ENDPOINT);

    ws.current.onopen = () => {
      console.log('WS open');
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
        // TODO: Re-enable Run button
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

  const share = () => {
    showShareModal(true);
  };

  return (
    <div className="app-content py-4 px-12">
      <Repl
        code={scenarioValue}
        items={resultItems}
        onChange={onEditorChange}
      />

      <ShareModal show={shareModalVisible} onClose={() => showShareModal(false)}/>

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
