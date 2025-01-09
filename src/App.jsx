import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import Signup from './components/signup/signup.jsx';
import './App.css';
import Login from './components/login/login.jsx';
import Profile from './components/profile/profile.jsx';
import ProfileShow from './components/profileshow/profileshow.jsx';
import Search from './components/search/search.jsx';
import Suggestions from './components/suggestions/suggestions.jsx';
import Like from './components/like/like.jsx';
import Home from './components/home/home.jsx';
import Nav from './components/nav/nav.jsx';
import ForgotPassword from './components/forgotpassword/forgotpassword.jsx';
import Chat from './components/chat/chat.jsx';
import ChatRoom from './components/chatroom/chatroom.jsx';

function App() {
    return (
        <Router>
            <Nav />
            <Switch>
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgotpassword" component={ForgotPassword} />
                <Route path="/search" component={Search} />
                <Route path="/suggestions" component={Suggestions} />
                <Route path="/profile/:username" component={ProfileShow} />
                <Route path="/profile" component={Profile} />
                <Route path="/likes" component={Like} />
                <Route path="/chat" component={Chat} />
                <Route path="/chatroom/:matchId" component={ChatRoom} />
                <Route exact path="/" component={Home} />
            </Switch>
        </Router>
    );
}

export default App;
