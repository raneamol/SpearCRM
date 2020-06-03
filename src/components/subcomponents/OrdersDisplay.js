import React, {useState, useEffect, useRef} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from '@material-ui/core/Divider';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import ListIcon from '@material-ui/icons/List';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import '../styles/OrdersDisplay.css'

export default function OrdersDisplay (props) {
  const [open, setOpen] = useState(false);
  const [openSpinner, setOpenSpinner] = useState(false);

  const _isMounted = useRef(true);
  useEffect( () => {
    return () => _isMounted.current = false;
  }, []);
  //isMounted is used to prevent rendering after unmount. Here, related to async calls.

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const deleteOrder = (orderId) => {
    fetch(`main/delete_order/${orderId}`)
    .then( () => props.updateAccountDataAndOrdersAndActivities() );
  }

  const priceCheckFinalizedOrders = () => {
    setOpenSpinner(true);
    fetch("/main/convert_finalized_orders")
    .then( () => {
      if (_isMounted.current) {
        setOpenSpinner(false);
        props.updateAccountDataAndOrdersAndActivities();
      }
    });  
  }

  return (
    <>
      <span>
        {/* TODO: Make this width percentage based */}
        <Button className="add-new-order-button" variant="outlined" color="primary" onClick={handleOpen}>
          <ListIcon />
          <span style={{ marginLeft: 2 }}> View all orders </span>
        </Button>
      </span>
      {/* button opens the below dialogbox */}


      

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={"md"}
      >
        

        <DialogTitle id="form-dialog-title">

          <span> View all orders </span>

          <span style={{ float: "right" }}> 
            <IconButton aria-label="close" onClick={priceCheckFinalizedOrders}>
              <RefreshIcon />
            </IconButton> 

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
                props.ordersList.filter( (order) => order.stage !== 0 ).map( (order, i) => {
                  
                  let iconAvatar = ( 
                    (order.trans_type).toLowerCase() === "buy" ? 
                      <Avatar style={{backgroundColor: "#1976d2"}}>
                        B
                      </Avatar> 
                    :
                      <Avatar style={{backgroundColor: "#dc004e"}}>
                        S
                      </Avatar>
                  );
                  let orderLane = (
                    order.stage === 3 ? "To-be-transacted" :
                    order.stage === 2 ? "Finalized" : 
                    order.stage === 1 ? "Received" : ""
                  );

                  return(
                    <div key={i}>
                      <ListItem>

                        <ListItemAvatar>
                          {iconAvatar}
                        </ListItemAvatar>  
                      
                        <ListItemText
                          primary={order.company}
                          secondary={order.cost_of_share*order.no_of_shares+" ("+order.no_of_shares+"X"+order.cost_of_share+")"}
                        />

                        <ListItemSecondaryAction>
                          <span style={{ right:5 }}>
                            {orderLane}
                          </span>

                          <IconButton 
                            edge="end"
                            onClick={() => deleteOrder(order._id)}  
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
                  let iconContent = ( (order.trans_type).toLowerCase() === "buy" ? "B" : "S" );
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

        <Backdrop className="spinner-backdrop" open={openSpinner}>
          <CircularProgress color="inherit"/>
        </Backdrop> 
        
      </Dialog>
    </>
  );
}