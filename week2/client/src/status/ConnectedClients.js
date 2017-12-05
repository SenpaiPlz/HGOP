import React from 'react';

export default function (injected) {
    const socket = injected('socket');

    class ConnectedClients extends React.Component {
        constructor() {
            super();
            this.state = {
                stats:{

                }
            }
        }
        componentWillMount() {
            socket.on('stats', (data)=> {
                this.setState({
                    stats:data
                })
            });

        }
        render() {
            return <div className="ConnectedClients">
                <p className="App-intro">
                    {this.state.stats.numClients} connected clients
                </p>
            </div>
        }
    }
    return ConnectedClients;

}