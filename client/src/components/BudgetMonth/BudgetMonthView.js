import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    ProgressBar,
    Button,
    Table
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { monthParser } from '../../helpers/budgetMonthHelper';
import '../../stylesheets/components/BudgetMonth/BudgetMonthView.css';

class BudgetMonthView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddBudgetItem: false
        }
    }

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        currentMonth: PropTypes.object.isRequired
    }

    renderProgressBar() {
        var spentSoFar = this.props.currentMonth.budgetItems.reduce(
            (acc, curr) => acc + curr.amount , 
            0
        );
        var percent = (spentSoFar / this.props.currentMonth.limit) * 100;

        var progressBarClass = 'budget-tracker-progress-bar';

        if(percent < 5) {
            progressBarClass = progressBarClass + ' less-than-five-percent';
        }

        return (
            <ProgressBar
                bsStyle='info'
                now={spentSoFar}
                max={this.props.currentMonth.limit}
                label={`${percent}%`}
                bsClass={progressBarClass} />
        )
    }

    getTableContents() {
        return this.props.currentMonth.budgetItems.map((budgetItem, index) => {
            return (
                <tr key={index}>
                    <td>{budgetItem.name}</td>
                    <td>{budgetItem.category}</td>
                    <td>{budgetItem.amount}</td>
                </tr>
            );
        });
    }

    renderBudgetItemTable() {
        if(this.props.currentMonth.budgetItems.length === 0) {
            return <div>Add a budget item!</div>;
        } else {
            return (
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getTableContents()}
                    </tbody>
                </Table>
            )
        }
    }

    renderAddButton() {
        return (
            <Button
                bsStyle='primary'
                onClick={() => {
                    this.props.history.push('/add-item');
                    this.props.history.goForward();
                }}>
                Add Budget Item
            </Button>
        )
    }

    renderContent() {
        if(this.state.isAddBudgetItem) {
            return 
        } else {

        }
    }

    render() {
        return (
            <div className='budget-month-view'>
                <div>Month: {monthParser(this.props.currentMonth.month)}</div>
                <div>Budget: ${this.props.currentMonth.limit}</div>
                {this.renderProgressBar()}
                {this.renderBudgetItemTable()}
                {this.renderAddButton()}
            </div>
        )
    }
}

const BudgetMonthViewRouter = withRouter(BudgetMonthView);
export default BudgetMonthViewRouter;