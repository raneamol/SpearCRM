import React from 'react';
import './styles/AccountProfile.css'; //styling of both AccountProfile and LeadProfile pages is the same
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import LeadProfileHeader from "./subcomponents/LeadProfileHeader";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthContext from './Other/AuthContext.js';
import { prepareGETOptions } from './Other/helper.js';

const API = process.env.REACT_APP_API;

export default class LeadProfile extends React.Component {
  state = {
    leadData: {},
    activitiesList: [],
    ordersList: [],
    openSpinner : false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this._isMounted = true;
    const { cid } = this.props.location.state;

    Promise.all([
      fetch(`${API}/main/display_lead/${cid}`, prepareGETOptions(this.context)), 
      fetch(`${API}/main/show_user_activities/${cid}`, prepareGETOptions(this.context))
    ])
    .then(responses => {
      if (this._isMounted) {
        responses[0].json().then( data => this.setState({ leadData: data }));
        responses[1].json().then( data => this.setState({ activitiesList: data }));
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateLeadDataAPICall = async() => {
    fetch(`${API}/main/display_lead/${this.state.leadData._id}`, prepareGETOptions(this.context))
    .then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ leadData: data });
        }
      })
    );
  }

  updateActivitiesAPICall = async() => {
    fetch(`${API}/main/show_user_activities/${this.state.leadData._id}`, prepareGETOptions(this.context))
    .then(response =>
      response.json().then(data => {
        if (this._isMounted) {
          this.setState({ activitiesList: data });
        }
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
    
    fetch(`${API}/main/edit_lead`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(leadDataObj)
    })
    .then( response => {
      if (response.ok) {
        this.updateLeadDataAPICall();
      }
    })
  }

  updateSpinnerInLeadProfile = (bool) => {
    //we introduce delay when turning off spinner, but not when turning it on
    if (bool) {
      this.setState({ openSpinner: bool });
    } else {
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ openSpinner: bool });
        }
      }, 1500)
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
            updateLeadData = {this.updateLeadDataAPICall}
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
          updateActivities = {this.updateActivitiesAPICall}
          activitiesList = {this.state.activitiesList}
          email = {this.state.leadData.email}
          updateSpinner = {this.updateSpinnerInLeadProfile}
        />
        {/* 'lead = 1' communicates that the parent component is LeadProfile */}

        <Backdrop className="spinner-backdrop" open={this.state.openSpinner}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>     
    );
  }
} 