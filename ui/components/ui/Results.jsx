import React from 'react';

const Results = ({ items = [] }) => {
  return (
    <div style={{ height: '50vh' }}>
      {items.map((item, key) => (
        <React.Fragment key={key}>
          <pre>{item.data}</pre>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Results;
