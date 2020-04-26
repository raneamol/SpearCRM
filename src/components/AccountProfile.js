import React from 'react';
import './styles/AccountProfile.css';
import FieldsContainer from "./subcomponents/FieldsContainer";
import ActivityTracker from "./subcomponents/ActivityTracker";
import AccountProfileHeader from "./subcomponents/AccountProfileHeader";

export default class AccountProfile extends React.Component {
  componentDidMount() {
    const { uid } = this.props.location.state;
    console.log("UID is " + uid);
  }

  render(){
    return(
      <div className="profile-page-grid-container">
        <div className='profile-header-container'>
          <AccountProfileHeader />
        </div>
        <FieldsContainer fields={sample_data} container="Generic"/>
        <FieldsContainer fields={sample_data} container="Specific"/>
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