import React from 'react'
import '../styles/PrettyList.css'
import {convertIsoDateToDateString} from "../Dashboard.js"


export default function PastActivity(props) {
  return(
    <> 
      <h2> Past Activity</h2>
      <div className="pretty-list">
        <ul className="experiences">
          {props.activitiesList.map( (element, i) => {
            let cross = null;
            if (element.elapsed) {
              cross=<span> &#10006; </span>
            }
            return (
              <li className="blue" key={i}>
                <div className="where"> {cross} {element.title} </div>
                <div className="when"> {convertIsoDateToDateString(element.date)} </div>
                <p className="description"> {element.body} </p>
             </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}