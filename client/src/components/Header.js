import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    DropdownButton,
    MenuItem,
    Navbar,
    Nav,
    NavItem,
    NavDropdown
} from 'react-bootstrap';
import {
    LinkContainer
} from 'react-router-bootstrap';

import '../stylesheets/components/Header.css';

class Header extends Component {
    renderContent() {
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return (
                    <Nav 
                        pullRight
                        style={{ paddingRight: '30px' }}>
                    <NavItem href='/auth/google'>Login With Google</NavItem>
                    </Nav>
                );
            default:
                return [
                    <Nav>
                    <NavDropdown className='header-dropdown' title="Options" id="header-dropdown">
                        <LinkContainer to='/dashboard'>
                            <MenuItem>
                                Home
                            </MenuItem>
                        </LinkContainer>
                        <LinkContainer to='/'>
                            <MenuItem>
                                Add/Edit Budget Item
                            </MenuItem>
                        </LinkContainer>
                        <LinkContainer to='/dashboard'>
                            <MenuItem>
                                Past Months
                            </MenuItem>
                        </LinkContainer>
                        <LinkContainer to='/dashboard'>
                            <MenuItem>
                                Configure
                            </MenuItem>
                        </LinkContainer>
                    </NavDropdown>
                    </Nav>,
                    <Nav 
                        pullRight
                        style={{ paddingRight: '30px' }} >
                    <NavItem href='/api/logout'>Logout</NavItem>
                    </Nav>
                ];
        }
    }

    render() {
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link
                            className='float-left'
                            to={this.props.auth ? '/dashboard' : '/'} >
                            Budget Tracker
                        </Link>
                    </Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    {this.renderContent()}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);