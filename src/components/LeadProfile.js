import React from 'react';
import './styles/AccountProfile.css'; //styling of both AccountProfile and LeadProfile pages is the same
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import LeadProfileHeader from "./subcomponents/LeadProfileHeader";
const _ = require('lodash');

export default class LeadProfile extends React.Component {
  state = {
    leadData: {},
  };

  componentDidMount() {
    const { cid } = this.props.location.state;
    console.log("CID is " + cid);
    fetch(`/main/display_lead/${cid}`).then(response =>
      response.json().then(data => {
        this.setState({ leadData: data });
        console.log(data);
      })
    );
  }

  updateLeadProfileAPICall = () => {
    fetch(`/main/display_lead/${this.state.leadData._id}`).then(response =>
      response.json().then(data => {
        this.setState({ leadData: data });
      })
    );
  }

  handleChange = (event) => {
    console.log("handleChange triggered");
    const deepClone = _.cloneDeep(this.state.leadData);
    deepClone[event.target.name] = event.target.value;
    this.setState({
      leadData : deepClone
    });
  }

  componentDidUpdate() {
    console.log("Status is " + this.state.status);
  }

  onDivClick = (event) => {
    const deepClone = _.cloneDeep(this.state.leadData);
    deepClone.status = event.target.id; //used to be event.target.value
    this.setState({ 
      leadData: deepClone
    });
    this.postFields();
  }

  postFields = async () => {
    const leadDataObj = this.state.leadData;
    console.log(leadDataObj);
    const response = await fetch("/main/edit_lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadDataObj)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      this.updateLeadProfileAPICall();
    }
  }

  render(){
    return(
      <div className="profile-page-grid-container">
        {console.log(this.state.leadData)}
        <div className='profile-header-container'>
          <LeadProfileHeader
            onClick = {this.onDivClick} 
            name = {this.state.leadData.name}
            leadStatus = {this.state.leadData.status}
            _id = {this.state.leadData._id}
            updateLeadProfile = {this.updateLeadProfileAPICall}
          />
        </div>
        <FieldsContainer1 
          fields={this.state.leadData}
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
        /> 
        <FieldsContainer2
          fields={this.state.leadData}
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
        /> 
        <ActivityTracker 
          _id = {this.props.location.state.cid}
          lead = {1}
        />
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