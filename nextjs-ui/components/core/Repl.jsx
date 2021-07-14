import dynamic from 'next/dynamic';
import Results from '../ui/Results';

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
});

const Repl = ({ items, onChange, code }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border-solid border-4 border-light-blue-500">
        <Editor onChange={onChange} value={code}></Editor>
      </div>

      <div className="border-solid border-4 border-light-blue-500 overflow-auto">
        <Results items={items} />
      </div>
    </div>
  );
};

export default Repl;
