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
import NewProfileDialogBox from './subcomponents/NewProfileDialogBox'
import './styles/Accounts.css' //both Accounts and Leads pages have the same styling

export const data = [
  {
    key: '1',
    name: 'John Brown',
    company: '3C Electronics',
    type: 'Small Business',
    city: 'New York',
    phoneNumber: '9090909090',
    email: 'johnbrown@gmail.com',
  },
  {
    key: '2',
    name: 'Jane Brown',
    company: 'GE Electronics',
    type: 'Small Business',
    city: 'New York',
    phoneNumber: '9090909090',
    email: 'johnbrown@gmail.com',
  },
  {
    key: '3',
    name: 'Jacob Chang',
    company: '3C Electronics',
    type: 'Small Business',
    city: 'Atlanta',
    phoneNumber: '8989897690',
    email: 'johnbrown@gmail.com',
  },
  {
    key: '4',
    name: 'Mufutau',
    company: 'Microsoft',
    type: 'Small Business',
    city: 'Mulhouse',
    phoneNumber: "05514847692",
    email: 'purus@vulputateposuerevulputate.ca',
  },
  {
    key: '5',
    name: 'Edward',
    company: 'Lavasoft',
    type: 'Individual',
    city: 'Bucaramanga',
    phoneNumber: "01419184513",
    email: 'purus@vulputateposuerevulputate.ca',
  },
  {
    key: '6',
    name: 'Kirestin',
    company: 'Chami',
    type: 'Individual',
    city: 'Loughborough',
    phoneNumber: "0107648840",
    email: 'ipsum.primis.in@nuncac.ca',
  },
  {
    key: '7',
    name: 'Jena',
    company: 'Yahoo',
    type: 'Individual',
    city: 'Nampa',
    phoneNumber: "02522615459",
    email: 'at.fringilla@parturientmontesnascetur.ca',
  },
  {
    key: '8',
    name: 'Penelope',
    company: 'Google',
    type: 'Individual',
    city: 'Lonzee',
    phoneNumber: "010498810",
    email: 'felis.eget@Maurisquis.com',
  },
  {
    key: '9',
    name: 'Ima',
    company: 'Chami',
    type: 'Enterprise',
    city: 'Abaetetuba',
    phoneNumber: "05672046522",
    email: 'Nam.tempor@molestie.co.uk',
  },
  {
    key: '10',
    name: 'Joelle',
    company: 'Altavista',
    type: 'Enterprise',
    city: 'Tomsk',
    phoneNumber: "0117571720",
    email: 'consectetuer@tinciduntaliquamarcu.org'
  },
  {
    key: '11',
    name: 'Cole',
    company: 'Sibelius',
    type: 'Enterprise',
    city: 'Los Angeles',
    phoneNumber: "07624959303",
    email: 'convallis@In.ca',
  },
  {
    key: '12',
    name: 'Cyrus',
    company: 'Lavasoft',
    type: 'Enterprise',
    city: 'Delhi',
    phoneNumber: "05510801111",
    email: 'tellus@sodalesMauris.com',
  },
  {
    key: '13',
    name:"Thaddeus",
		company: "Lavasoft",
    type: 'Mid-market',
    city:"Kędzierzyn-Koźle",
		email:"Donec.feugiat.metus@Aliquamfringillacursus.ca",
		phoneNumber: "07649975638",
  },
  {
    key: '14',
    name:"Blythe",
		company: "Yahoo",
    type: 'Mid-market',
		city:"Wechelderzande",
		email:"turpis.vitae@magna.org",
		phoneNumber: "08788483517",
  },
  {
    key: '15',
    name:"Salim",
	  company: "Chami",
    type: 'Mid-market',
		city: "West Jakarta",
		email:"metus.facilisis.lorem@Sedeget.net",
		phoneNumber:"0800730152",
  },
  {
    key: '16',
    name:"Ishmael",
		company: "Apple Systems",
    type: 'Mid-market',
		city:"Porto Cesareo",
		email:"eu.turpis@ipsumprimis.edu",
		phoneNumber:"05598364190",
  },
  
]; 

// rowSelection object indicates the need for row selection

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

export default class Leads extends React.Component {
  state = {
    searchText: '',
    searchedColumn: '',
  };

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
        dataIndex: 'key',
        key: 'key',
        render: (text,key) => <Link to={{pathname: "/leadprofile", state: {uid: key.key} }}> Profile </Link>
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
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        filters: [
          {
            text: 'Individual',
            value: 'Individual',
          },
          {
            text: 'Small Business',
            value: 'Small Business',
          },
          {
            text: 'Mid-market',
            value: 'Mid-market',
          },
          {
            text: 'Enterprise',
            value: 'Enterprise',
          },
        ],
        onFilter: (value, record) => record.name.indexOf(value) === 0,
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
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
    ];

    return (
      <>
        <Table 
          columns={columns}
          dataSource={data}
          rowSelection={{type: "checkbox", ...rowSelection,}}
          title={() => 'Leads'}
          onChange={onChange}
        />
        <div className="add-profile-button"> <NewProfileDialogBox /> </div>
      </>
    );
  }
};