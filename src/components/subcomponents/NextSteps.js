import React from 'react'
import '../styles/PrettyList.css'

export default function NextSteps() {
  return(
    <> 
      <h2> Next Steps </h2>
      <div className="pretty-list">
        
        <ul className="experiences">
          {sample_activity.map( (element, i) => {
            return (
              <li className="blue" key={i}>
                <input className="largerCheckbox" type="checkbox" />
                <div className="where"> {element.activityTitle} </div>
                <div className="when"> {element.activityData} </div>
                <p className="description"> {element.activityBody} </p>
             </li>
            );
          })
          }
        </ul>
      </div>
    </>
  )
}

const sample_activity = [
  {
    activityTitle: "Past Event/Task",
    activityData: "2020-04-01",
    activityBody: "Signed $10k deal",
  },
  {
    activityTitle: "Logged call",
    activityData: "2020-03-01",
    activityBody: "Talked business",
  },
  {
    activityTitle: "Sent email",
    activityData: "2020-04-04",
    activityBody: "Sent prospective deal",
  },
];