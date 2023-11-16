import React, { Component } from 'react';
import ModalComponent from './ModalComponent';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons/js/dataTables.buttons.min.js';
import 'datatables.net-buttons/js/buttons.html5.min.js';
import 'datatables.net-buttons/js/buttons.print.min.js';
import 'datatables.net-buttons/js/buttons.colVis.min.js';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'datatables.net-searchpanes/js/dataTables.searchPanes.min.js';
import 'datatables.net-searchpanes-dt/css/searchPanes.dataTables.css';
import 'datatables.net-select-dt/css/select.dataTables.css'; // Include Select CSS
import 'datatables.net-select/js/dataTables.select.min.js'; // Include Select JS
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
    };
  }

  parseData = (data) => {
    // Parse _id, id, and timestamp
    const parsedData = data.map(item => {
      const parsedItem = { ...item };
      if (parsedItem._id) {
        delete parsedItem._id;
      }
      if (parsedItem.id) {
        delete parsedItem.id
      }
      if (parsedItem.timestamp && parsedItem.timestamp.$date) {
        const timestamp = new Date(parseInt(parsedItem.timestamp.$date.$numberLong, 10));
        parsedItem.timestamp = `${timestamp.getDate()}/${timestamp.getMonth() + 1}/${timestamp.getFullYear()}`;
      }

      if (parsedItem.clock) {
        Object.keys(parsedItem.clock).forEach((key) => {
          const numericValue = parsedItem.clock[key].$numberDouble;
          parsedItem[key] = parseFloat(numericValue);
        });
  
        // Remove the original clock property
        delete parsedItem.clock;
      }

      return parsedItem;
    });

    return parsedData;
  };

  componentDidMount() {
    // Fetch data from localhost:8080/api
    fetch('http://localhost:8080/api', {mode: 'cors'})
      .then((response) => response.json())
      .then((data) => {
        
       data = this.parseData(data);

        if (this.dataTableInstance) {
          this.dataTableInstance.destroy();
        }

        // Initialize DataTable when data is fetched
        
        this.dataTableInstance = $(this.tableRef.current).DataTable({
          data,
          columns: Object.keys(data[0]).map((key) => ({ title: key, data: key })),
          dom: 'QPBfrtip', // Example: To enable DataTables buttons (optional)
          buttons: ['copy', 'csv', 'excel', 'pdf', 'print'], // Example: To enable DataTables buttons (optional)
          select: true,
          searchPanes: {
            layout: 'columns-3',
          },
          columnDefs: [
            {
              targets: '_all',
              visible: true, // Set default visibility for all columns
            },
          ],
        });

        const columnToggles = {};
        this.dataTableInstance.columns().every(function () {
          const column = this;
          columnToggles[column.index()] = true;
        });
        this.setState({ columnToggles });
        

        $(this.tableRef.current).on('click', 'tbody tr', (e) => {
          const rowData = this.dataTableInstance.row(e.currentTarget).data();
          this.setState({ showModal: true, modalData: rowData });
        });

      });
  }

  componentWillUnmount() {
    if (this.dataTableInstance) {
      this.dataTableInstance.destroy();
    }
  }

  handleCloseModal = () => {
    this.setState({ showModal: false, modalData: null });
  };

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
        <ul>
          {columns.map((column, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={columnToggles[index]}
                  onChange={() => this.handleToggleColumn(index)}
                />
                {column.innerText}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  render() {
    return (
      <div>

        {this.renderColumnToggleList()}

        <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
          <table ref={this.tableRef} className="table display" style={{ width: '100%' }} />
        </div>

        <ModalComponent
          show={this.state.showModal}
          handleClose={this.handleCloseModal}
          data={this.state.modalData}
        />

      </div>
    );
  }
}

export default DataTableComponent;
