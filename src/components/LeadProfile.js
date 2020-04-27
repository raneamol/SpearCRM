import React from 'react';
import './styles/AccountProfile.css'; //styling of both AccountProfile and LeadProfile pages is the same
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import LeadProfileHeader from "./subcomponents/LeadProfileHeader";

export default class LeadProfile extends React.Component {

  state = {
    status: "contacted" //contacted or uncontacted
  };

  componentDidMount() {
    const { uid } = this.props.location.state;
    console.log("UID is " + uid);
  }

  componentDidUpdate() {
    console.log("Status is " + this.state.status);
  }

  onDivClick = event => {
    //TODO:POST REQUEST. IF RESPONSE OKAY:
    this.setState({ status:event.target.id });
  }

  render(){
    return(
      <div className="profile-page-grid-container">
        <div className='profile-header-container'>
          <LeadProfileHeader onClick={this.onDivClick} leadStatus={this.state.status}/>
        </div>
        <FieldsContainer1 fields={sample_data}/> 
        <FieldsContainer2 fields={sample_data}/>
        <ActivityTracker />
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