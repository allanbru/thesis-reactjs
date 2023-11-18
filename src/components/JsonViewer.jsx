// JsonViewer.jsx
import React, { useState } from 'react';

const JsonViewer = ({ data, initial = false }) => {
  const [expanded, setExpanded] = useState(initial);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      {data && typeof data === 'object' ? (
        <div>
          <button className='btn btn-secondary' style={{fontWeight: 'bold'}} onClick={toggleExpand}>{expanded ? '[-]' : '[+]'}</button>
          {expanded && (
            <div style={{ marginLeft: '20px' }}>
              {Object.keys(data).map((key, index) => (
                <div key={index}>
                  <span style={{fontWeight: 'bold'}}>{key}: </span>
                  <JsonViewer data={data[key]} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <span>{JSON.stringify(data)}</span>
      )}
    </div>
  );
};

export default JsonViewer;
