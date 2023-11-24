// CookieNotice.js

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

const CookieNotice = () => {
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    // Check if the user has already accepted the notice
    const accepted = Cookies.get('cookieNoticeAccepted');
    if (accepted) {
      setShowNotice(false);
    }
  }, []);

  const handleAccept = () => {
    // Set a cookie to remember user's preference
    Cookies.set('cookieNoticeAccepted', 'true', { expires: 365 }); // Expires in 365 days
    setShowNotice(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000, // Adjust z-index to be above other elements if needed
      }}
    >
      {showNotice && (
        <div
          className="alert alert-info alert-dismissible fade show"
          role="alert"
        >
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                This website uses cookies to ensure you get the best
                experience.
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                onClick={handleAccept}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default CookieNotice;
