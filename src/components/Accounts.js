
import React from 'react';
import 'antd/dist/antd.css';
import { Table, Radio, Divider, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EmailIcon from '@material-ui/icons/Email';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './styles/Accounts.css'
import NewAccountDialogBox from './subcomponents/NewAccountDialogBox'

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
    selectedRowEmails: [],
  };

//Searching logic

  componentDidMount() {
    this._isMounted = true;

    fetch("/main/show_all_accounts").then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ fetchedData: data });
        }
      })
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateAccountsAPICall = () => {
    fetch("/main/show_all_accounts").then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ fetchedData: data });
        }
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

  getSelectedEmails = (selectedRowKeys, selectedRows) => {
    let emails = [];

    selectedRows.forEach( record => {
      emails.push(record.email);
    })

    if (this._isMounted) {
      this.setState({ selectedRowEmails: emails });
    }
  }

  componentDidUpdate() {
    console.log(this.state);
  }

  render() {
    //conditional rendering of batch emailer component(button)
    let emailHref = "https://mail.google.com/mail?view=cm&fs=1&bcc=";
    let batchEmailComp = null;

    if (this.state.selectedRowEmails.length === 0)  {
      batchEmailComp = null;
    }
    else {
      this.state.selectedRowEmails.forEach( email => {
        emailHref += email + ","
      });

      batchEmailComp = (
        <div className='batch-email-button-accounts'>
          <a 
            href={emailHref}
            target="_blank" 
          >
            <EmailIcon />
          </a>
        </div>
      );
    }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        render: text => <a>{text}</a>,
        key: 'name',
        width: '12.5%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Profile Page',
        dataIndex: '_id',
        key: '_id',
        width: '10%',
        render: (text,key) => <Link to={{pathname: "/accountprofile", state: {cid: key._id} }}> <OpenInNewIcon /> </Link>
      },
      {
        title: 'Company',
        dataIndex: 'company',
        key: 'company',
        width: '17.5%',
        ...this.getColumnSearchProps('company'),
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
        width: '15%',
        ...this.getColumnSearchProps('city'),
      },
      {
        title: 'Job Type',
        dataIndex: 'job_type',
        key: 'job_type',
        width: '10%',
        filters: [
          {
            text: 'Blue Collar',
            value: 'blue-collar',
          },
          {
            text: 'Technician',
            value: 'technician',
          },
          {
            text: 'Services',
            value: 'services',
          },
          {
            text: 'Student',
            value: 'student',
          },
          {
            text: 'Unemployed',
            value: 'unemployed',
          },
          {
            text: 'Self-employed',
            value: 'self-employed',
          },
          {
            text: 'Retired',
            value: 'retired',
          },
          {
            text: 'Entrepreneur',
            value: 'entrepreneur',
          },
          {
            text: 'Housemaid',
            value: 'housemaid',
          },
          {
            text: 'Management',
            value: 'management',
          },
          {
            text: 'None',
            value: 'None',
          },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.job_type.indexOf(value) === 0,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '25%',
        render: text => <a target="_blank" href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${text}`}>
                          {text} 
                          <span style={{fontSize:20, float:'right'}}><MailOutlineIcon /></span> 
                        </a>,
        key: 'email',
      },
      {
        title: 'Phone No.',
        dataIndex: 'phone_number', 
        width: '10%',
        key: 'phone_number',
      },
    ];

    return(
    <>
      <Table 
        columns={columns}
        dataSource={this.state.fetchedData}
        rowSelection={{
          type: "checkbox", 
          onChange: this.getSelectedEmails,
        }}
        title={() => 'Accounts'}
        onChange={onChange}
        rowKey="_id" 
      />

      {batchEmailComp}

      <div className="add-profile-button"> 
        <NewAccountDialogBox updateAccounts={this.updateAccountsAPICall}/> 
      </div>
    </>
    ); 
  }
};