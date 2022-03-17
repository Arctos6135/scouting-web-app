import * as React from 'react';
import './nav.css';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import * as conn from './connection';
import {Navbar, Nav, Container, Button} from 'react-bootstrap';
import AssignmentResponseClass from '../shared/dataClasses/AssignmentResponseClass';
import * as XLSX from 'xlsx';
import AssignmentClass from '../shared/dataClasses/AssignmentClass';
import { saveAs } from 'file-saver';
import ScoutClass from '../shared/dataClasses/ScoutClass';

function downloadXLSX(responses: AssignmentResponseClass[], assignments: AssignmentClass[]) {
	const wb = XLSX.utils.book_new();
	const cols = {};
	for (const assign of assignments) {
		wb.SheetNames.push(assign.name);
	}

	const data = {} 
	for (const resp of responses) {
		if (!cols[resp.assignment]) {
			cols[resp.assignment] = [];
			data[resp.assignment] = {'scout': []};
		}
		for (const col in resp.data) if (!cols[resp.assignment].includes(col)) {
			cols[resp.assignment].push(col);
			data[resp.assignment][col] = [];
		}
	}

	for (const resp of responses) {
		data[resp.assignment]['scout'].push(resp.scout);
		for (let i of cols[resp.assignment]) {
			data[resp.assignment][i].push(resp.data[i]);
		}
	}

	for (const assign of assignments) {
		const rows = [ [ 'scout', ...cols[assign.id]] ];
		for (let i = 0; i < data[assign.id]['scout'].length; i++) {
			const row = [];
			row.push(data[assign.id]['scout'][i]);
			for (let col of cols[assign.id]) row.push(data[assign.id][col][i]);
			rows.push(row);
		}
		console.log(rows);
		wb.Sheets[assign.name] = XLSX.utils.aoa_to_sheet(rows);
	}

	const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
	console.log(out.constructor, typeof out);

	let buf = new ArrayBuffer(out.length);
	let view = new Uint8Array(buf); 
	for (let i=0; i < out.length; i++) view[i] = out.charCodeAt(i) & 0xFF; //convert to octet

	saveAs(new Blob([buf], {type: 'application/octet-stream'}), 'scouting-data.xlsx');
}

function XLSXDownloadButton() {
	const responses = useRecoilValue(conn.responses);
	const queued = useRecoilValue(conn.submitQueue);
	const assignments = useRecoilValue(conn.assignments);

	return <Button onClick={() => downloadXLSX(responses.concat(queued), assignments)} className='ms-auto'>Download XLSX</Button>
}

export default function TopNav() {
	const signedIn: boolean = useRecoilValue(conn.signedIn);
	const scout = useRecoilValue(conn.scout);
	return (<Navbar bg="light" expand="lg">
		<Container>
			<Navbar.Brand href="#home">Scouting app</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse>
				<Nav className="container">
					<Nav.Link href="/">Home</Nav.Link>
					{signedIn ? <>
						<Nav.Link href="/admin">Admin</Nav.Link>
						<Nav.Link href="/forms">Forms</Nav.Link>
						<Nav.Link onClick={() => conn.socket.emit('logout')}>Log out</Nav.Link>
					</> : <><Nav.Link href="/login">Log In</Nav.Link><Nav.Link href="/register">Register</Nav.Link></>}
					{ scout?.admin ? <XLSXDownloadButton/> : <></> }
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>);
}
