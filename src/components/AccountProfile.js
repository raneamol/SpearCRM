import React from 'react';
import './styles/AccountProfile.css';
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import AccountProfileHeader from "./subcomponents/AccountProfileHeader";

export default class AccountProfile extends React.Component {
  state = {
    accountData: {},
    activitiesList: [],
    ordersList: [],
    accountTurnover: {},
  };

  componentDidMount() {
    this._isMounted = true;
    const { cid } = this.props.location.state;

    Promise.all([
      fetch(`/main/display_account/${cid}`), 
      fetch(`/main/show_user_activities/${cid}`),
      fetch(`/main/display_account_orders/${cid}`),
      fetch(`/main/get_account_turnover/${cid}`)
    ])
    .then(responses => {
      if(this._isMounted) {
        responses[0].json().then( data => this.setState({ accountData: data }));
        responses[1].json().then( data => this.setState({ activitiesList: data }));
        responses[2].json().then( data => this.setState({ ordersList: data }));
        responses[3].json().then( data => this.setState({ accountTurnover: data }));
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //function used by OrdersDisplay and NextSteps in ActivityTracker
  //and also used by markToBeTransactedOrdersAsTransacted in AccountProfileHeader
  updateAccountDataAndOrdersAndActivitiesAPICall = () => {
    Promise.all([
      fetch(`/main/display_account/${this.state.accountData._id}`), 
      fetch(`/main/show_user_activities/${this.state.accountData._id}`),
      fetch(`/main/display_account_orders/${this.state.accountData._id}`),
      fetch(`/main/get_account_turnover/${this.state.accountData._id}`)
    ])
    .then(responses => {
      if(this._isMounted) {
        responses[0].json().then( data => this.setState({ accountData: data }));
        responses[1].json().then( data => this.setState({ activitiesList: data }));
        responses[2].json().then( data => this.setState({ ordersList: data }));
        responses[3].json().then( data => this.setState({ accountTurnover: data }));
      }
    })
  }

  //function used by NewOrderDialogBox after POSTing new order
  updateAccountDataAndOrdersAPICall = () => {
    Promise.all([
      fetch(`/main/display_account/${this.state.accountData._id}`), 
      fetch(`/main/display_account_orders/${this.state.accountData._id}`)
    ])
    .then(responses => {
      if(this._isMounted) {
        responses[0].json().then( data => this.setState({ accountData: data }));
        responses[1].json().then( data => this.setState({ ordersList: data }));
      }
    })
  }

  //function used by FieldContainer1 and FieldContainer2 after POSTing new fields
  updateAccountDataAPICall = () => {
    fetch(`/main/display_account/${this.state.accountData._id}`).then(response =>
      response.json().then(data => {
        if(this._isMounted) {
          this.setState({ accountData: data });
        }
      })
    );
  }

  //function used by ManualLogger after POSTing new order
  updateActivitiesAPICall = () => {
    fetch(`/main/show_user_activities/${this.state.accountData._id}`).then(response =>
      response.json().then(data => {
        if(this._isMounted) {
          this.setState({ activitiesList: data });
        }
      })
    );
  }
  
  //function used to handle change in field container as it is a controlled component
  handleChange = (event) => {
    if (Object.prototype.toString.call(event) === "[object Date]") {
      this.setState({
        accountData : {
          ...this.state.accountData,
          dob : event,
        }
      });
    }
    //above code handles change in date (dob)

    else{
      this.setState({
        accountData : {
          ...this.state.accountData,
          [event.target.name] : event.target.value,
        }
      });
    }
  }

  //function used by FieldContainer1 and FieldContainer2
  postFields = async () => {
    const accountDataObj = this.state.accountData;
    accountDataObj.dob = new Date( Date.parse(accountDataObj.dob) );
    //date and last_contact are sent as date objects
    //all other fields are sent as strings

    const response = await fetch("/main/edit_account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(accountDataObj)
    });
    
    if (response.ok) {
      this.updateAccountDataAPICall();
    }
  }

  render(){
    return(
      <div className="profile-page-grid-container">
        <div className='profile-header-container'>
          <AccountProfileHeader 
            name = {this.state.accountData.name} 
            furthestStage = {this.state.accountData.latest_order_stage} 
            updateAccountDataAndOrdersAndActivities = {this.updateAccountDataAndOrdersAndActivitiesAPICall}
            _id = {this.state.accountData._id}
          />
        </div>
        <FieldsContainer1 
          fields={this.state.accountData} 
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
          lead = {0}
        />
        <FieldsContainer2 
          fields={this.state.accountData} 
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
          accountTurnover={this.state.accountTurnover}
          lead = {0}
        />
        <ActivityTracker 
          _id = {this.state.accountData._id}
          email = {this.state.accountData.email}
          ordersList = {this.state.ordersList}
          activitiesList = {this.state.activitiesList}
          updateAccountDataAndOrdersAndActivities = {this.updateAccountDataAndOrdersAndActivitiesAPICall}
          updateAccountDataAndOrders = {this.updateAccountDataAndOrdersAPICall}
          updateAccountData = {this.updateAccountDataAPICall}
          updateActivities = {this.updateActivitiesAPICall}
          lead = {0}
        />
        {/* 'lead = 0' communicates that the parent component is AccountProfile */}
      </div>     
    );
  }
}