import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { monthParser } from '../../helpers/budgetMonthHelper';
import { addBudgetItem } from '../../actions/index';

import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button
} from 'react-bootstrap';

class AddBudgetItemView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            category: '',
            amount: 0
        }
    }

    changeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    changeCategory(e) {
        this.setState({
            category: e.target.value
        })
    }

    changeAmount(e) {
        this.setState({
            amount: e.target.value
        })
    }

    getCategories() {
        var categories = this.props.auth.categories.map(category => {
            return <option key={category} value={category}>{category}</option>;
        });

        if(this.state.category === '') {
            categories.unshift((
                <option key='' value=''>Select a category</option>
            ));
        }

        return categories;
    }

    async addBudgetItemToMonth() {
        const budgetItem = {
            name: this.state.name,
            category: this.state.category,
            amount: this.state.amount
        };
        const { month, year } = this.props.currentMonth;

        await this.props.addBudgetItem({
            month, year, budgetItem
        });
        this.props.history.goBack();
    }

    renderForm() {
        return (
            <form>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                        type='text'
                        value={this.state.name}
                        placeholder="Enter Name"
                        onChange={this.changeName.bind(this)} />
                    <ControlLabel>Category</ControlLabel>
                    <FormControl
                        componentClass='select'
                        placeholder={'Select a category'}
                        value={this.state.category}
                        //defaultValue='Select a category'
                        onChange={this.changeCategory.bind(this)}>
                        {this.getCategories()}
                    </FormControl>
                    <ControlLabel>Amount</ControlLabel>
                    <FormControl
                        type='number'
                        value={this.state.amount}
                        placeholder="Enter Amount"
                        onChange={this.changeAmount.bind(this)} />
                </FormGroup>
                <Button
                    bsStyle='primary'
                    onClick={this.addBudgetItemToMonth.bind(this)}>
                    Add Budget Item
                </Button>
            </form>  
        );
    }

    render() {
        if(!this.props.currentMonth || !this.props.auth) {
            return <div>Loading...</div>
        } else {
            console.log('auth is ', this.props.auth);
            return (
                <div className='budget-month-view'>
                    <div>
                        Adding to: {monthParser(this.props.currentMonth.month)} {this.props.currentMonth.year}
                    </div>
                    {this.renderForm()}
                </div>
            )
        }
    }
}

function mapStateToProps({ auth, currentMonth }) {
    return { auth, currentMonth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        addBudgetItem: addBudgetItem
    }, dispatch);
}

const AddBugetItemRouter = withRouter(AddBudgetItemView);
export default connect(mapStateToProps, mapDispatchToProps)(AddBugetItemRouter);