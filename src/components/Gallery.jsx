// ModalComponent.jsx
import React from 'react';
import Widget from './Widget';

const Gallery = ({ shownData, showModal }) => {
  
  if (!shownData) {
    return null;
  }

  return (
    <div className="row">
      { Object.keys(shownData).map((key) => ( 
        <Widget key={`widget-${key}`} data={shownData[key]} showModal={showModal} />
      ))}
    </div>
  )
};

export default Gallery;