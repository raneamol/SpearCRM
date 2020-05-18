
import React from 'react';
import './styles/AccountProfile.css';
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import AccountProfileHeader from "./subcomponents/AccountProfileHeader";

export default class AccountProfile extends React.Component {
  state = {
    accountData: {},
  };

  componentDidMount() {
    const { cid } = this.props.location.state;
    console.log("CID is " + cid);
    fetch(`/main/display_account/${cid}`).then(response =>
      response.json().then(data => {
        this.setState({ accountData: data });
        console.log(data);
      })
    );
  }

  updateAccountProfileAPICall = () => {
    fetch(`/main/display_account/${this.state.accountData._id}`).then(response =>
      response.json().then(data => {
        this.setState({ accountData: data });
      })
    );
  }
  
  handleChange = (event) => {
    console.log("handleChange triggered");
    this.setState({
      accountData : {
        ...this.state.accountData,
        [event.target.name] : (event.target.id === "dob" ? event.toISOString() : event.target.value),
      }
    });
  }

  postFields = async () => {
    const accountDataObj = this.state.accountData;
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
    return(
      <div className="profile-page-grid-container">
        {console.log(this.state.accountData)}
        <div className='profile-header-container'>
          <AccountProfileHeader 
            name = {this.state.accountData.name} 
            furthestStage = {this.state.accountData.latest_order_stage} 
            updateAccountProfile = {this.updateAccountProfileAPICall}
            _id = { {"_id": this.state.accountData._id} }
          />
        </div>
        <FieldsContainer1 
          fields={this.state.accountData} 
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
        />
        <FieldsContainer2 
          fields={this.state.accountData} 
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
          lead = {0}
        />
        <ActivityTracker 
          _id = {this.props.location.state.cid}
          updateAccountProfile = {this.updateAccountProfileAPICall}
          lead = {0}
        />
        {/* 'lead = 0' communicates that the parent component is AccountProfile */}
      </div>     
    );
  }
}