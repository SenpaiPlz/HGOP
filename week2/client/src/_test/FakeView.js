import React from 'react';

export default function (injected) {
    let title = injected('title', true) || 'FAKE';

    let renderedProps = [];

    class FakeView extends React.Component {
        state = this.props;

        render() {
            renderedProps.push(this.props);
            return (
                <div className="fakediv">{title}</div>
            );
        }

        static props(idx) {
            idx = idx !== undefined ? idx : renderedProps.length - 1;
            return renderedProps[idx];
        }

        static renderCount() {
            return renderedProps.length;
        }

        static reset() {
            renderedProps.length = 0;
        }
    }
    return FakeView
};