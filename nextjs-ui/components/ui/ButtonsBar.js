const ButtonsBar = ({ runScenario, runDisabled = false, shareScenario }) => {
  return (
    <div>
      <button disabled={runDisabled} onClick={() => runScenario() } className="inline-flex mr-6 mt-3 items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
        ⚡ Run scenario
      </button>
      <button className="inline-flex mr-6 mt-3 items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" onClick={() => shareScenario() }>
        Share
      </button>
      <label htmlFor="examples" className="font-bold font-medium">
        Load an example
      </label>
      :
      <select
        name="examples"
        id="examples"
        className="mt-1 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        <option value="ws-hello">HTTP Hello World!</option>
        <option value="http-chain">HTTP request chaining</option>
        <option value="ws-hello">WebSocket Hello World</option>
        <option value="socketio-hello">Socket.io Hello World</option>
      </select>
    </div>
  );
};

export default ButtonsBar;
