import React, {useEffect, useState} from 'react'
import '../styles/ActivityTracker.css'
import ManualLogger from './ManualLogger.js'
import PrettyList from './PrettyList.js'
import NextSteps from './NextSteps'

export default function ActivityTracker() {
  const [activityType, setActivityType] = useState("future"); //past or future
  const [activityTitle, setActivityTitle] = useState("");
  const [activityBody, setActivityBody] = useState("");
  const [activityDate, setActivityDate] = useState(new Date().toJSON().slice(0,10));

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
  // onToggle = event => {
  //   this.setState({
  //     activityType: event.target.id
  //   }); 
  // }

  // handleToggle = (event, newActivityType) => {
  //   if (newActivityType !== null) {
  //     this.setState{( ActivityType:newActivityType )};
  //   }
  // };

  // handleDateChange = event => {
  //   this.setState({
  //     draftDate: event.target.value
  //   });
  // }

  // handleChange = event => {
  //   this.setState({
  //     draftBody: event.target.value
  //   });
  // }

  // onSubmit = () => {
  //   //check draftDate and type match
  //   const activity = this.state;
  //   const response = fetch('/add_activity', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': "application/json"
  //     },
  //     body: JSON.stringify()
  //   });
  //   if (response.ok) {
  //     console.log("Response to add_activity worked");
  //   }
  // }

  // componentDidUpdate() {
  //   console.log(this.state);
  // }
  
  return(
    <div className="activity-tracker-container">
      <h2 style={{ textAlign: "center"}}> Activity Tracker</h2>
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
      />
      <NextSteps />
      <PastActivity />
    </div>
  ); 
}

function PastActivity() {
  return(
    <>
      <h2> Past Activity </h2>
      <PrettyList />
    </>
  );
}

class EmailAutomator extends React.Component {
  render() {
    let emailTo = "testing@gmail.com";
    let emailSubject = "Testing whether email automation could work well";
    let emailBody = "It seems that email automation could work well. I can't guarantee it, but this solution is great."
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