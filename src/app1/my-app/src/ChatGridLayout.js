import React from 'react';
//import PropTypes from 'prop-types';
//import { makeStyles } from '@mui/material/styles';
 import ContactList from './ContactList.js';
// import ChatRoomLayout from './ChatRoomLayout.js';
import { Button, Grid } from '@mui/material';
 import ButtonAppBar from './ButtonAppBar.js';
import axios from 'axios';
import Tiptap from './Tiptap.jsx';
import io from 'socket.io-client';

axios.defaults.baseURL = 'http://localhost:8010';


// const useStyles = makeStyles({
//   root: {
//     flexGrow: 1,
//   },
// });


class ChatGridLayout extends React.Component{
  constructor(props) {
    super(props);
    this.state = ({
      username: "",
      icon: "",
      friendname: "chat bot",
      friendicon: "./assets/bot.png",
      subheader: "Please select who you want to chat with～",
      messageList: [],
      friendList: [],
      pickFriendBoolean: false,
      question : {}
    });
    this.myRef = React.createRef();
    
  }
  componentDidMount(){
    var retrievedObject = sessionStorage.getItem('userInfo');
    if(retrievedObject == null) {
      window.alert('Invalid login, please login again！');
      window.location = '/login';
    } else {
      // window.alert(retrievedObject + '\nsign in suceesfully！');
      // console.log(retrievedObject);
      retrievedObject = JSON.parse(retrievedObject);
      var myicon = '';
      this.socket = io("http://localhost:8010");
    this.socket.emit('username', retrievedObject.username);
    this.socket.on('question', (msg) => {
      this.loadQuestions(retrievedObject);
    });
      axios.get('/user/myicon', {
        params: {
          username: retrievedObject.username
        }
      })
      .then((res) => {
        myicon = res['data']['icon'];
        this.setState({
          username: retrievedObject.username,
          icon: myicon
        });
        document.title = retrievedObject.username;
      })
      .catch(function (error) {
        console.log(error);
      });  
      this.loadQuestions(retrievedObject); 

    }
  }

  loadQuestions = (retrievedObject) =>{
    axios.get('/question/all', {
      params: {
        username: retrievedObject.username
      }
    })
    .then( (res) => {
      // console.log(res['data']);
      this.setState({
        friendList: res['data'],
      });
      // this.forceUpdate();
    })
    .catch(function (error) {
      console.log(error);
    });  
  }

  addMsgCallback = (item) => {
    let tmp = this.state.friendList.slice(); 
    for(var i = 0; i < tmp.length; i++) {
      if(tmp[i].friendname === item.authorName) {
        tmp[i].lastMsg = item.msg + ' (' + item.time + ')';
        // tmp[i].notifNum += 1;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      } else if(tmp[i].friendname === item.toName) {
        tmp[i].lastMsg = 'I: ' + item.msg + ' (' + item.time + ')';
        // tmp[i].notifNum += 1;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      }
    }
    
    this.setState({
      messageList: this.state.messageList.concat(item)
    }, () => {
      // console.log(this.state.messageList);
    });
  }
  addNotifCallback = (item) => {
    let tmp = this.state.friendList.slice(); 
    for(var i = 0; i < tmp.length; i++) {
      if(tmp[i].friendname === item.otherFriendName) {
        tmp[i].lastMsg = item.msg + ' (' + item.time + ')';
        tmp[i].notifNum += 1;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      }
    }
  }

  clearNotifCallback = (friendname) => {
    let tmp = this.state.friendList.slice(); 
    for(var i = 0; i < tmp.length; i++) {
      if(tmp[i].friendname === friendname) {
        tmp[i].notifNum = 0;
        this.setState({friendList: tmp}, () => {
          // console.log(this.state.friendList);
        });
        break;
      }
    }
  }
  saveContent = () =>{
    console.log(this.myRef.current.props.editor.getHTML())
    let html = this.myRef.current.props.editor.getHTML();

    axios.post('/question/update', {
      params: {
        username: this.state.username,
        qid: this.state.question._id,
        content: html,
        editMode: false
      }
    })
    .then((res) => {
      
      
    })
    .catch(function (error) {
      console.log(error);
    }); 
    this.socket.emit('question', this.state.question, (ack) => {
      console.log(ack);
    });
    
    this.loadQuestions(this.state);
  }
  pickFriendCallback = (e, question) => {
    this.myRef.current.props.editor.commands.setContent(question.content);
    this.setState({
      friendname: question.name,
      friendicon: null,
      messageList: [],
      pickFriendBoolean: true,
      subheader: "online in chat room",
      question:question
    }, () => {
      this.clearNotifCallback(question.name);
      this.socket.emit('question', this.state.question, (ack) => {
        console.log(ack);
      });
      axios.post('/question/editMode', {
        params: {
          username: this.state.username,
          qid: question._id,
          editMode: true
        }
      })
      .then((res) => {
        
        
      })
      .catch(function (error) {
        console.log(error);
      }); 
    }); 
    this.loadQuestions(this.state);
  };

  render() {
    //const { } = this.props;
    //const classes = useStyles;
    if(this.state.username === "" || this.state.icon === ""){
      // console.log('null!!');
      return null;
    }
    
    return (
      <div>
        <ButtonAppBar username={this.state.username}/>
      <Grid container  spacing={24}>
      <Grid item xs={8} sm={3}>
        
      <ContactList username={this.state.username} friendList={this.state.friendList}
        pickFriendCallback={this.pickFriendCallback}></ContactList>
      </Grid>
      <Grid item xs={12} sm={9}>
        <Button onClick={this.saveContent}>Save</Button>
        <Tiptap content={this.state.question.content} ref={this.myRef}></Tiptap>
      {/* <ChatRoomLayout className={classes.paper} username={this.state.username}
        friendname={this.state.friendname} friendicon={this.state.friendicon} subheader={this.state.subheader}
        icon={this.state.icon} messageList={this.state.messageList}  pickFriendBoolean={this.state.pickFriendBoolean}
        addMsgCallback={this.addMsgCallback} addNotifCallback={this.addNotifCallback}
        /> */}
      </Grid>
      </Grid>
      </div>
    );
  }
}
// ChatGridLayout.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default (ChatGridLayout);