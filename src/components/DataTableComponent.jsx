import React, { Component } from 'react';
import ModalComponent from './ModalComponent';
import Gallery from './Gallery';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons/js/dataTables.buttons.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'datatables.net-searchpanes/js/dataTables.searchPanes.min.js';
import 'datatables.net-searchpanes-dt/css/searchPanes.dataTables.css';
import 'datatables.net-searchbuilder/js/dataTables.searchBuilder.js';
import 'datatables.net-searchbuilder-dt/css/searchBuilder.dataTables.min.css';
import 'datatables.net-select-dt/css/select.dataTables.css';
import 'datatables.net-select/js/dataTables.select.min.js'; 
const $ = require('jquery');
$.DataTable = require('datatables.net');

class DataTableComponent extends Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.dataTableInstance = null;
    this.state = {
      showModal: false,
      modalData: null,
      columnToggles: {},
      shownData: {},
    };
  }

  showModal = (data) =>
  {
    this.setState({ showModal: true, modalData: data });
  }

  parseData = (data) => {
    // Parse _id, id, and timestamp
    const parsedData = data.map(item => {
      const parsedItem = { ...item };
      
      if (parsedItem._id) {
        parsedItem._id = (parsedItem._id["$oid"]) ? parsedItem._id["$oid"] : parsedItem._id;
      }
      
      if (parsedItem.id) {
        delete parsedItem.id
      }

      if(!parsedItem.label)
      {
        parsedItem.label = null;
      }

      if (parsedItem.timestamp && parsedItem.timestamp.$date) {
        const timestamp = new Date(parseInt(parsedItem.timestamp.$date.$numberLong, 10));
        parsedItem.timestamp = `${timestamp.getDate()}/${timestamp.getMonth() + 1}/${timestamp.getFullYear()}`;
      }

      if (parsedItem.ssl_cert && parsedItem.ssl_cert.version && parsedItem.ssl_cert.version["$numberInt"])
      {
        parsedItem.ssl_cert.version = parseInt(parsedItem.ssl_cert.version["$numberInt"])
      }

      if (parsedItem.clock) {
        parsedItem["timing"] = {start: 0};
        Object.keys(parsedItem.clock).forEach((key) => {
          const numericValue = parsedItem.clock[key].$numberDouble;
          parsedItem["timing"][key] = parseFloat(numericValue);
        });

        parsedItem.end_time = null;
        if(parsedItem.timing.end_time)
        {
          parsedItem["end_time"] = parsedItem.timing.end_time;
        }
        // Remove the original clock property
        delete parsedItem.clock;  
      }
      
      Object.keys(parsedItem).forEach((key) => {
        if (typeof(parsedItem[key]) == 'object')
        {
          parsedItem[key] = JSON.stringify(parsedItem[key]);
        }
        if(parsedItem[key] == null)
        {
          parsedItem[key] = "[No data]";
        }
      });
      return parsedItem;
    });

    return parsedData;
  };

  startTable(data)
  {
    data = this.parseData(data);

      if (this.dataTableInstance) {
        this.dataTableInstance.destroy();
      }

      // Initialize DataTable when data is fetched
      
      this.dataTableInstance = $(this.tableRef.current).DataTable({
        data,
        columns: Object.keys(data[0]).map((key) => ({title: key, data: key})),
        dom: '<"#queryBuilder"Q>Bfrtip', // Example: To enable DataTables buttons (optional)
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'], // Example: To enable DataTables buttons (optional)
        select: true,
        searchPanes: {
          layout: 'columns-3',
        },
        columnDefs: [
          /*{
            targets: '_all',
            visible: true, // Set default visibility for all columns
          },*/
          {
            targets: [0],
            visible: false, // Set default visibility for all columns
          },
          {
            targets: '_all',
            defaultContent: ""
          }
        ],
      });

      const columnToggles = {};
      this.dataTableInstance.columns().every(function () {
        const column = this;
        columnToggles[column.index()] = true;
        return true;
      });
      this.setState({ columnToggles });
      
      this.dataTableInstance.on('init', () => this.getData());
      this.dataTableInstance.on('draw', () => this.getData());

      $(this.tableRef.current).on('click', 'tbody tr', (e) => {
        const rowData = JSON.stringify(this.dataTableInstance.row(e.currentTarget).data());
        this.showModal(rowData);
      }); 
  }

  componentDidMount() {
    // Fetch data from localhost:8080/api
    fetch('https://bittrading.click:8080/', {mode: 'cors'})
    .then((response) => response.json())
    .then((data) => this.startTable(data));
    document.addEventListener("keydown", this.escFunction, false);
  }

  componentWillUnmount() {
    if (this.dataTableInstance) {
      this.dataTableInstance.destroy();
    }
    document.removeEventListener("keydown", this.escFunction, false);
  }

  handleCloseModal = () => {
    this.setState({ showModal: false, modalData: null });
  };

  escFunction = (event) => {
    if (event.key === "Escape") {
      this.setState({ showModal: false, modalData: null });
    }
  }

  handleToggleColumn = (columnIdx) => {
    const { columnToggles } = this.state;

    // Toggle the visibility of the column
    this.dataTableInstance.column(columnIdx).visible(!columnToggles[columnIdx]);

    // Update the state
    columnToggles[columnIdx] = !columnToggles[columnIdx];
    this.setState({ columnToggles });
  };

  renderColumnToggleList = () => {
    
    const { columnToggles } = this.state;
    if (!this.dataTableInstance) {
      return null; // or return loading indicator or an empty list
    }

    const columns = this.dataTableInstance.columns().header().toArray();

    return (
      <div>
        <strong>Toggle Columns:</strong>
        <ul key="ul" className='list-group list-group-horizontal'>
          {columns.map((column, index) => column.innerText !== "_id" ? (
            <li key={column.innerText} onClick={() => this.handleToggleColumn(index)} className={columnToggles[index] ? ('list-group-item flex-fill active') : ('list-group-item flex-fill')}>
              {column.innerText}
            </li>
          ): (<></>))}
        </ul>
      </div>
    );
  };

  getData = () => {
    if (this.dataTableInstance)
    {
      var displayedData = this.dataTableInstance.rows({page: 'current'}).data().toArray();
      this.setState({shownData: displayedData});
      return;
    }
    this.setState({shownData: {}});
  }

  render() {
    return (
      <div>

        <div key="mainrow" className='row'>
          <div key="col1" className='col-md-4'>
            {this.renderColumnToggleList()}
          </div>
          <div key="col2" className='col-md-8'>
            <div key="qb" id="queryBuilder">

            </div>
          </div>
        </div>
        
        

        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <table ref={this.tableRef} className="table display" style={{ width: '100%' }} />
        </div>

        <ModalComponent
          show={this.state.showModal}
          handleClose={this.handleCloseModal}
          data={this.state.modalData}
        />

        {this.state.shownData && this.state.shownData.length > 0 ? (
          <Gallery shownData={this.state.shownData} showModal={this.showModal} />
        ) : this.dataTableInstance ? (
          <>
            <p>If you <b>already</b> see the table but you don't see any image, please refresh the Gallery.</p>
            <button className='btn btn-secondary btn-block' onClick={this.getData}>
               Refresh Gallery
            </button>
          </>
        ) : (
          <small className='text-secondary'>Loading data, please wait... </small>
        )
        }

      </div>
    );
  }
}

export default DataTableComponent;
