import { useState } from 'react';
import dynamic from 'next/dynamic';

import Results from '../ui/Results';
const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
});

const ENDPOINT = 'wss://7iuux5aza6.execute-api.us-east-1.amazonaws.com/dev';
//
//
// ws.onmessage = function(event) {
//   console.log(event);
//
//   const eventData = JSON.parse(event.data);
//   if (eventData.event === 'output') {
//     // let newItems = app.$root.$children[0].items.concat(eventData);
//     console.log('output', eventData)
//     //app.$root.$children[0].items = sortBy(newItems, x => x.ts);
//   } else if (eventData.event === 'done') {
//     // TODO: Re-enable Run button
//     console.log('Run done');
//   }
// };

const Repl = () => {
  const [receivedItems, setItems] = useState([])
  const ws = new WebSocket(ENDPOINT);

  ws.onopen = function (event) {
    console.log('WS open');
    console.log(event);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border-solid border-4 border-light-blue-500">
        <Editor></Editor>
      </div>

      <div className="border-solid border-4 border-light-blue-500">
        <Results items={receivedItems} />
      </div>
    </div>
  );
};

export default Repl;
