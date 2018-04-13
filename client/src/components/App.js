import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';
import Header from './Header';
import Dashboard from './Dashboard';
import AddBudgetItemView from './BudgetMonth/AddBudgetItemView';
import '../stylesheets/main.css';

class App extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchCurrentMonth();
    }

    render() {
        return (
            <div className='container'>
                <BrowserRouter>
                    <div>
                        <Header />
                        <Route exact path='/' component={Landing} />
                        <Route exact path='/dashboard' component={Dashboard} />
                        <Route exact path='/add-item' component={AddBudgetItemView} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
};

export default connect(null, actions)(App);