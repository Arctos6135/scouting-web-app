import * as React from 'react';
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';
import { ErrorModal } from './ErrorModal';
import { RegisterModal } from './RegisterModal';

import { BsPlus } from 'react-icons/bs';

import './styles.css';

import { ScoutsTable } from './ScoutsTable';
import { AssignmentsTable } from './AssignmentsTable';
import { FormsTable } from './FormsTable';
import { AssignmentModal } from './AssignmentModal';

const {useState, useEffect} = React;

const randomID = (len: number) => [...Array(len)].map(()=>Math.floor(Math.random()*16).toString(16)).join('');

function createForm() {
	conn.socket.emit('organization:update form', { id: randomID(32), name: 'Form', sections: [] });
}

export default function AdminPage() {
	const [loginLink, setLoginLink] = useState<string>('Loading...');
	const signedIn = useRecoilValue(conn.signedIn);

	const navigate = useNavigate();

	useEffect(() => {
		if (!signedIn) {
			navigate('/home', {replace: true});
		}
		else {
			conn.socket.emit('organization:get scouts');
			conn.socket.emit('organization:get forms');
			conn.socket.emit('organization:get assignments');
		}
	}, [signedIn]);

	useEffect(() => {
		conn.socket.emit('organization:get url');
	}, [signedIn]);
	conn.useSocketEffect('organization:get url', (url: string) => {
		setLoginLink(url);
	});

	const [errorPopup, setErrorPopup] = useState<string>(null);
	const [creatingScout, setCreatingScout] = useState(false);
	const [creatingAssignment, setCreatingAssignment] = useState(false);

	conn.useSocketEffect('organization:update password', (result: boolean) => {
		if (!result) setErrorPopup('Password update failed');
	}, [signedIn]);

	conn.useSocketEffect('organization:delete scout', (result: boolean) => {
		if (!result) setErrorPopup('Failed to delete scout');
	}, [signedIn]);
	
	conn.useSocketEffect('organization:create scout', (result: boolean) => {
		if (!result) setErrorPopup('Failed to create scout');
	}, [signedIn]);

	conn.useSocketEffect('organization:update form', (result: boolean) => {
		if (!result) setErrorPopup('Failed to update form');
	}, [signedIn]);

	//TODO: Move all of these tables into their own components so the admin page doesn't need to re-render after every change
	
	const AssignmentTable = AssignmentsTable();

	return <>
		<ErrorModal show={errorPopup != null} content={errorPopup} onClose={
			() => setErrorPopup(null)
		}/>

		<RegisterModal show={creatingScout} onClose={(user) => {
			setCreatingScout(false);
			if (user) conn.socket.emit('organization:create scout', user);
		}}/>

		<AssignmentModal show={creatingAssignment} onClose={(assignment) => {
			setCreatingAssignment(false);
			if (assignment) conn.socket.emit('organization:assign', {
				form: assignment.form,
				name: assignment.name,
				scouts: [],
				due: assignment.due,
				id: undefined
			});
		}}></AssignmentModal>

		<Container>
			<InputGroup>
				<InputGroup.Text>Organization login link</InputGroup.Text>
				<Form.Control id="login-link" readOnly={true} value={loginLink}></Form.Control>
				<Button onClick={() => navigator.clipboard.writeText(loginLink)}>Copy</Button>
			</InputGroup>
			<br/>
			<Card>
				<Card.Header>
					<Card.Title as='h2'>Scouts</Card.Title>
				</Card.Header>
				<Card.Body>
					<ScoutsTable></ScoutsTable>
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => setCreatingScout(true)}>
						Add scout <BsPlus size={20} style={{marginLeft: 8}}/>
					</Button>
				</Card.Footer>
			</Card>

			<br/>
			<Card>
				<Card.Header>
					<Card.Title as='h2'>Forms</Card.Title>
				</Card.Header>
				<Card.Body>
					<FormsTable></FormsTable>
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => createForm()}>
						Add form <BsPlus size={20} style={{marginLeft: 8}}/>
					</Button>
				</Card.Footer>
			</Card>

			<br/>
			<Card>
				<Card.Header>
					<Card.Title as='h2'>Assignments</Card.Title>
				</Card.Header>
				<Card.Body>
					{AssignmentTable}
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => setCreatingAssignment(true)}>
						Add assignment <BsPlus size={20} style={{marginLeft: 8}}/>
					</Button>
				</Card.Footer>
			</Card>
		</Container>
	</>;
}
