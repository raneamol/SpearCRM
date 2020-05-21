import React, {useEffect, useState} from 'react'
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
  const [activityDate, setActivityDate] = useState(new Date().toJSON().slice(0,10));
  const [activitiesList, setActivitiesList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

//   [{"_id": "5eaade1967f5adbdd24460a7", "title": "Finalize Amol's order", "body": "eh", "date": “2020-02-04T15:08:56.000Z”, "activity_type": "future", "user_id": "5ea58fbc63e50fc607cf6a10", "elapsed": 0}, 
//   {"_id": "5eaade2467f5adbdd24460a8", "title": "Finalize Amol's order", "body": "eh", "date": “2020-02-04T15:08:56.000Z”, "activity_type": "past", "user_id": "5ea58fbc63e50fc607cf6a10", "elapsed": 0}]

  useEffect( () => {
    Promise.all([fetch(`/main/show_user_activities/${props._id}`), fetch(`/main/display_account_orders/${props._id}`)])
    .then(values => {
      values[0].json().then( activities => setActivitiesList(activities));
      values[1].json().then( orders => setOrdersList(orders));
    });
  }, []);

  const updateActivityTrackerAPICall = async () => {
    Promise.all([fetch(`/main/show_user_activities/${props._id}`), fetch(`/main/display_account_orders/${props._id}`)])
    .then(values => {
      values[0].json().then( activities => setActivitiesList(activities));
      values[1].json().then( orders => setOrdersList(orders));
    });
  }
  //above API call is defined as async function to chain it with updateAccountProfileAPICall
  //for components like newOrderDialogBox

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
    const newActivity = {
      "user_id": props._id,
      "title": activityTitle,
      "body": activityBody,
      "date": new Date( Date.parse(activityDate) ),
      "activity_type": activityType,
    };
    console.log(newActivity);
    const response = await fetch("/main/create_activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newActivity)
    });
    
    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      updateActivityTrackerAPICall();
    }
  }

  let ordersComponents = null;
  if (!props.lead) {
    ordersComponents = (
      <div className="orders-components-container">
        <NewOrderDialogBox 
          account_id={props._id} 
          updateActivityTracker={updateActivityTrackerAPICall} 
          updateAccountProfile={props.updateAccountProfile} 
        />
        <OrdersDisplay 
          ordersList={ordersList} 
          updateAccountProfile={props.updateAccountProfile} 
          updateActivityTracker={updateActivityTrackerAPICall} 
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
        postNewActivity = {postNewActivity}
      />
      <NextSteps 
        activitiesList={activitiesList.filter(activity => activity["activity_type"] === "future")} 
        updateActivityTracker={updateActivityTrackerAPICall}
        updateAccountProfile={props.updateAccountProfile}
      />
      <PastActivity
        activitiesList={activitiesList.filter(activity => activity["activity_type"] === "past")}
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