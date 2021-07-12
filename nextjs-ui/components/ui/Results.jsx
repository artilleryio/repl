const Results = ({ items = [] }) => {
  return (
    <div id="results" style={{ height: '50vh' }}>
      {items.map((item) => (
        <>
          <pre>{item.data}</pre>
        </>
      ))}
    </div>
  );
};

export default Results;
