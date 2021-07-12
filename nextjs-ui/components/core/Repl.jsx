import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
});

const Repl = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border-solid border-4 border-light-blue-500">
        <Editor></Editor>
      </div>

      <div className="border-solid border-4 border-light-blue-500">
        <div id="results">Results</div>
      </div>
    </div>
  );
};

export default Repl;
