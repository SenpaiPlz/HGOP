import React from 'react';
import './gameboard.css';

export default function (injected) {
    const eventRouter = injected('eventRouter');

    class TictactoeMessage extends React.Component {
        constructor() {
            super();
            this.state = {
                lastMessage: "Nothing happened yet"
            }
        }

        componentWillMount() {
            this.unsubscribe = eventRouter.on('*', (gameEvent) => {
                this.setState({
                    lastMessage: gameEvent.type
// When debugging, it is very nice to see last event in UI
//                    lastMessage: JSON.stringify(gameEvent)
                });
            })
        }
        componentWillUnmount(){
            this.unsubscribe();
        }
        render() {
            return <div className="TictactoeMessage">
                <div className="lastMessage">
                    {this.state.lastMessage}
                </div>
            </div>
        }
    }
    return TictactoeMessage;
}