import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    ProgressBar,
    Button,
    Table
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeBudgetItem } from '../../actions/index';
import { monthParser } from '../../helpers/budgetMonthHelper';
import '../../stylesheets/components/BudgetMonth/BudgetMonthView.css';

class BudgetMonthView extends Component {
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

    deleteIconClick(index) {
        this.props.removeBudgetItem({
            month: this.props.currentMonth.month,
            year: this.props.currentMonth.year,
            indexToRemove: index
        });
    }

    editIconClick(index) {
        const { month, year } = this.props.currentMonth;
        let pathStr = `/edit-item/${month}/${year}/${index}`
        this.props.history.push(pathStr);
        this.props.history.goForward();
    }

    getTableContents() {
        return this.props.currentMonth.budgetItems.map((budgetItem, index) => {
            return (
                <tr key={index}>
                    <td>{budgetItem.name}</td>
                    <td>{budgetItem.category}</td>
                    <td>{budgetItem.amount}</td>
                    <td>
                        <div 
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end'
                            }}>
                            <i
                                style={{ paddingRight: '16px' }}
                                title='Edit'
                                onClick={this.editIconClick.bind(this, index)} 
                                className='fa fa-edit' />
                            <i 
                                title='Delete'
                                className='fa fa-trash'
                                onClick={this.deleteIconClick.bind(this, index)} />
                        </div>
                    </td>
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
                            <th style={{width: '10%'}}>Edit/Delete</th>
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

    render() {
        return (
            <div className='budget-month-view'>
                <div>Month: {monthParser(this.props.currentMonth.month)} {this.props.currentMonth.year}</div>
                <div>Budget: ${this.props.currentMonth.limit}</div>
                {this.renderProgressBar()}
                {this.renderBudgetItemTable()}
                {this.renderAddButton()}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        removeBudgetItem: removeBudgetItem
    }, dispatch);
}

const BudgetMonthViewRouter = withRouter(BudgetMonthView);
export default connect(null, mapDispatchToProps)(BudgetMonthViewRouter);