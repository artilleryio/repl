import Link from 'next/link';

import { useState } from 'react';

const HeadingBar = ({ heading }) => {
  const [toggleLearnMore, setToggleLearnMore] = useState(false)

  const toggle = () => setToggleLearnMore(!toggleLearnMore)

  return (
    <div className="app-heading-bar flex justify-between pt-6 px-12">
      <div className="my-2">
        <h1 style={{fontFamily: 'Martel'}} className="fg-gradient-purple-red text-4xl pb-3 tracking-tight font-extrabold sm:text-5xl md:text-5xl font-display truncate">
          {heading}
        </h1>
        <p className="text-s pt-3 pb-3">
          SuperREPL is a universal API REPL, powered by <Link href="https://artillery.io">Artillery</Link>.
          Send requests, see responses, and explore any public API. <span className="cursor-pointer underline" onClick={toggle}>Learn more &darr; </span>
        </p>

        <div className="text-xs" style={{ display: toggleLearnMore? "block": "none" }}>
            You&apos;ve probably used something like Postman, HTTPie, or curl to interact with HTTP APIs before. This is similar, but with a few important differences.

            <div className="px-9 py-3">
              <ul className="list-disc">
                <li>Code-first, for developers who prefer writing code to clicking around in a UI</li>
                <li>Send one request at a time, or create whole <strong>scenarios</strong> with multiple dependent steps and assertions</li>
                <li>Not just HTTP - try the WebSocket or Socket.io examples</li>
                <li>Scenarios you write here can be used for load testing and synthetic monitoring with Artillery</li>
                <li>Powered by <Link href="https://artillery.io">Artillery</Link> ⚡
                and packed with features; see <a href="https://artillery.io/docs" className="underline">the docs</a></li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  )
};

export default HeadingBar;

