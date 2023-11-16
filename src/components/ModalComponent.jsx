// ModalComponent.jsx
import React from 'react';

const ModalComponent = ({ show, handleClose, data }) => {
  if (!show || !data) {
    return null;
  }

  const { screenshot_file_path, ...restData } = data;

  const renderProperty = (key, value) => {
    if (value && typeof value === 'object') {
      return (
        <div key={key}>
          <strong>{key}:</strong>
          <div style={{ marginLeft: '20px' }}>
            {Object.keys(value).map((subKey) => renderProperty(subKey, value[subKey]))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={key}>
          <strong>{key}:</strong> {JSON.stringify(value)}
        </div>
      );
    }
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
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
                    {data && Object.keys(data).map((key) => renderProperty(key, data[key]))}
                </ul>
              </div>
              {screenshot_file_path && (
                <div className="col-md-6">
                  <img
                    src={`base_url/screenshots/${screenshot_file_path}`}
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
  );
};

export default ModalComponent;