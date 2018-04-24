import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchBudgetMonths, setCurrentMonth } from '../actions/index';
import { monthParser } from '../helpers/budgetMonthHelper';
import _ from 'lodash';

import {
    Panel,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';

import '../stylesheets/components/PastMonths.css';
import { LinkContainer } from 'react-router-bootstrap';

class PastMonths extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearOpen: []
        };
    }

    componentDidMount() {
        this.props.fetchBudgetMonths();
    }

    getYears() {
        let years = this.props.budgetMonths.map(budgetMonth => parseInt(budgetMonth.year));
        years.sort((a, b) => b - a);
        return years;
    }

    renderListGroupItemsForYear(budgetMonths) {
        return budgetMonths.map(budgetMonth => {
            return (
                <LinkContainer 
                    key={budgetMonth.month}
                    to={`month/${budgetMonth.month}/${budgetMonth.year}`}>
                    <ListGroupItem>
                        {monthParser(budgetMonth.month)}
                    </ListGroupItem>
                </LinkContainer>
            )
        });
    }

    renderMonthList() {
        // group the months
        let years = this.getYears();
        let monthGrouping = [];

        years.forEach((year, index) => {
            monthGrouping[index] = this.props.budgetMonths.filter(budgetMonth => {
                return parseInt(budgetMonth.year) === year;
            });
        });

        return years.map((year, index) => {
            let budgetMonths = monthGrouping[index];
            return (
                <Panel key={index} expanded={this.state.yearOpen[index]}>
                    <Panel.Heading>
                        <Panel.Title toggle>
                            {year}
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                        <Panel.Body>
                            <ListGroup>
                                {this.renderListGroupItemsForYear(budgetMonths)}
                            </ListGroup>
                        </Panel.Body>
                    </Panel.Collapse>
                </Panel>
            );
        });
    }

    renderBudgetMonths() {
        if(this.props.budgetMonths.length === 0) {
            <div>No Budget Months! Go back to Dashboard to start one right now!</div>
        }
        else {
            return this.renderMonthList();
        }
    }

    renderContent() {
        if(!this.props.budgetMonths) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div className='budget-months-list'>
                    {this.renderBudgetMonths()}
                </div>
            )
        }
    }

    render() {
        return (
            <div className='past-months-view'>
                <div className='budget-tracker-header'>
                    <h1>Past Months</h1>
                </div>
                {this.renderContent()}
            </div>
        )
    }
}

function mapStateToProps({budgetMonths}) {
    return { budgetMonths };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchBudgetMonths: fetchBudgetMonths,
        setCurrentMonth
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PastMonths);