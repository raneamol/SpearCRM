import React, {useEffect, useState, useRef} from 'react'
import '../styles/ActivityTracker.css'
import ManualLogger from './ManualLogger.js'
import NextSteps from './NextSteps'
import PastActivity from './PastActivity'
import NewOrderDialogBox from './NewOrderDialogBox'
import OrdersDisplay from './OrdersDisplay'

export default function ActivityTracker(props) {
  const [activityType, setActivityType] = useState("past"); //past or future
  const [activityTitle, setActivityTitle] = useState("");
  const [activityBody, setActivityBody] = useState("");
  const [activityDate, setActivityDate] = useState(new Date());
  
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
    console.log("entered");
    //erroneous and disallowed inputs specified in the below if condition
    if( activityType === "future" && activityDate.getTime() <= today.getTime()
        || activityType === "past"   && activityDate.getTime() > today.getTime() 
        || activityTitle === ""
    ){
      return null;
    }

    const newActivity = {
      "user_id": props._id,
      "title": activityTitle,
      "body": activityBody,
      "date": new Date( Date.parse(activityDate) ),
      "activity_type": activityType,
    };
    const response = await fetch("/main/create_activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newActivity)
    });
    
    if (response.ok && _isMounted.current) {
      setActivityBody("");
      setActivityTitle("");
      props.fetchActivities();
    }
  }

  let ordersComponents = null;
  if (!props.lead) {
    ordersComponents = (
      <div className="orders-components-container">
        <NewOrderDialogBox 
          account_id={props._id} 
          fetchAccountDataAndOrders = {props.fetchAccountDataAndOrders}
        />

        <OrdersDisplay 
          ordersList={props.ordersList} 
          fetchAccountDataAndOrdersAndActivities = {props.fetchAccountDataAndOrdersAndActivities}
        />
      </div>
    );
  }
  //orders components shouldn't render for a lead

  return(
    <div className="activity-tracker-container">
      <h2 style={{ textAlign: "center"}}> Activity Tracker</h2>
      {ordersComponents}
      <EmailAutomator />
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
        fetchActivities={props.fetchActivities}
      />
      <NextSteps 
        activitiesList={props.activitiesList.filter(activity => activity["activity_type"] === "future")} 
        fetchAccountDataAndOrdersAndActivities = {props.fetchAccountDataAndOrdersAndActivities}
        fetchActivities = {props.fetchActivities}
        lead = {props.lead}
      />
      <PastActivity
        activitiesList={props.activitiesList.filter(activity => activity["activity_type"] === "past")}
      />
    </div>
  ); 
}

class EmailAutomator extends React.Component {
  render() {
    let emailTo = "testing@gmail.com";
    let emailSubject = "Stock prospects";
    let emailBody = "MSFT stocks are being retailed at an all time low. Do call back if you're interested."
    let emailHref = ("https://mail.google.com/mail?view=cm&fs=1" +
      (emailTo ? ("&to=" + encodeURIComponent(emailTo)) : "") +
      (emailSubject ? ("&su=" + encodeURIComponent(emailSubject)) : "") +
      (emailBody ? ("&body=" + encodeURIComponent(emailBody)) : ""));
    //cc and bcc are parameters that are also available
    return(
      <>
        <div> 
          <a style={{fontSize:20}} href={emailHref} target="_blank"> &#9993; Draft automated email  
          </a>
        </div>
      </>
    );
  }
}