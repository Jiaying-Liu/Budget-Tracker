import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';
import Header from './Header';
import Dashboard from './Dashboard';
import AddBudgetItemView from './BudgetMonth/AddBudgetItemView';
import EditBudgetItemView from './BudgetMonth/EditBudgetItemView';
import PastMonths from './PastMonths';
import SelectMonthView from './SelectMonthView';
import Configuration from './Configuration';
import '../stylesheets/main.css';
import 'font-awesome/css/font-awesome.min.css';

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
                        <Route exact path='/edit-item/:month/:year/:index' component={EditBudgetItemView} />
                        <Route exact path='/month/:month/:year' component={SelectMonthView} />
                        <Route exact path='/past-months' component={PastMonths} />
                        <Route exact path='/configuration' component={Configuration} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
};

export default connect(null, actions)(App);