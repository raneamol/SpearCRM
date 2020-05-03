import React, {useEffect} from 'react'
import '../styles/PrettyList.css'

export default function NextSteps(props) {
  useEffect (() => {
    console.log(props);
  })

  const transitionActivity = async (activityId) => {
    const activityToTransition = {
      "_id" : activityId,
      "activity_type" : "past"
    };

    const response = await fetch("/main/change_activity_type", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(activityToTransition)
    });

    if (response.ok) {
      console.log("response worked!");
      console.log(response);
      props.updateActivityTracker();
    }
  }

  return(
    <> 
      <h2> Next Steps </h2>
      <div className="pretty-list">
        
        <ul className="experiences">
          {props.activitiesList.map( (element, i) => {
            return (
              <li className="blue" key={i}>
                <input className="largerCheckbox" type="checkbox" onClick={() => {transitionActivity(element._id)}}/>
                <div className="where"> {element.title} </div>
                <div className="when"> {element.date} </div>
                <p className="description"> {element.body} </p>
             </li>
            );
          })
          }
        </ul>
      </div>
    </>
  );
}