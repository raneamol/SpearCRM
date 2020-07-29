/* This software is called SpearCRM and it is a customer relationship management software for stockbrokers.
Copyright (C) 2020  Amol Rane, Vedant Pimpley.
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import EmailIcon from '@material-ui/icons/Email';
import AuthContext from './Other/AuthContext.js';
import { prepareGETOptions } from './Other/helper.js';
import {Link} from "react-router-dom";
import NewLeadDialogBox from './subcomponents/NewLeadDialogBox'
import './styles/Accounts.css' //both Accounts and Leads pages have the same styling


const API = process.env.REACT_APP_API;
export default class Leads extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
    fetchedData: [],
    selectedRowEmails: [],
  };

  static contextType = AuthContext;

  componentDidMount() {
    this._isMounted = true;

    fetch(`${API}/main/show_all_leads`, prepareGETOptions(this.context))
    .then(response =>
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

  updateLeadsAPICall = () => {
    fetch(`${API}/main/show_all_leads`, prepareGETOptions(this.context))
    .then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ fetchedData: data });
        }
      })
    );
  }
//Searching logic

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
        <div className='batch-email-button-leads'>
          <a 
            href={emailHref}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <EmailIcon fontSize="large"/>
          </a>
        </div>
      );
    }

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        //render: text => <a href="#">{text}</a>,
        key: 'name',
        width: '12.5%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Profile Page',
        dataIndex: '_id',
        key: '_id',
        width: '10%',
        render: (text,key) => <Link to={{pathname: "/leadprofile", state: {cid: key._id} }}> <OpenInNewIcon /> </Link>
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
        render: text => <a target="_blank" 
                          href={`https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${text}`}
                          rel="noopener noreferrer"
                        >
                          {text} 
                          <span style={{fontSize:20, float:'right'}}><MailOutlineIcon /></span> 
                        </a>,
        key: 'email',
      },
      {
        title: 'Phone No.',
        dataIndex: 'phone_number',
        key: 'phone_number',
        width: '10%',
      },
    ];

    return (
      <>
        <Table 
          columns={columns}
          dataSource={this.state.fetchedData}
          rowSelection={{
            type: "checkbox", 
            onChange: this.getSelectedEmails,
          }}
          title={() => 'Leads'}
          // onChange={onChange}
          rowKey="_id" 
        />

        {batchEmailComp}

        <div className="add-profile-button"> 
          <NewLeadDialogBox updateLeads={this.updateLeadsAPICall}/> 
        </div>
      </>
    );
  }
};