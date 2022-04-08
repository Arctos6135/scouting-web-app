import * as React from 'react';
import './nav.css';
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import ResponseClass from '../shared/dataClasses/ResponseClass';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ScoutClass from '../shared/dataClasses/ScoutClass';
import {Link} from 'react-router-dom';
import FormClass from '../shared/dataClasses/FormClass';
import { socket, store } from './store';
import { useSelector } from './hooks';
import _ from 'lodash';

function downloadXLSX() {
	const state = store.getState();
	const responses = state.responses.activeResponses.concat(state.responses.submitQueue);
	const forms = state.forms.schemas.list;
	const wb = XLSX.utils.book_new();
	const cols = {};
	for (const form of forms) {
		wb.SheetNames.push(form.name);
	}

	const data = {};
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
		const rows = [ [ 'scout', ...cols[form.id]] ];
		for (let i = 0; i < data[form.id]['scout'].length; i++) {
			const row = [];
			row.push(data[form.id]['scout'][i]);
			for (const col of cols[form.id]) row.push(data[form.id][col][i]);
			rows.push(row);
		}
		console.log(rows);
		wb.Sheets[form.name] = XLSX.utils.aoa_to_sheet(rows);
	}

	const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
	console.log(out.constructor, typeof out);

	const buf = new ArrayBuffer(out.length);
	const view = new Uint8Array(buf); 
	for (let i=0; i < out.length; i++) view[i] = out.charCodeAt(i) & 0xFF; //convert to octet

	saveAs(new Blob([buf], {type: 'application/octet-stream'}), 'scouting-data.xlsx');
}

function XLSXDownloadButton() {
	return <Button onClick={() => downloadXLSX()} className='ms-auto'>Download XLSX</Button>;
}

export default function TopNav() {
	const signedIn = useSelector(state => !!state.user.scout);
	const scout = useSelector(state => state.user.scout, _.isEqual);
	return (<Navbar bg="light" expand="lg" style={{zIndex: 100}}>
		<Container>
			<Navbar.Brand>Scouting app</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse>
				<Nav className="container-fluid">
					<Nav.Link as={Link} to="/">Home</Nav.Link>
					{signedIn ? <>
						{ scout.admin ? <Nav.Link as={Link} to="/admin">Admin</Nav.Link> : '' }
						<Nav.Link onClick={() => socket.emit('logout')}>Log out</Nav.Link>
					</> : <><Nav.Link as={Link} to="/login">Log In</Nav.Link><Nav.Link as={Link} to="/register">Register</Nav.Link></>}
					{ scout?.admin ? <XLSXDownloadButton/> : <></> }
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>);
}
