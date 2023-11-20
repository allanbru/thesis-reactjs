import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import DataTableComponent from './components/DataTableComponent';

function App() {
  return (
    <div className='container'>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="https://www.bittrading.click">Phishing Crawler</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav d-flex ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="https://www.bittrading.click">Home</a>
                </li>
              </ul>
          </div>
        </div>
      </nav>
      <div className="row">
        <div className='card'>
          <div className='card-header'>Results</div>
          <div className='card-body' style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <DataTableComponent className="col-md-10" />
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
