import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
    ProgressBar,
    Button,
    Table,
    Form,
    FormControl,
    FormGroup,
    ControlLabel,
    Modal
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { removeBudgetItem, setBudgetLimit, deleteBudgetMonth } from '../../actions/index';
import { monthParser } from '../../helpers/budgetMonthHelper';
import '../../stylesheets/components/BudgetMonth/BudgetMonthView.css';

class BudgetMonthView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLimit: this.props.currentMonth.limit,
            editCurrentLimit: false,
            showDeleteConfirm: false,
            showDeleteBudgetItem: false,
            deleteBudgetItemIndex: -1
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
            <div style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>Budget Left to Spend: {this.state.currentLimit - spentSoFar}</div>
            <ProgressBar
                bsStyle='info'
                now={spentSoFar}
                max={this.props.currentMonth.limit}
                label={`${percent}%`}
                bsClass={progressBarClass} />
            </div>
        )
    }

    deleteIconClick(index) {
        this.setState({
            showDeleteBudgetItem: true,
            deleteBudgetItemIndex: index
        });
    }

    deleteBudgetItem() {
        this.props.removeBudgetItem({
            month: this.props.currentMonth.month,
            year: this.props.currentMonth.year,
            indexToRemove: this.state.deleteBudgetItemIndex
        })
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

    invalidLimit() {
        return !this.state.currentLimit || parseFloat(this.state.currentLimit) <= 0;
    }

    saveLimit() {
        const { month, year } = this.props.currentMonth;
        this.props.setBudgetLimit({
            month,
            year,
            limit: this.state.currentLimit
        });
        this.setState({
            editCurrentLimit: false
        });
    }

    renderCurrentLimit() {
        if(this.state.editCurrentLimit) {
            return (
                <Form inline>
                    <FormGroup>
                        <ControlLabel>Budget ($)</ControlLabel>
                        <FormControl
                            type='number'
                            value={this.state.currentLimit}
                            onChange={(e) => {
                                this.setState({
                                    currentLimit: e.target.value
                                });
                            }} />
                    </FormGroup>
                        <Button
                            disabled={this.invalidLimit()}
                            style={{ marginRight: '8px' }}
                            bsStyle='primary'
                            onClick={this.saveLimit.bind(this)}>
                            Save
                        </Button>
                        <Button
                            bsStyle='default'
                            onClick={() => {
                                this.setState({
                                    editCurrentLimit: false
                                })
                            }}>
                            Cancel
                        </Button>
                </Form>
            )
        }
        else {
            return (
                <div style={{ display: 'flex' }}>
                <div>
                    Budget: ${this.props.currentMonth.limit}
                </div>
                <i
                    onClick={() => {
                        this.setState({
                            currentLimit: this.props.currentMonth.limit,
                            editCurrentLimit: true
                        })    
                    }}
                    style={{ paddingTop: '2px', paddingLeft: '8px' }}
                    title='Edit' 
                    className='fa fa-pencil budget-limit-edit' />
                </div>
            );
        }
    }

    onDeleteClick() {
        this.props.deleteBudgetMonth({
            month: this.props.currentMonth.month,
            year: this.props.currentMonth.year
        });
    }

    renderDeleteBudgetItemModal() {
        if(this.state.deleteBudgetItemIndex < 0) {
            return null;
        }

        return (
            <Modal 
                show={this.state.showDeleteBudgetItem} 
                onHide={() => { 
                    this.setState({ 
                        showDeleteBudgetItem: false,
                        deleteBudgetItemIndex: -1 
                    }); 
                }} >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Budget Item: {this.props.currentMonth.budgetItems[this.state.deleteBudgetItemIndex].name}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this budget item?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bsStyle='primary'
                        onClick={() => {
                            this.deleteBudgetItem();
                            this.setState({
                                showDeleteBudgetItem: false,
                                deleteBudgetItemIndex: -1
                            })
                        }}>
                        Delete
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                showDeleteBudgetItem: false,
                                deleteBudgetItemIndex: -1
                            })
                        }} >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderDeleteModal() {
        return (
            <Modal 
                show={this.state.showDeleteConfirm} 
                onHide={() => { 
                    this.setState({ 
                        showDeleteConfirm: false 
                    }) 
                }} >
                <Modal.Header closeButton>
                    <Modal.Title>Delete Budget Month?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this budget month?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bsStyle='primary'
                        onClick={this.onDeleteClick.bind(this)}>
                        Delete
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                showDeleteConfirm: false
                            })
                        }} >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        return (
            <div className='budget-month-view'>
                <div>Month: {monthParser(this.props.currentMonth.month)} {this.props.currentMonth.year}
                    <Button
                        bsStyle='danger'
                        onClick={() => {
                            this.setState({
                                showDeleteConfirm: true
                            });
                        }}
                        style={{ right: '20%', position: 'absolute' }}>
                        Delete
                    </Button>
                </div>
                <div className='budget-limit'>
                    {this.renderCurrentLimit()}
                </div>
                {this.renderProgressBar()}
                {this.renderBudgetItemTable()}
                {this.renderAddButton()}
                {this.renderDeleteModal()}
                {this.renderDeleteBudgetItemModal()}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        removeBudgetItem: removeBudgetItem,
        setBudgetLimit: setBudgetLimit,
        deleteBudgetMonth: deleteBudgetMonth
    }, dispatch);
}

const BudgetMonthViewRouter = withRouter(BudgetMonthView);
export default connect(null, mapDispatchToProps)(BudgetMonthViewRouter);