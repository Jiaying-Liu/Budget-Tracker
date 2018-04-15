import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { monthParser } from '../helpers/budgetMonthHelper';
import { setCurrentMonth } from '../actions/index';
import BudgetMonthView from './BudgetMonth/BudgetMonthView';

class SelectMonthView extends Component {
    componentDidMount() {
        this.props.setCurrentMonth({
            month: this.props.match.params.month,
            year: this.props.match.params.year
        })
    }

    render() {
        if(!this.props.currentMonth) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div className='dashboard-content'>
                    <BudgetMonthView currentMonth={this.props.currentMonth} />
                </div>
            );
        }
    }
}

function mapStateToProps({ currentMonth }) {
    return { currentMonth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setCurrentMonth: setCurrentMonth
    }, dispatch);
}

const SelectMonthRouter = withRouter(SelectMonthView);
export default connect(mapStateToProps, mapDispatchToProps)(SelectMonthRouter);