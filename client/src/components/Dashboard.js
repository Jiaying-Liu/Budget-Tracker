import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCurrentMonth, createBudgetMonth } from '../actions/index';
import { 
    Button,
    ProgressBar,
    ListGroup,
    ListGroupItem,
    PageHeader
} from 'react-bootstrap';
import '../stylesheets/components/Dashboard.css';
import BudgetMonthView from './BudgetMonth/BudgetMonthView';

class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchCurrentMonth()
    }

    createNewBudgetMonth() {
        var d = new Date();
        var month = d.getMonth();
        var year = d.getFullYear();
        this.props.createBudgetMonth({
            month,
            year,
            limit: this.props.auth.defaultBudget,
            budgetItems: this.props.auth.defaultBudgetItems
        });
    }

    renderContent() {
        if(!this.props.currentMonth) {
            return (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Button
                    bsStyle='primary'
                    style={{ width: '500px' }}
                    onClick={this.createNewBudgetMonth.bind(this)} >
                    Start Tracking Budget For This Month
                </Button>
                </div>
            );
        }
        else {
            return (
                <div className='dashboard-content' style={{ width: '100%' }}>
                    <BudgetMonthView
                        currentMonth={this.props.currentMonth} />
                </div>
            );
        }
    }

    render() {
        if(!this.props.auth) {
            return <div>Loading...</div>
        }

        return (
            <div className='budget-tracker-dashboard'>
                <div className='budget-tracker-header'>
                    <h1>Dashboard for {this.props.auth.name}</h1>
                </div>
                {this.renderContent()}
            </div>
        );
    }
}

function mapStateToProps({ currentMonth, auth }) {
    return { currentMonth, auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        createBudgetMonth: createBudgetMonth,
        fetchCurrentMonth: fetchCurrentMonth
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);