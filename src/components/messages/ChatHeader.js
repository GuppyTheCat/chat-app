import React, { Component } from 'react';
import './ChatHeader.css'

export default class ChatHeader extends Component {
    render() {
        return (
            <div className='header-container z-depth-1'>
                <h4>{this.props.activeChatName}</h4>
            </div>
        )
    }
}
