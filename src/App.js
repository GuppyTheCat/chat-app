import React, { Component } from 'react';
import Layout from './components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
    render() {
        return (
            <div className='container-fluid'>
                <Layout title='Chat App' />
            </div>
        );
    }
}

export default App;