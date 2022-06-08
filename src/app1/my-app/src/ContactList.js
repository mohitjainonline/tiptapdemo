import React from 'react';
//import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8010';

// const styles = theme => ({
//   root: {
//     width: '100%',
//     maxWidth: 360,
//     margin: 10,
//     backgroundColor: theme.palette.background.paper,
//     overflow: 'auto',
//     position: 'relative',
//     maxHeight: 700,
//   },
//   margin: {
//     margin: theme.spacing.unit * 2,
//   },
//   padding: {
//     padding: `0 ${theme.spacing.unit * 2}px`,
//   },
//   title: {
//     margin: `${theme.spacing.unit * 1}px 0 ${theme.spacing.unit * 1}px`,
//   },
// });

function NotifBadge(props) {
  if(props.notifNum === 0) {
    return null;
  }
  return <Badge color="secondary" badgeContent={props.notifNum} ></Badge>;
}

class ContactList extends React.Component {
  constructor(props) {
    super(props);
  }

  pickFriendCallback = (e, item) => {
    if(!item.editMode || (item.editMode && item.updatedBy === this.props.username)){
      e.preventDefault();
      this.props.pickFriendCallback(e, item);
    }
  }

  render() {
    //const { classes } = this.props;
    var listItems = this.props.friendList.map(item => (
      <ListItem button divider
      key={item._id}
      onClick={(e) => this.pickFriendCallback(e, item)}
      >
      <Avatar src={item.icon} />
      <ListItemText primary={item.name} secondary={item.updatedBy} />
      {/* <NotifBadge notifNum={item.notifNum}/> */}
      </ListItem> 
    ));
    return (
      <div>
        <Typography variant="title" style={{margin: 10}}>              
          Question list
        </Typography>
        <List >
          {listItems}
        </List>
      </div>
    );
  }
}

// ContactList.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default (ContactList);
