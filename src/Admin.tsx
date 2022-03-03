import * as React from 'react';
const {useState, useEffect} = React;
import {Button, Container, Form, Row, InputGroup, ListGroup, ListGroupItem, Col, Table, CloseButton, Modal} from "react-bootstrap";
import {useRecoilValue} from 'recoil';
import {ScoutClass} from '../backend/db/models/Scouting';
import * as conn from './connection';

// "Are you sure you want to delete" modal
// Input to onClose is a boolean for whether the delete was cancelled
function DeleteModal(props: { 
	onClose: (result: boolean) => any; 
	show: boolean; 
	bodyText: string; 
}) {
	return <Modal centered show={props.show} onHide={props.onClose.bind(false)}>
		<Modal.Header closeButton>
			<Modal.Title>
				Are you sure you want to delete this scout?
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.bodyText}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={props.onClose.bind(true)} variant="danger">Yes</Button>
		</Modal.Footer>
	</Modal>
}

function UpdatePasswordModal(props: {
	show: boolean; 
	onClose: (result: { newPassword: string; update: boolean}) => any
}) {

	const [pass, setPass] = useState<string>('');
	const [passRepeat, setPassRepeat] = useState<string>('');
	return <Modal centered show={props.show} onHide={() => props.onClose({ update: false, newPassword: '' })}>
		<Modal.Header closeButton>
			<Modal.Title>
				Update password
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form.Group>
				<Form.Text>New password</Form.Text>
				<Form.Control type='password' value={pass} onChange={e => setPass(e.target.value)}/>
			</Form.Group>
			<Form.Group>
				<Form.Text>Repeat password</Form.Text>
				<Form.Control type='password' value={passRepeat} onChange={e => setPassRepeat(e.target.value)} />
			</Form.Group>
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => props.onClose({newPassword: pass, update: true}) } disabled={pass!=passRepeat}>Update</Button>
		</Modal.Footer>
	</Modal>
}

function ErrorModal(props: {
	show: boolean;
	onClose: () => any;
	content: string;
}) {
	return <Modal centered show={props.show} onHide={() => props.onClose()}>
		<Modal.Header closeButton>
			<Modal.Title>
				Error!
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			{props.content}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => props.onClose() } variant="danger">Close</Button>
		</Modal.Footer>
	</Modal>
}

export default function AdminPage() {
	const [loginLink, setLoginLink] = useState<string>("Loading...");
	const signedIn = useRecoilValue(conn.signedIn);

	const [scouts, setScouts] = useState<ScoutClass[]>([]);
	const selfScout = useRecoilValue(conn.scout);
	console.log(scouts);

	useEffect(() => {
		conn.socket.emit('organization:get scouts');
		const listener = (scouts: ScoutClass[]) => {
			setScouts(scouts);
		}

		conn.socket.on('organization:get scouts', listener);

		return () => {
			conn.socket.off('organization:get scout', listener);
		}

	}, [signedIn]);

	useEffect(() => {
		conn.socket.emit('organization:get url');
		const listener = (url: string) => {
			setLoginLink(url);
		}
		conn.socket.on('organization:get url', listener);
		return () => {
			conn.socket.off('organization:get url', listener);
		}
	}, [signedIn]);

	if (!signedIn) {
		return <Container>
			<h1>
				Log in to access your admin page
			</h1>
		</Container>
	}

	const [deletingScout, setDeletingScout] = useState<ScoutClass>(null);

	const setAdmin = (scout: ScoutClass, admin: boolean) => {

	};

	const [updatingPassword, setUpdatingPassword] = useState<ScoutClass>(null);
	const [errorPopup, setErrorPopup] = useState<string>(null);

	const [creatingScout, setCreatingScout] = useState(false);

	useEffect(() => {
		const event = 'organization:update password';
		const listener = (result: boolean) => {
			if (!result) setErrorPopup('Password update failed');
		}
		conn.socket.on(event, listener);
		return () => {
			conn.socket.off(event, listener);
		}
	}, [signedIn])

	useEffect(() => {
		const event = 'organization:delete scout';
		const listener = (result: boolean) => {
			if (!result) setErrorPopup('Failed to delete scout');
		}
		conn.socket.on(event, listener);
		return () => {
			conn.socket.off(event, listener);
		}
	}, [signedIn])
	
	useEffect(() => {
		const event = 'organization:create scout';
		const listener = (result: boolean) => {
			if (!result) setErrorPopup('Failed to create scout');
		}
		conn.socket.on(event, listener);
		return () => {
			conn.socket.off(event, listener);
		}
	}, [signedIn]);

	return <>
		<DeleteModal bodyText={`All information related to this scout will be deleted (including assigned projects). Username: ${deletingScout?.name}`} show={!!deletingScout} onClose={(del) => {
			if (del) conn.socket.emit('organization:delete scout', deletingScout.pin);
			setDeletingScout(null);
		}}/>

		<UpdatePasswordModal show={!!updatingPassword} onClose={(result) => {
			if (result.update) conn.socket.emit('organization:update password', { scout: updatingPassword.pin, password: result.newPassword });
			setUpdatingPassword(null);
		}}/>

		<ErrorModal show={errorPopup != null} content={errorPopup} onClose={
			() => setErrorPopup(null)
		}/>

		<Container>
			<InputGroup>
				<InputGroup.Text>Organization login link</InputGroup.Text>
				<Form.Control id="login-link" readOnly={true} value={loginLink}></Form.Control>
				<Button onClick={() => navigator.clipboard.writeText(loginLink)}>Copy</Button>
			</InputGroup>
			<h2>Scouts</h2>
			<Table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Login</th>
						<th>Connections</th>
						<th>Admin</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{scouts.map(scout => <tr className={scout.pin == selfScout.pin ? 'table-primary' : ''} key={scout.name}>
						<th>{scout.name}</th>
						<th>{scout.pin}</th>
						<th>{scout.connections}</th>
						<th><Form.Check onClick={() => setAdmin(scout, !scout.admin)} type='switch' defaultChecked={scout.admin} disabled={scout.pin==selfScout.pin}/></th>
						<th><Button onClick={() => setUpdatingPassword(scout)}>Update password</Button></th>
						<th><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.pin==selfScout.pin} /></th>
					</tr>)}
				</tbody>
			</Table>
			<Button onClick={() => setCreatingScout(true)}>
				Add scout
			</Button>
		</Container>
	</>
	
}
