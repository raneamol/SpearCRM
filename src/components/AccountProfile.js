
import React from 'react';
import './styles/AccountProfile.css';
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import AccountProfileHeader from "./subcomponents/AccountProfileHeader";
import {cloneDeep} from 'lodash';
const _ = require('lodash');


//possible TODO: remove account data, make API response the state 
// OR aD = this.state.accountData & use aD.name, aD.company etc.

//1. SCRAPPED Remove account data nesting, take entire API response as state
//2. DONE Create a grouped change handler for all the states (like fieldContainer cha)
//3. DONE Pass down data  to fieldsContainer and EditableFields
//4. Pass down change handler to fieldsContainer and EditableFields
//5. onSubmit (i.e. when tick is clicked), send post of AccountProfile state. If rsponse ok, reload the page


export default class AccountProfile extends React.Component {
  state = {
    accountData: {},
  };

  componentDidMount() {
    const { cid } = this.props.location.state; //named cid temporarily
    console.log("CID is " + cid);
    fetch(`/main/display_account/${cid}`).then(response =>
      response.json().then(data => {
        data["_id"] = data["_id"]["$oid"]; //TODO:verify source
        this.setState({ accountData: data });
        console.log(data);
      })
    );
  }

  updateAccountProfileAPICall = () => {
    fetch(`/main/display_account/${this.state.accountData._id}`).then(response =>
      response.json().then(data => {
        data["_id"] = data["_id"]["$oid"]; //TODO:verify source
        this.setState({ accountData: data });
      })
    );
  }
  
  handleChange = (event) => {
    console.log("handleChange triggered");
    const deepClone = _.cloneDeep(this.state.accountData);
    deepClone[event.target.name] = event.target.value;
    this.setState({
      accountData : deepClone
    });
  }

  postFields = async () => {
    const accountDataObj = this.state.accountData;
    delete accountDataObj["orders"];
    console.log(accountDataObj);
    const response = await fetch("/main/edit_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(accountDataObj)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      this.updateAccountProfileAPICall();
    }
  }

  render(){


    // let fields_set = {
    //   _id: this.state.accountData._id, 
    //   contact_comm_type: this.state.accountData.contact_comm_type,
    //   name: this.state.accountData.name,
    //   dob: this.state.accountData.name, //needs sorting out on Amol's side
    //   company: this.state.accountData.company,
    //   education: this.state.accountData.education,
    //   city: this.state.accountData.city,
    //   state: this.state.accountData.state,
    //   country: this.state.accountData.country,
    //   last_contact: this.state.accountData.last_contact,
    //   trading_accno: this.state.accountData.trading_accno,
    //   demat_accno: this.state.accountData.demat_accno,
    //   job_type: this.state.accountData.job_type,
    //   marital_status: this.state.accountData.marital_status,
    //   email: this.state.accountData.email,
    //   phone_number: this.state.accountData.phone_number,
    //   latest_order_stage: this.state.accountData.latest_order_stage,
    // };
    //alternative to fields_set is NOT this.state.accountData because orders, activity is not reqd. in FieldContainer


    return(
      <div className="profile-page-grid-container">
        <div className='profile-header-container'>
          <AccountProfileHeader 
            name = {this.state.accountData.name} 
            furthestStage = {this.state.accountData.latest_order_stage} 
            updateAccountProfile = {this.updateAccountProfileAPICall}
            _id_json = { {"_id": this.state.accountData._id} }
          />
        </div>
        <FieldsContainer1 fields={this.state.accountData} handleChange={this.handleChange} onSubmit={this.postFields}/>
        <FieldsContainer2 fields={this.state.accountData} handleChange={this.handleChange} onSubmit={this.postFields}/>
        <ActivityTracker updateAccountProfile={this.updateAccountProfileAPICall}/>
      </div>     
    );
  }
} 

const sample_data = {
  key: '1',
  name: 'John Brown',
  company: '3C Electronics',
  type: 'Small Business',
  city: 'New York',
  phoneNumber: '9090909090',
  email: 'johnbrown@gmail.com',
};