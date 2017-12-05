import React from 'react';
import _ from 'lodash';

import './ConnectedUsers.css';

export default function (injected) {
    const socket = injected('socket');
    const currentUserTracker = injected('currentUserTracker');

    class ConnectedUsers extends React.Component {
        constructor() {
            super();
            this.state = {
                sessions: {},
                mysession: {
                    user: {
                        userName: "",
                        userId: ""

                    }
                }
            };
            this.userNameChanged = this.userNameChanged.bind(this);
        }
            componentWillMount()
            {
                socket.on('sessionJoined', (session) => {
                    let users = this.state.sessions;
                    users[session.clientId] = session;
                    this.setState({sessions: users});
                });
                socket.on('sessionAck', (session) => {
                    this.setState({mysession: session});
                    if (currentUserTracker.getUserId()) {
                        socket.emit("reconnectUser", {userId: currentUserTracker.getUserId()});
                    } else {
                        currentUserTracker.setUserId(session.user.userId);
                    }
                });
                socket.on('sessionDisconnected', (user) => {
                    let users = this.state.sessions;
                    delete users[user.clientId];
                    this.setState({sessions: users});
                });
                socket.on('sessionChanged', (session) => {
                    let sessions = this.state.sessions;
                    sessions[session.clientId] = session;
                    if (session.clientId === this.state.mysession.clientId) {
                        this.setState({
                            mysession: session
                        });
                        currentUserTracker.setUserId(session.user.userId);
                    }
                    this.setState({
                        sessions: sessions
                    });
                });
                socket.on('sessionsConnected', (users) => {
                    this.setState({sessions: users});
                });
            }
            userNameChanged(event)
            {
                socket.emit('changeUserName', {userName: event.target.value})
            }
            render()
            {
                let users = _.map(this.state.sessions, (session) => {
                    return <li key={session.clientId}><span>{session.user.userId}</span> : <span>{session.user.userName}</span></li>
                });

                return (
                    <div className="ConnectedUsers">
                        <p></p>
                        <label>Me:</label>
                        <input type="text" value={this.state.mysession.user.userName}
                               onChange={this.userNameChanged}></input>
                        <p></p>
                        <div className="UserList">
                            <span>Connected:</span>
                            <ul>
                                {users}
                            </ul>
                        </div>

                    </div>
                )
            }
        }

        return ConnectedUsers;

    }

