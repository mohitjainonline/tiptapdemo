const UserSchema = require('../models/User.js');
const QuestionSchema = require('../models/Question.js');
const mongoose = require('mongoose');

var User = null;
var Question = null;
class UserSocket {

    constructor(con) {
        User = mongoose.model('User', UserSchema);
        Question = mongoose.model('Question', QuestionSchema);
    }

    storeUsers(data, res) {

        var newUser = new User({
            username: data.username,
            password: data.password,
            icon: data.icon,
            updateTime: data.updateTime
        });
        newUser.save(function(err, data){
            console.log(data);
            if(err){ 
                console.log(err); 
                res.send(err);
            }
            else{
                console.log(data);
                res.send(data);
            } 
        });
    };
    checkUsers(data, res) {
        var myUser = new User({
            username: data.username,
            password: data.password,
            icon: data.icon,
            updateTime: data.updateTime
        });
        User.find({ 
            'username': myUser.username,
            'password': myUser.password }, function(err, user) {
            
            if(err){ 
                console.log(err); 
                res.send(err);
            } else if (user.length == 1) {
                console.log(user);
                res.redirect('/chatroom'); 
            } else {
                console.log('not found');
                res.send('not found');
            }
        });
    };
    sendIcon(me, res) {
        User.find({username: me}, function(err, myuser) {
            var icon = JSON.stringify({icon: myuser[0]['icon']});
            res.send(icon);
        });
    };
    loadFriendList(me, res) {
        User.find({}, function(err, users) {
            var arr = [];
            for(var i = 0; i < users.length; i++) {
                if(users[i]['username'] != me) {
                    var obj = JSON.stringify({friendname: users[i]['username'],
                        icon: users[i]['icon'], lastMsg: '...', notifNum: 0});
                    arr.push(obj);
                }
            }
            if(arr.length === 0) {
                console.log('only one user...');
            }
            res.send(arr);
        });
    };
    loadQuestionsList(me, res) {
        Question.find({}, function(err, questions) {
            var arr = [];
            res.send(questions);
        });
    };
    
    storeQuestion(data, res) {
        var newQuestion = new Question({
            name: data.name,
            description: data.description,
            content: data.content,
            editMode: data.editMode,
            updateTime: data.updateTime,
            updateBy: data.updateBy
        });
        newQuestion.save(function(err, data){
            console.log(data);
            if(err){ 
                console.log(err); 
                res.send(err);
            }
            else{
                console.log(data);
                res.send(data);
            } 
        });
    };
    storeQuestion(data, res) {
        var newQuestion = new Question({
            name: data.name,
            description: data.description,
            content: data.content,
            editMode: data.editMode,
            updateTime: data.updateTime,
            updateBy: data.updateBy
        });
        newQuestion.save(function(err, data){
            console.log(data);
            if(err){ 
                console.log(err); 
                res.send(err);
            }
            else{
                console.log(data);
                res.send(data);
            } 
        });
    };
    editModeQuestion(data, res) {
        var newQuestion = {
            editMode: data.editMode,
            updateTime: new Date(),
            updatedBy: data.updatedBy
        };
        Question.findByIdAndUpdate(data.qid,newQuestion, function(err, data){
            console.log(data);
            if(err){ 
                console.log(err); 
                res.send(err);
            }
            else{
                console.log(data);
                res.send(data);
            } 
        });
    };
    updateQuestion(data, res) {
        var newQuestion = {
            content: data.content,
            editMode: data.editMode,
            updatedBy: data.updatedBy
        };
        Question.findByIdAndUpdate(data.qid,newQuestion, function(err, data){
            console.log(data);
            if(err){ 
                console.log(err); 
                res.send(err);
            }
            else{
                console.log(data);
                res.send(data);
            } 
        });
    };
}

module.exports = UserSocket;