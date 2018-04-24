import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUser, setUserConfig } from '../actions/index'

import {
    Form,
    FormControl,
    ControlLabel,
    FormGroup,
    Table,
    Button,
    Alert
} from 'react-bootstrap';

import '../stylesheets/components/Configuration.css'

class Configuration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 0,
            categories: [],
            budgetItems: [],
            addCategory: false,
            addItem: false,
            newCategory: '',
            newItem: {
                name: '',
                category: '',
                amount: 0
            },
            editBudgetItems: [],
            showAlert: false
        };
    }

    async componentDidMount() {
        await this.props.fetchUser()
        this.resetConfig();
    }

    resetConfig() {
        this.setState({
            limit: this.props.auth.defaultBudget,
            categories: this.props.auth.categories,
            budgetItems: this.props.auth.defaultBudgetItems.map(budgetItem => {
                return {
                    name: budgetItem.name,
                    category: budgetItem.category,
                    amount: budgetItem.amount
                };
            })
        });
    }

    renderLimitControl() {
        return (
            <Form inline>
                <FormGroup>
                    <ControlLabel>Default Limit:</ControlLabel>
                    <FormControl
                        type='number'
                        onChange={e => {
                            this.setState({
                                limit: e.target.value
                            });
                        }}
                        value={this.state.limit} />
                </FormGroup>
            </Form>
        )
    }

    getCategoryTableContents() {
        return this.state.categories.map((category, index) => {
            return (
                <tr key={index}>
                    <td>{category}</td>
                    <td>
                        <div 
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                            <i 
                                onClick={this.removeCategory.bind(this, index)}
                                title='Delete'
                                className='fa fa-trash' />
                        </div>
                    </td>
                </tr>
            )
        });
    }

    addCategory() {
        let categories = this.state.categories;
        categories.push(this.state.newCategory);
        this.setState({
            categories: categories,
            addCategory: false
        });
    }

    removeCategory(index) {
        let categories = this.state.categories;
        categories.splice(index, 1);
        this.setState({
            categories
        });
    }

    renderAddCategory() {
        if(this.state.addCategory) {
            return (
                <Form inline>
                    <FormGroup>
                        <ControlLabel>New Category:</ControlLabel>
                        <FormControl
                            type='text'
                            value={this.state.newCategory}
                            onChange={(e) => {
                                this.setState({
                                    newCategory: e.target.value
                                });
                            }} />
                    </FormGroup>
                    <Button
                        disabled={!this.state.newCategory}
                        bsStyle='primary'
                        onClick={this.addCategory.bind(this)}>
                        Add
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                addCategory: false
                            })
                        }}>
                        Cancel
                    </Button>
                </Form>
            )
        }
        else {
            return (
                <div onClick={() => { console.log('clicking div') }}>
                <Button
                    bsStyle='primary'
                    style={{ marginRight: '8px' }}
                    onClick={() => {
                        this.setState({
                            addCategory: true,
                            newCategory: ''
                        });
                    }}>
                    Add Category
                </Button>
                </div>
            )
        }
    }

    renderCategories() {
        return (
            <div className='config-category-table'>
                <div>
                    <b>Categories</b>
                </div>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th style={{width: '5%'}}>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getCategoryTableContents()}
                    </tbody>
                </Table>
                {this.renderAddCategory()}
            </div>
        );
    }

    getItemTableContents() {
        return this.state.budgetItems.map((budgetItem, index) => {
            if(this.state.editBudgetItems[index]) {
                return (
                    <tr key={index}>
                        <td>
                            <Form inline>
                                <FormGroup>
                                    <FormControl
                                        type='text'
                                        value={this.state.editBudgetItems[index].name}
                                        onChange={(e) => {
                                            this.changeItemName(e, index);
                                        }} />
                                </FormGroup>
                            </Form>
                        </td>
                        <td>
                            <Form inline>
                                <FormControl
                                    componentClass='select'
                                    placeholder={'Select a category'}
                                    value={this.state.editBudgetItems[index].category}
                                    onChange={e => {
                                        this.changeItemCategory(e, index);
                                    }}>
                                    {this.getCategoriesForSelect()}
                                </FormControl>
                            </Form>
                        </td>
                        <td>
                            <Form inline>
                                <FormGroup>
                                    <FormControl
                                        type='number'
                                        value={this.state.editBudgetItems[index].amount}
                                        onChange={(e) => {
                                            this.changeItemAmount(e, index);
                                        }} />
                                </FormGroup>
                            </Form>
                        </td>
                        <td>
                            <Button
                                bsStyle='primary'
                                style={{ marginBottom: '8px' }}
                                onClick={() => {
                                    this.state.budgetItems[index] = this.state.editBudgetItems[index];
                                    this.state.editBudgetItems[index] = undefined;
                                    this.setState({
                                        budgetItems: this.state.budgetItems,
                                        editBudgetItems: this.state.editBudgetItems
                                    });
                                }}>
                                Save
                            </Button>
                            <Button
                                bsStyle='default'
                                onClick={() => {
                                    this.state.editBudgetItems[index] = undefined;
                                    this.setState({
                                        editBudgetItems: this.state.editBudgetItems
                                    })
                                }}>
                                Cancel
                            </Button>
                        </td>
                    </tr>
                );
            }
            else {
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
                                onClick={() => {
                                    let budgetItem = this.state.budgetItems[index];
                                    let editBudgetItems = this.state.editBudgetItems;
                                    editBudgetItems[index] = {
                                        name: budgetItem.name,
                                        category: budgetItem.category,
                                        amount: budgetItem.amount
                                    };
                                    this.setState({
                                        editBudgetItems
                                    });
                                }}
                                style={{ paddingRight: '16px' }}
                                title='Edit' 
                                className='fa fa-edit' />
                            <i 
                                onClick={this.removeBudgetItem.bind(this, index)}
                                title='Delete'
                                className='fa fa-trash' />
                        </div>
                    </td>
                </tr>
            );
            }
        });
    }

    removeBudgetItem(index) {
        this.state.budgetItems.splice(index, 1);
        this.setState({
            budgetItems: this.state.budgetItems
        })
    }

    changeItemName(e, index) {
        console.log('e is ', index);
        if(index === undefined) {
            let newItem = this.state.newItem;
            newItem.name = e.target.value;
            this.setState({
                newItem: newItem
            });
        }
        else {
            console.log('here');
            this.state.editBudgetItems[index].name = e.target.value;
            this.setState({
                editBudgetItems: this.state.editBudgetItems
            });
        }
    }

    changeItemCategory(e, index) {
        if(!index) {
            let newItem = this.state.newItem;
            newItem.category = e.target.value;
            this.setState({
                newItem: newItem
            });
        }
        else {
            this.state.editBudgetItems[index].category = e.target.value;
            this.setState({
                editBudgetItems: this.state.editBudgetItems
            });
        }
    }

    changeItemAmount(e, index) {
        if(!index) {
            let newItem = this.state.newItem;
            newItem.amount = e.target.value;
            this.setState({
                newItem: newItem
            });
        }
        else {
            this.state.editBudgetItems[index].amount = e.target.value;
            this.setState({
                editBudgetItems: this.state.editBudgetItems
            });
        }
    }

    addBudgetItem() {
        this.state.budgetItems.push(this.state.newItem);
        this.setState({
            budgetItems: this.state.budgetItems,
            addItem: false
        });
    }

    getCategoriesForSelect() {
        var categories = this.state.categories.map(category => {
            return <option key={category} value={category}>{category}</option>;
        });

        if(this.state.newItem.category === '') {
            categories.unshift((
                <option key='' value=''>Select a category</option>
            ));
        }

        return categories;
    }

    invalidBudgetItem(index) {
        if(!index) {
            let newItem = this.state.newItem;
            return !newItem.name || !newItem.category || newItem.amount < 0;
        } else {
            let budgetItem = this.editBudgetItems[index];
            return !budgetItem.name || !budgetItem.category || budgetItem.amount < 0;
        }
    }

    renderAddItem() {
        if(this.state.addItem) {
            return (
                <div>
                <div><b>New Budget Item:</b></div>
                <Form inline>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl
                            type='text'
                            value={this.state.newItem.name}
                            onChange={this.changeItemName.bind(this)} />
                        <ControlLabel>Category</ControlLabel>
                        <FormControl
                            componentClass='select'
                            placeholder={'Select a category'}
                            value={this.state.newItem.category}
                            onChange={this.changeItemCategory.bind(this)}>
                            {this.getCategoriesForSelect()}
                        </FormControl>
                        <ControlLabel>Amount</ControlLabel>
                        <FormControl
                            type='number'
                            value={this.state.newItem.amount}
                            onChange={this.changeItemAmount.bind(this)} />
                    </FormGroup>
                    <Button
                        style={{ marginRight: '8px' }}
                        disabled={this.invalidBudgetItem()}
                        bsStyle='primary'
                        onClick={this.addBudgetItem.bind(this)}>
                        Add
                    </Button>
                    <Button
                        onClick={() => {
                            this.setState({
                                addItem: false
                            })
                        }}>
                        Cancel
                    </Button>
                </Form>
                </div>
            )
        }
        else {
            return (
                <Button
                    bsStyle='primary'
                    onClick={() => {
                        this.setState({
                            addItem: true,
                            newItem: {
                                name: '',
                                category: '',
                                amount: 0
                            }
                        });
                    }}>
                    Add Budget Item
                </Button>
            )
        }
    }

    renderBudgetItems() {
        return (
            <div className='config-budget-item-table'>
                <div>
                    <b>Default Budget Items</b>
                </div>
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
                        {this.getItemTableContents()}
                    </tbody>
                </Table>
                {this.renderAddItem()}
            </div>
        );
    }

    async saveButtonClick() {
        const values = {
            userId: this.props.auth._id,
            limit: this.state.limit,
            categories: this.state.categories,
            budgetItems: this.state.budgetItems
        };

        await this.props.setUserConfig(values);
        this.setState({
            showAlert: true
        })
    }

    renderContent() {
        if(!this.props.auth) {
            return <div>Loading...</div>
        }
        else {
            console.log('user is ', this.props.auth);
            return (
                <div className='budget-tracker-page-content user-config-page-content'>
                    {this.renderAlert()}
                    <div style={{ textAlign: 'center', paddingBottom: '16px' }}><b>User:</b> {this.props.auth.name}</div>
                    <div style={{ paddingBottom: '16px' }}>
                        {this.renderLimitControl()}
                    </div>
                    {this.renderCategories()}
                    {this.renderBudgetItems()}
                    <div style={{ display: 'flex', justifyContent:'flex-end' }}>
                        <Button
                            style={{ marginRight: '8px' }}
                            bsStyle='primary'
                            onClick={this.saveButtonClick.bind(this)}>
                            Save
                        </Button>
                        <Button 
                            onClick={this.resetConfig.bind(this)}>
                            Discard Changes
                        </Button>
                    </div>
                </div>
            );
        }
    }

    renderAlert() {
        if(this.state.showAlert) {
            return (
                <Alert
                    bsStyle='success'
                    onDismiss={() => {
                        this.setState({
                            showAlert: false
                        });
                    }}>
                    <p>
                        User configurations have been saved!
                    </p>
                </Alert>
            );
        }

        return null;
    }

    render() {
        console.log('render');
        return (
            <div className='budget-tracker-page'>
                <div className='budget-tracker-header'>
                    <h1>Account Configuration</h1>
                </div>
                {this.renderContent()}
            </div>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchUser: fetchUser,
        setUserConfig: setUserConfig
    }, dispatch);
}

const ConfigurationRouter = withRouter(Configuration);
export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationRouter);