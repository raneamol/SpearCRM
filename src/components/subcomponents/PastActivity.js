import React from 'react'
import '../styles/PrettyList.css'

export default function PastActivity(props) {
  return(
    <> 
      <h2> Past Activity</h2>
      <div className="pretty-list">
        <ul className="experiences">
          {props.activitiesList.map( (element, i) => {
            return (
              <li className="blue" key={i}>
                <div className="where"> {element.elapsed ? "&#10006;" : "" } {element.title} </div>
                <div className="when"> {element.date} </div>
                <p className="description"> {element.body} </p>
             </li>
            );
          })
          }
        </ul>
      </div>
    </>
  )
}