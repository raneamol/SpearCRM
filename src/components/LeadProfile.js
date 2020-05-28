import React from 'react';
import './styles/AccountProfile.css'; //styling of both AccountProfile and LeadProfile pages is the same
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import LeadProfileHeader from "./subcomponents/LeadProfileHeader";

export default class LeadProfile extends React.Component {
  state = {
    leadData: {},
    activitiesList: [],
    ordersList: []
  };

  componentDidMount() {
    const { cid } = this.props.location.state;

    Promise.all([
      fetch(`/main/display_lead/${cid}`), 
      fetch(`/main/show_user_activities/${cid}`),])
    .then(responses => {
      responses[0].json().then( data => this.setState({ leadData: data }));
      responses[1].json().then( data => this.setState({ activitiesList: data }));
    })
  }

  fetchLeadDataAPICall = () => {
    fetch(`/main/display_lead/${this.state.leadData._id}`).then(response =>
      response.json().then(data => {
        this.setState({ leadData: data });
      })
    );
  }

  fetchActivitiesAPICall = () => {
    fetch(`/main/show_user_activities/${this.state.leadData._id}`).then(response =>
      response.json().then(data => {
        this.setState({ activitiesList: data });
      })
    );
  }

  handleChange = (event) => {
    if (Object.prototype.toString.call(event) === "[object Date]") {
      this.setState({
        leadData : {
          ...this.state.leadData,
          dob : event,
        }
      });
    }
    //above code handles change in date (dob)
    else{
      this.setState({
        leadData : {
          ...this.state.leadData,
          [event.target.name] : event.target.value,
        }
      });
    }
  }

  onDivClick = (event) => {
    this.setState({ 
      leadData: {
        ...this.state.leadData,
        status: event.target.id
      }
    }, () => {this.postFields()} );
  }

  postFields = async () => {
    const leadDataObj = this.state.leadData;
    leadDataObj.dob = new Date( Date.parse(leadDataObj.dob) );
    const response = await fetch("/main/edit_lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadDataObj)
    });
    
    if (response.ok) {
      this.fetchLeadDataAPICall();
    }
  }

  render(){
    return(
      <div className="profile-page-grid-container">
        <div className='profile-header-container'>
          <LeadProfileHeader
            onDivClick = {this.onDivClick} 
            name = {this.state.leadData.name}
            leadStatus = {this.state.leadData.status}
            _id = {this.state.leadData._id}
            fetchLeadData = {this.fetchLeadDataAPICall}
          />
        </div>
        <FieldsContainer1 
          fields={this.state.leadData}
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
          lead = {1}
        /> 
        <FieldsContainer2
          fields={this.state.leadData}
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
          lead = {1}
        /> 
        <ActivityTracker 
          _id = {this.props.location.state.cid}
          lead = {1}
          fetchActivities = {this.fetchActivitiesAPICall}
          activitiesList = {this.state.activitiesList}
        />
{/* 'lead = 1' communicates that the parent component is LeadProfile */}
      </div>     
    );
  }
} 