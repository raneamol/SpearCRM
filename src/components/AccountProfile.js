import React from 'react';
import './styles/AccountProfile.css';
import FieldsContainer1 from "./subcomponents/FieldsContainer1";
import FieldsContainer2 from "./subcomponents/FieldsContainer2";
import ActivityTracker from "./subcomponents/ActivityTracker";
import AccountProfileHeader from "./subcomponents/AccountProfileHeader";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthContext from './Other/AuthContext.js';
import { prepareGETOptions } from './Other/helper.js';

const API = process.env.REACT_APP_API;

export default class AccountProfile extends React.Component {
  state = {
    accountData: {},
    activitiesList: [],
    ordersList: [],
    accountTurnover: {},
    openSpinner : false,
  };

  static contextType = AuthContext;

  componentDidMount() {
    this._isMounted = true;
    const { cid } = this.props.location.state;

    Promise.all([
      fetch(`${API}/main/display_account/${cid}`, prepareGETOptions(this.context) ), 
      fetch(`${API}/main/show_user_activities/${cid}`, prepareGETOptions(this.context) ),
      fetch(`${API}/main/display_account_orders/${cid}`, prepareGETOptions(this.context) ),
      fetch(`${API}/main/get_account_turnover/${cid}`, prepareGETOptions(this.context) )
    ])
    .then(responses => {
      if(this._isMounted) {
        responses[0].json().then( data => this.setState({ accountData: data }), prepareGETOptions(this.context));
        responses[1].json().then( data => this.setState({ activitiesList: data }), prepareGETOptions(this.context));
        responses[2].json().then( data => this.setState({ ordersList: data }), prepareGETOptions(this.context));
        responses[3].json().then( data => this.setState({ accountTurnover: data }), prepareGETOptions(this.context));
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  //function used by OrdersDisplay and NextSteps in ActivityTracker
  //and also used by markToBeTransactedOrdersAsTransacted in AccountProfileHeader
  updateAccountDataAndOrdersAndActivitiesAPICall = async () => {
    Promise.all([
      fetch(`${API}/main/display_account/${this.state.accountData._id}`, prepareGETOptions(this.context)), 
      fetch(`${API}/main/show_user_activities/${this.state.accountData._id}`, prepareGETOptions(this.context)),
      fetch(`${API}/main/display_account_orders/${this.state.accountData._id}`, prepareGETOptions(this.context)),
      fetch(`${API}/main/get_account_turnover/${this.state.accountData._id}`, prepareGETOptions(this.context))
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
  updateAccountDataAndOrdersAPICall = async () => {
    Promise.all([
      fetch(`${API}/main/display_account/${this.state.accountData._id}`, prepareGETOptions(this.context)), 
      fetch(`${API}/main/display_account_orders/${this.state.accountData._id}`, prepareGETOptions(this.context))
    ])
    .then(responses => {
      if(this._isMounted) {
        responses[0].json().then( data => this.setState({ accountData: data }));
        responses[1].json().then( data => this.setState({ ordersList: data }));
      }
    })
  }

  //function used by FieldContainer1 and FieldContainer2 after POSTing new fields
  updateAccountDataAPICall = async () => {
    fetch(`${API}/main/display_account/${this.state.accountData._id}`, prepareGETOptions(this.context))
    .then(response =>
      response.json().then(data => {
        if(this._isMounted) {
          this.setState({ accountData: data });
        }
      })
    );
  }

  //function used by ManualLogger after POSTing new order
  updateActivitiesAPICall = async () => {
    fetch(`${API}/main/show_user_activities/${this.state.accountData._id}`, prepareGETOptions(this.context))
    .then(response =>
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

    fetch(`${API}/main/edit_account`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + this.context, 'Content-Type': 'application/json'},
      body: JSON.stringify(accountDataObj)
    })
    .then(response => {
      if (response.ok) {
        this.updateAccountDataAPICall();
      }
    })
  }

  updateSpinnerInAccountProfile = (bool) => {
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
          <AccountProfileHeader 
            name = {this.state.accountData.name} 
            furthestStage = {this.state.accountData.latest_order_stage} 
            updateAccountDataAndOrdersAndActivities = {this.updateAccountDataAndOrdersAndActivitiesAPICall}
            _id = {this.state.accountData._id}
            cache = {this.props.cache}
            updateSpinner = {this.updateSpinnerInAccountProfile}
          />
        </div>
        <FieldsContainer1 
          fields={this.state.accountData} 
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
          lead = {0}
          accountTurnover={this.state.accountTurnover}
        />
        <FieldsContainer2 
          fields={this.state.accountData} 
          handleChange={this.handleChange} 
          onSubmit={this.postFields}
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
          cache = {this.props.cache}
          lead = {0}
          updateSpinner = {this.updateSpinnerInAccountProfile}
        />
        {/* 'lead = 0' communicates that the parent component is AccountProfile */}

        <Backdrop className="spinner-backdrop" open={this.state.openSpinner}>
          <CircularProgress color="primary" />
        </Backdrop>
      </div>     
    );
  }
}