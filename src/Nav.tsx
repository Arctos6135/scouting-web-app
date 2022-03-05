import * as React from 'react';
import './nav.css';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import * as conn from './connection';
import {Navbar, Nav, Container} from 'react-bootstrap';

export default function() {
	const signedIn: boolean = useRecoilValue(conn.signedIn);
	return (<Navbar bg="light" expand="lg">
		<Container>
			<Navbar.Brand href="#home">Scouting app</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse>
				<Nav className="me-auto">
					<Nav.Link href="/">Home</Nav.Link>
					{signedIn ? <>
						<Nav.Link href="/admin">Admin</Nav.Link>
						<Nav.Link href="/forms">Forms</Nav.Link>
						<Nav.Link onClick={() => conn.socket.emit('logout')}>Log out</Nav.Link>
					</> : <><Nav.Link href="/login">Log In</Nav.Link><Nav.Link href="/register">Register</Nav.Link></>}
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>);
}
