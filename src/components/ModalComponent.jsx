// ModalComponent.jsx
import React from 'react';
import JsonViewer from './JsonViewer';

const ModalComponent = ({ show, handleClose, data }) => {
  
  if (!show || !data) {
    return null;
  }

  if(typeof(data) == 'string')
  { 
    try{
      let data_2 = JSON.parse(data);
      data = data_2;
    }
    catch(e)
    {
      // ignore
    }
  }
  
  const { screenshot_file_path, _id, ...restData } = data;


  const modalStyle = {
    display: show ? 'block' : 'none',
  };

  const overlayStyle = {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the alpha value for darkness
  };

  const modalContentStyle = {
    maxHeight: '80vh', // Set the maximum height as needed
    overflowY: 'auto', // Enable vertical scrolling
  };

  const handleClassification = (value) => {

  // Make the PUT request
  fetch('https://bittrading.click:8080', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: _id,
      label: value,
    }),
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response if needed
      if(data.appended)
      {
        restData["label"] = data.appended.label;
        restData["labeled_by"] = data.appended.labeled_by;
      }
    })
    .catch(error => {
      // Handle errors if any
      console.error('Error:', error);
    });
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
      <div style={overlayStyle}>
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content" style={modalContentStyle}>
            <div className="modal-header">
              <h5 className="modal-title">Details</h5>
              <button type="button" className="close" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <ul>
                    {restData && typeof restData === 'object' ? (
                      <div>
                        {<JsonViewer data={restData} initial={true} />}
                      </div>
                    ) : (
                      <div>
                        <p>{restData}</p>
                      </div>
                    )}
                  </ul>
                </div>
                {screenshot_file_path && (
                  <div className="col-md-6">
                    <img
                      src={`https://media.bittrading.click/${screenshot_file_path}`}
                      alt="Screenshot"
                      className="img-fluid"
                    />

                    <hr />

                    { restData.label === 'null' ? (
                      <div>
                        <h6>
                          How would you classify this website?
                        </h6>
                        <div className="btn-group-vertical w-100 font-weight-bold" role='group'>
                          <button key="b-legitimate" type="button" onClick={() => handleClassification('legitimate')} className='btn btn-success'>Legitimate</button>
                          <button key="b-dubious" type="button" onClick={() => handleClassification('dubious')} className='btn btn-warning'>Dubious</button>
                          <button key="b-suspicious" type="button" onClick={() => handleClassification('suspicious')} className='btn btn-danger'>Suspicious</button>
                          <button key="b-parked" type="button" onClick={() => handleClassification('whitepage/error')} className='btn btn-secondary'>Whitepage/Error</button>
                          <button key="b-parked" type="button" onClick={() => handleClassification('parked')} className='btn btn-dark'>Parked</button>
                        </div>
                      </div> 
                      ) : (
                        <div>
                          <h4>Label: {restData.label}</h4>
                          <small> Labeled By: {restData.labeled_by}</small>
                        </div>
                      )
                    }
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;