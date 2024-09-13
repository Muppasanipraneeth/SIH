import React from 'react';

const DisplayOutput = ({ address }) => {
  return (
    <div className="output">
      <h3>Extracted Address</h3>
      {address ? <p>{address}</p> : <p>No address processed yet.</p>}
    </div>
  );
};

export default DisplayOutput;
