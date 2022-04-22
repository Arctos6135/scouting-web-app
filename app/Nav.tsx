import * as React from 'react';
import './nav.css';
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import { saveAs } from 'file-saver';
import {Link} from 'react-router-dom';
import { socket, store } from './store';
import { useSelector } from './hooks';
import _ from 'lodash';

function downloadCSV() {
	const state = store.getState();
	const responses = state.user.responses.all.concat(state.user.responses.submitQueue);
	const forms = state.user.forms.schemas.list;
	const cols: Record<string, string[]> = {};

	const data: Record<string, Record<string, (string|number)[]>> = {};
	for (const resp of responses) {
		if (!cols[resp.form]) {
			cols[resp.form] = [];
			data[resp.form] = {'scout': []};
		}
		for (const col in resp.data) if (!cols[resp.form].includes(col)) {
			cols[resp.form].push(col);
			data[resp.form][col] = [];
		}
	}

	for (const resp of responses) {
		data[resp.form]['scout'].push(resp.scout);
		for (const i of cols[resp.form]) {
			data[resp.form][i].push(resp.data[i]);
		}
	}
	console.log(data);

	for (const form of forms) {
		console.log(form);
		if (!data[form.id]) continue;
		const rows: (string|number)[][] = [ [ 'scout', ...cols[form.id]] ];
		for (let i = 0; i < data[form.id]['scout'].length; i++) {
			const row = [];
			row.push(data[form.id]['scout'][i]);
			for (const col of cols[form.id]) row.push(data[form.id][col][i]);
			rows.push(row);
		}
		console.log(rows);
		saveAs(new Blob([rows.map(x => x.join(',')).join('\n')]), form.name + '.csv');
	}
}

function XLSXDownloadButton() {
	return <Button onClick={() => {
		socket.emit('data:get responses');
		setTimeout(() => downloadCSV(), 500);
	}} className='ms-auto'>Download CSV</Button>;
}

export default function TopNav() {
	const signedIn = useSelector(state => !!state.user.scout);
	const scout = useSelector(state => state.user.scout, _.isEqual);
	console.log(scout?.admin);
	return (<Navbar bg="light" expand="lg" style={{zIndex: 100}}>
		<Container>
			<Navbar.Brand>Scouting app</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse>
				<Nav className="container-fluid">
					<Nav.Link as={Link} to="/">Home</Nav.Link>
					{signedIn ? <>
						{ scout?.admin ? <Nav.Link as={Link} to="/admin">Admin</Nav.Link> : '' }
						<Nav.Link onClick={() => socket.emit('logout')}>Log out</Nav.Link>
					</> : <><Nav.Link as={Link} to="/login">Log In</Nav.Link><Nav.Link as={Link} to="/register">Register</Nav.Link></>}
					{ scout?.admin ? <XLSXDownloadButton/> : <></> }
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>);
}
