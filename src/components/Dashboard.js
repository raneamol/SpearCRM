import React, {useState, useEffect} from 'react';
import './styles/Dashboard.css';
import Chart from 'react-google-charts';
import CanvasJSReact from './Other/canvasjs.react';
import TopOpportunitiesWidget from './subcomponents/TopOpportunitiesWidget.js'
import NewTaskDialogBox from './subcomponents/NewTaskDialogBox';
import {Link} from 'react-router-dom';

export default function Dashboard() {
	const [topLeads, setTopLeads] = useState([]);
	const [topAccounts, setTopAccounts] = useState([]);
	const [allActivities, setAllActivities] = useState([]);

	useEffect( () => {
		fetch("/main/top_leads").then(response =>
      response.json().then(data => {
        setTopLeads(data);
      })
		);
		
		fetch("/main/show_all_activities").then(response =>
			response.json().then(data => {
				setAllActivities(data);
			})
		);
	}, []);

	//get top accounts too

	const updateDashboardAPICall = () => {
		fetch("/main/top_leads").then(response =>
      response.json().then(data => {
        setTopLeads(data);
      })
		);
		
		fetch("/main/show_all_activities").then(response =>
			response.json().then(data => {
				setAllActivities(data);
			})
		);
	}

	return(
    <div className="grid-container">
			<TopOpportunitiesWidget 
				topLeads = {topLeads} 
				topAccounts = {topAccounts}
			/>
			<LineChart />
      <FunnelChart />
			<UpcomingTasksWidget 
				updateDashboard = {updateDashboardAPICall}
				activitiesList = {allActivities.filter( (activity) => activity["activity_type"] === "future" )}
			/>
    </div>
	); 
} 

const pieOptions = {
  title: "Lead Size",
  pieHole: 0,
  slices: [
    {
      color: "#2BB673"
    },
    {
      color: "#d91e48"
    },
    {
      color: "#007fad"
    },
    {
      color: "#e9a227"
    }
  ],
  legend: {
    position: "bottom",
    alignment: "center",
    textStyle: {
      color: "233238",
      fontSize: 18
    }
  },
  tooltip: {
    showColorCode: true
  },
  chartArea: {
    left: 0,
    top: 0,
    width: "100%",
    height: "80%"
  },
  fontName: "Roboto"
};
class PieChart extends React.Component {
  state = {
    chartImageURI: ""
  };
  render() {
    return (
      <div className="pieChartContainer">
        <Chart
          chartType="PieChart"
					data={[
						['Lead', 'Size'],
					  ['Individuals', 5],
					  ['Small Enterprise', 29],
					  ['Medium Enterprise', 56],
						['Large Enterprise', 8],
					]}
          options={pieOptions}
          graph_id="PieChart"
          width={"100%"}
          height={"100%"}
          legend_toggle
        />
      </div>
    );
  }
}

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
class LineChart extends React.Component {
	render() {
		const lineOptions = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Revenue generated"
			},
			axisY: {
				title: "Revenue (in $1000)",
				includeZero: false,
				suffix: "%"
			},
			axisX: {
				title: "Month",
				prefix: "",
				interval: 1
			},
			data: [{
				type: "line",
				toolTipContent: "Week {x}: {y}%",
				dataPoints: [
          { x: 1, y: 64 },
					{ x: 2, y: 61 },
					{ x: 3, y: 64 },
					{ x: 4, y: 62 },
					{ x: 5, y: 64 },
					{ x: 6, y: 60 },
					{ x: 7, y: 58 },
					{ x: 8, y: 59 },
					{ x: 9, y: 53 },
					{ x: 10, y: 66 },
					{ x: 11, y: 69 },
					{ x: 12, y: 64 },
				]
			}]
		}
		return (
		<div className="line-chart-container">
			<CanvasJSChart options = {lineOptions}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
} 

class FunnelChart extends React.Component {
	render() {
		var dataPoint;
		var total;
		const funnelOptions = {
			animationEnabled: true,
			title:{
				text: "Sales Analysis"
			},
			data: [{
				type: "funnel",
				toolTipContent: "<b>{label}</b>: {y} <b>({percentage}%)</b>",
				indexLabelPlacement: "inside",
				indexLabel: "{label} ({percentage}%)",
				dataPoints: [
					{ y: 5, label: "Leads and Accounts Contacted" },
					{ y: 3, label: "Customers interested" },
					{ y: 2,  label: "Customers who transacted" },
					{ y: 1, label: "Payment" }
				]
			}]
		}
		//calculate percentage
		dataPoint = funnelOptions.data[0].dataPoints;
		total = dataPoint[0].y;
		for(var i = 0; i < dataPoint.length; i++) {
			if(i == 0) {
				funnelOptions.data[0].dataPoints[i].percentage = 100;
			} else {
				funnelOptions.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
			}
		}
		return (
			<div>
				<CanvasJSChart options = {funnelOptions}
					 onRef={ref => this.chart = ref}
				/>
				{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
			</div>
		);
	}
}

class UpcomingTasksWidget extends React.Component {
	componentDidMount() {
		console.log(this.props);
	}

	transitionActivity = async (activityId) => {
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
      this.props.updateDashboard();
    }
  }

  render() {
    return(
      <div className="upcoming-tasks-widget">

        <div className='tasks-widget-title'> 
					&nbsp; Upcoming Tasks 
					<span className="new-task-button"> 
						<NewTaskDialogBox /> 
					</span> 
				</div>

        <hr />

    		<div className="tasks-scroller-container">
    			<ul className="tasks-list">
						{
							//filter activitesList to return only future activities. Then map those activities to the returned block of code.
							this.props.activitiesList.map( (element,i) => {
								return(							
									<div key={i}>
										
										<li className="task-title">		
										&nbsp; <input type="checkbox" className="largerCheckbox" onClick={() => {this.transitionActivity(element._id)}} />
										<Link to={{ pathname: '/accountprofile', state:{cid: element.user_id} }}>
											&nbsp; {element.title}                      
										</Link>
											  <span className="task-date">  {element.date} </span> 
										</li>

										<li className="task-body"> &nbsp; {element.body} </li>
									</div>
								);
							})
						}
    			</ul>
        </div>
      </div>
    );
  }
}

const tasksList = [
	{
		uid:"",
		taskTitle: "Call X",
		taskBody: "Encourage them to buy MSFT",
		taskDate: "Nov. 8",
	},
	{
		uid:"",
		taskTitle: "Call Y",
		taskDate: "Nov. 9",
		taskBody: "Encourage them to buy AMZN",
	},
	{
		uid:"",
		taskTitle: "Call Z",
		taskBody: "Encourage them to buy IBM",
		taskDate: "Nov. 8",
	},
	{
		taskTitle: "Call Company X",
		taskBody: "Encourage them to buy MSFT",
		taskDate: "Nov. 8",
	},
	{
		taskTitle: "Call Company X",
		taskBody: "Encourage them to buy MSFT",
		taskDate: "Nov. 8",
	},
	{
		taskTitle: "Call Company X",
		taskBody: "Encourage them to buy MSFT",
		taskDate: "Nov. 8",
	},
	
];