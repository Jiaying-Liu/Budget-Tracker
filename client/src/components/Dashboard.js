import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchCurrentMonth, setBudgetMonth } from '../actions/index';
import { 
    Button,
    ProgressBar
} from 'react-bootstrap';
import { monthParser } from '../helpers/budgetMonthHelper';
import '../stylesheets/components/Dashboard.css';

class Dashboard extends Component {
    componentDidMount() {
        this.props.fetchCurrentMonth()
    }

    createNewBudgetMonth() {
        var d = new Date();
        var month = d.getMonth();
        var year = d.getFullYear();
        this.props.setBudgetMonth({
            month,
            year,
            limit: this.props.auth.defaultBudget
        });
    }

    renderProgressBar() {
        var spentSoFar = this.props.currentMonth.budgetItems.reduce(
            (acc, curr) => acc + curr.amount , 
            0
        );
        var percent = (spentSoFar / this.props.currentMonth.limit) * 100;

        return (
            <ProgressBar
                now={spentSoFar}
                max={this.props.currentMonth.limit}
                label={`${percent}%`}
                bsClass='budget-tracker-progress-bar' />
        )
    }

    renderBudgetItemList() {
        if(this.props.currentMonth.budgetItems.length === 0) {
            return <div>Add a budget item!</div>;
        }
    }

    renderAddButton() {
        return (
            <Button
                bsStyle='primary'
                onClick={() => {}}>
                Add Budget Item
            </Button>
        )
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
                    <div>Month: {monthParser(this.props.currentMonth.month)}</div>
                    <div>Budget: ${this.props.currentMonth.limit}</div>
                    {this.renderProgressBar()}
                    {this.renderBudgetItemList()}
                    {this.renderAddButton()}
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
        setBudgetMonth: setBudgetMonth,
        fetchCurrentMonth: fetchCurrentMonth
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);