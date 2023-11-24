// ModalComponent.jsx
import React from 'react';

const Widget = ({ data, showModal }) => {
  
  if (!data) {
    return null;
  }

  let { screenshot_file_path, ...restData } = data;

  if (screenshot_file_path === "null")
  {
    screenshot_file_path = null;
  }

  const openModal = () => {
    showModal(data);
  }

  return (
    <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
      {screenshot_file_path && (
                   <div className="bg-image hover-overlay ripple shadow-1-strong rounded" data-ripple-color="light">
                   <img
                                   src={`https://media.bittrading.click/${screenshot_file_path}`}
                                   alt="Screenshot"
                                   className="img-fluid w-100"
                                   onClick={openModal}
                                 />
                 </div>
                )}
      <div className="row">
        {restData.domain && (
          <h4 className='text-secondary font-bold'>{restData.domain}</h4>
        )}
      </div>
    </div>
  );
};

export default Widget;