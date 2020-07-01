import React, {useEffect, useState, useRef, useContext} from 'react'
import '../styles/ActivityTracker.css'
import ManualLogger from './ManualLogger.js'
import NextSteps from './NextSteps'
import PastActivity from './PastActivity'
import NewOrderDialogBox from './NewOrderDialogBox'
import OrdersDisplay from './OrdersDisplay'
import Button from "@material-ui/core/Button";
import EmailIcon from '@material-ui/icons/Email';
import AuthContext from '../Other/AuthContext.js';

const API = process.env.REACT_APP_API;
export default function ActivityTracker(props) {
  const [activityType, setActivityType] = useState("past"); //past or future
  const [activityTitle, setActivityTitle] = useState("");
  const [activityBody, setActivityBody] = useState("");
  const [activityDate, setActivityDate] = useState(new Date());
  
  const authToken = useContext(AuthContext);

  const _isMounted = useRef(true);
  useEffect( () => {
    return () => _isMounted.current = false;
  }, []);
  //isMounted is used to prevent memory leaks related to async state updates

  const handleActivityType = (event, newActivityType) => {
    if (newActivityType !== null) {
      setActivityType(newActivityType);
    }
  };

  const handleChangeInBody = (event) => {
    setActivityBody(event.target.value);
  };

  const handleChangeInTitle = (event) => {
    setActivityTitle(event.target.value);
  };

  const handleChangeInDate = (event) => {
    setActivityDate(event);
  };

  const postNewActivity = async () => {
    let today = new Date();
    //erroneous and disallowed inputs specified in the below if condition
    if(    ( activityType === "future" && activityDate.getTime() <= today.getTime() )
    || ( activityType === "past"   && activityDate.getTime() > today.getTime() ) 
    || ( activityTitle === "" )
    ){
      return null;
    }

    props.updateSpinner(true);
    
    const newActivity = {
      "user_id": props._id,
      "title": activityTitle,
      "body": activityBody,
      "date": new Date( Date.parse(activityDate) ),
      "activity_type": activityType,
    };

    fetch(`${API}/main/create_activity`, {
      method: "POST",
      withCredentials: true,
      headers: {'Authorization' : 'Bearer ' + authToken, 'Content-Type': 'application/json'},
      body: JSON.stringify(newActivity)
    })
    .then( response => {
      if (response.ok) {
        if(_isMounted.current) {
          setActivityBody("");
          setActivityTitle("");
          props.updateActivities();
        }
      }
      else {
        throw new Error("Something went wrong");
      }
    })
    .catch(error => console.log(error))
    .then( () => {if(_isMounted.current) {props.updateSpinner(false)}}) 
  }

  let ordersComponents = null;
  if (!props.lead) {
    ordersComponents = (
      // <div className="orders-components-container">
      <>
        <NewOrderDialogBox 
          account_id={props._id} 
          updateAccountDataAndOrders = {props.updateAccountDataAndOrders}
        />

        <OrdersDisplay 
          ordersList={props.ordersList} 
          updateAccountDataAndOrdersAndActivities = {props.updateAccountDataAndOrdersAndActivities}
          updateSpinner = {props.updateSpinner}
          cache = {props.cache}
        />
      </>

      // </div>
    );
  }
  //orders components shouldn't render for a lead

  return(
    <div className="activity-tracker-container">
      <h2 style={{ textAlign: "center"}}> Activity Tracker</h2>
      
      <EmailComposer email={props.email} /> 
      {ordersComponents}
      <ManualLogger 
        draftType={activityType} 
        draftTitle={activityTitle}
        draftDate={activityDate}
        draftBody={activityBody}
        onToggle={handleActivityType}
        handleChangeInBody={handleChangeInBody}
        handleChangeInTitle={handleChangeInTitle}
        handleChangeInDate={handleChangeInDate}
        postNewActivity={postNewActivity}
        updateActivities={props.updateActivities}
      />
      <NextSteps 
        activitiesList={props.activitiesList.filter(activity => activity["activity_type"] === "future")} 
        updateAccountDataAndOrdersAndActivities = {props.updateAccountDataAndOrdersAndActivities}
        updateActivities = {props.updateActivities}
        cache = {props.cache}
        lead = {props.lead}
        updateSpinner = {props.updateSpinner}
      />
      <PastActivity
        activitiesList={props.activitiesList.filter(activity => activity["activity_type"] === "past")}
      />
    </div>
  ); 
}

function EmailComposer(props) {
  return(
    <a 
      href={`https://mail.google.com/mail?view=cm&fs=1&to=${props.email}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button  variant="outlined" color="secondary" className="email-button">
        <EmailIcon/> 
        <span> &nbsp; Compose an email </span>
      </Button>
    </a>
  );
}