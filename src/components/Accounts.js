
import React from 'react';
import 'antd/dist/antd.css';
import { Table, Radio, Divider, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './styles/Accounts.css'
import NewProfileDialogBox from './subcomponents/NewProfileDialogBox'

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
    // Column configuration not to be checked
    name: record.name,
  }),
};

function onChange(pagination, filters, sorter, extra) {
  console.log('params', pagination, filters, sorter, extra);
}

export default class Accounts extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    fetchedData: [],
  };

//Searching logic

  componentDidMount() {
    fetch("/main/show_accounts").then(response =>
      response.json().then(data => {
        this.setState({ fetchedData: data });
      })
    );
  }

  updateAccountsAPICall = () => {
    fetch("/main/show_accounts").then(response =>
      response.json().then(data => {
        this.setState({ fetchedData: data });
      })
    );
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  render() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
        key: 'name',
        ...this.getColumnSearchProps('name'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
      {
        title: 'Profile Page',
        dataIndex: '_id',
        key: '_id',
        render: (text,key) => <Link to={{pathname: "/accountprofile", state: {cid: key._id} }}> Profile </Link>
      },
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
        ...this.getColumnSearchProps('company'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        ...this.getColumnSearchProps('city'),
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
      {
        title: 'Job Type',
        dataIndex: 'job_type',
        key: 'job_type',
        // filters: [
        //   {
        //     text: 'Individual',
        //     value: 'Individual',
        //   },
        //   {
        //     text: 'Small Business',
        //     value: 'Small Business',
        //   },
        //   {
        //     text: 'Mid-market',
        //     value: 'Mid-market',
        //   },
        //   {
        //     text: 'Enterprise',
        //     value: 'Enterprise',
        //   },
        // ],
        // onFilter: (value, record) => record.name.indexOf(value) === 0,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        render: text => <a target="_blank" href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${text}`}>
                          {text} 
                          <span style={{fontSize:20, float:'right'}}>&#9993;</span> 
                        </a>,
        key: 'email',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
      {
        title: 'Phone No.',
        dataIndex: 'phone_number', // used to be phoneNumber
        key: 'phone_number',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
    ];

    return(
    <>
      <Table 
        columns={columns}
        dataSource={this.state.fetchedData}
        rowSelection={{type: "checkbox", ...rowSelection,}}
        title={() => 'Accounts'}
        onChange={onChange}
      />
      <div className="add-profile-button"> <NewProfileDialogBox updateAccounts={this.updateAccountsAPICall}/> </div>
    </>
    ); 
  }
};