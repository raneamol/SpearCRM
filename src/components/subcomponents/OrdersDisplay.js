import React, {useState} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import '../styles/OrdersDisplay.css'

export default function OrdersDisplay (props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const deleteOrder = (orderId) => {
    fetch(`main/delete_order/${orderId}`).then(response =>
      response.json().then(data => {
        if (data==="Order Deleted"){
          this.props.updateActivityTracker()
          .then( () => this.props.updateAccountProfile())
          .catch( () => console.log("deleteOrder chaining error"));
          //chained together promises
        }
      })
    );
  }

  return (
    <>
      <span className="view-orders-button">
        {/* TODO: Make this width percentage based */}
        <Button style ={{ width:290 }}variant="outlined" color="secondary" onClick={handleOpen}>
          View all orders
        </Button>
      </span>
      {/* button opens the below dialogbox */}

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="form-dialog-title">
          View all orders 
          <span style={{ right: 5 }}> 
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>  
          </span>
        </DialogTitle>
          
        <DialogContent>
          <div className="orders-container">
            <List>

              {/* Display non-archived orders here */}
              {
                props.ordersList.map( (order, i) => {
                  let iconContent = (order.trans_type === "Buy" ? "B" : "S" );
                  let orderLane = (
                    order.stage === 3 ? "Initiated" :
                    order.stage === 2 ? "Finalized" : 
                    order.stage === 1 ? "To-be-transacted" : 
                    order.stage === 0 ? "Transacted" : ""
                  );
                  return(
                    <div key={i}>
                      <ListItem>

                        <ListItemAvatar>
                          <Avatar>
                            <div> {iconContent} </div>
                          </Avatar>
                        </ListItemAvatar>  
                      
                        <ListItemText
                          primary={order.company}
                          secondary={order.cost_of_share*order.no_of_shares+" ("+order.no_of_shares+"X"+order.cost_of_share+")"}
                        />

                        <ListItemSecondaryAction>
                          <div style={{ right:5 }}>
                            {orderLane}
                          </div>

                          <IconButton 
                            edge="end"
                            onClick={deleteOrder(order._id)}  
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>

                      </ListItem>
                    </div>  
                  );                     
                })
              }

              <Divider />
              
              {/* Display archived orders here */}
              {
                props.ordersList.filter( (order) => order.stage === 0 ).map( (order, i) => {
                  let iconContent = (order.trans_type === "Buy" ? "B" : "S" );
                  return(
                    <div key={i}>
                      <ListItem>

                        <ListItemAvatar>
                          <Avatar>
                            <div> {iconContent} </div>
                          </Avatar>
                        </ListItemAvatar>  
                      
                        <ListItemText
                          primary={order.company}
                          secondary={order.cost_of_share*order.no_of_shares+" ("+order.no_of_shares+"X"+order.cost_of_share+")"}
                        />

                        <ListItemSecondaryAction>
                          <div style={{ right:5 }}>
                            Transacted
                          </div>
                          
                        </ListItemSecondaryAction>

                      </ListItem>
                    </div>  
                  );                     
                })
              }
            </List>
          </div>  
        </DialogContent>
      </Dialog>
    </>
  );
}