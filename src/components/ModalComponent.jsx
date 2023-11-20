// ModalComponent.jsx
import React from 'react';
import JsonViewer from './JsonViewer';

const ModalComponent = ({ show, handleClose, data }) => {
  
  if (!show || !data) {
    return null;
  }

  const { screenshot_file_path, ...restData } = data;

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
                      src={`https://bittrading.click/screenshots/${screenshot_file_path}`}
                      alt="Screenshot"
                      className="img-fluid"
                    />
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