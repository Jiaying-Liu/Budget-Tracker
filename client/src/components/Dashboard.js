import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCurrentMonth, createBudgetMonth } from '../actions/index';
import { 
    Button,
    ProgressBar,
    ListGroup,
    ListGroupItem
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
            limit: this.props.auth.defaultBudget
        });
    }

    renderContent() {
        if(!this.props.currentMonth) {
            return (
                <Button
                    bsStyle='primary'
                    onClick={this.createNewBudgetMonth.bind(this)} >
                    Start Tracking Budget For This Month
                </Button>
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
        return (
            <div className='budget-tracker-dashboard'>
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