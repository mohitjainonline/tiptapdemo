import React from 'react';
//import PropTypes from 'prop-types';
//import { withStyles } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

// const styles = {
//   root: {
//     flexGrow: 1,
//   },
//   flex: {
//     flex: 1,
//   },
//   menuButton: {
//     marginLeft: -12,
//     marginRight: 20,
//   },
// };

class ButtonAppBar extends React.Component {
  constructor(props) {
    super(props);
  }
  logout = e => {
    var retrievedObject = sessionStorage.clear();
    if(retrievedObject == null) {
      window.alert('logging out...');
      window.location = '/login';
    }
  }
  render() {
    //const { classes } = this.props;
    return (
      <div >
        <AppBar position="static">
          <Toolbar>
            <IconButton  color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" >
              {this.props.username}
            </Typography>
            <Button color="inherit" onClick={e => this.logout(e)}>Sign out</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

// ButtonAppBar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default (ButtonAppBar);
