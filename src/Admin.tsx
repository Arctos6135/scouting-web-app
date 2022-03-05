import * as React from 'react';
const {useState, useEffect} = React;
import {Button, Container, Form, Row, InputGroup, ListGroup, ListGroupItem, Col, Table, CloseButton, Modal} from "react-bootstrap";
import {useNavigate} from 'react-router';
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

// Modal for updating scouts' passwords
function UpdatePasswordModal(props: {
	show: boolean; 
	onClose: (result: { newPassword: string; update: boolean}) => any
}) {

	const [pass, setPass] = useState<string>('');
	const [passRepeat, setPassRepeat] = useState<string>('');
	// Reset password when not shown
	useEffect(() => {
		if (!props.show) {
			setPass('');
			setPassRepeat('');
		}
	});
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

function RegisterModal(props: {
	show: boolean;
	onClose: (user?: {login: string; name: string; password: string}) => any;
}) {

	const [login, setLogin] = useState<string>();
	const [name, setName] = useState<string>();
	return <Modal centered show={props.show} onHide={() => props.onClose()}>
		<Modal.Header closeButton>
			<Modal.Title>
				Create scout
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<Form.Group>
				<Form.Text>Login</Form.Text>
				<Form.Control value={login} onChange={e => setLogin(e.target.value)}/>
			</Form.Group>
			<Form.Group>
				<Form.Text>Name</Form.Text>
				<Form.Control value={name} onChange={e => setName(e.target.value)}/>
			</Form.Group>
			Password is blank by default. You may change this once the scout is created.
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => props.onClose({ login, name, password: ''}) } variant="primary">Create</Button>
		</Modal.Footer>
	</Modal>
}

export default function AdminPage() {
	const [loginLink, setLoginLink] = useState<string>("Loading...");
	const signedIn = useRecoilValue(conn.signedIn);

	const [scouts, setScouts] = useState<ScoutClass[]>([]);
	const selfScout = useRecoilValue(conn.scout);
	console.log(scouts);
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!signedIn) {
			navigate("/home", {replace: true});
		}
	});

	conn.useSocketEffect('organization:get scouts', (scouts: ScoutClass[]) => {
		setScouts(scouts);
	});

	useEffect(() => {
		conn.socket.emit('organization:get url');
	}, [signedIn]);
	conn.useSocketEffect('organization:get url', (url: string) => {
		setLoginLink(url);
	});

	const [deletingScout, setDeletingScout] = useState<ScoutClass>(null);

	const setAdmin = (scout: ScoutClass, admin: boolean) => {

	};

	const [updatingPassword, setUpdatingPassword] = useState<ScoutClass>(null);
	const [errorPopup, setErrorPopup] = useState<string>(null);

	const [creatingScout, setCreatingScout] = useState(false);

	conn.useSocketEffect('organization:update password', (result: boolean) => {
		if (!result) setErrorPopup('Password update failed');
	}, [signedIn])

	conn.useSocketEffect('organization:delete scout', (result: boolean) => {
		if (!result) setErrorPopup('Failed to delete scout');
	}, [signedIn])
	
	conn.useSocketEffect('organization:create scout', (result: boolean) => {
		if (!result) setErrorPopup('Failed to create scout');
	}, [signedIn]);

	return <>
		<DeleteModal bodyText={`All information related to this scout will be deleted (including assigned projects). Username: ${deletingScout?.name}`} show={!!deletingScout} onClose={(del) => {
			if (del) conn.socket.emit('organization:delete scout', deletingScout.login);
			setDeletingScout(null);
		}}/>

		<UpdatePasswordModal show={!!updatingPassword} onClose={(result) => {
			if (result.update) conn.socket.emit('organization:update password', { login: updatingPassword.login, newPassword: result.newPassword });
			setUpdatingPassword(null);
		}}/>

		<ErrorModal show={errorPopup != null} content={errorPopup} onClose={
			() => setErrorPopup(null)
		}/>

		<RegisterModal show={creatingScout} onClose={(user) => {
			setCreatingScout(false);
			if (user) conn.socket.emit('organization:create scout', user);
		}}/>

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
					{scouts.map(scout => <tr className={scout.login == selfScout.login ? 'table-primary' : ''} key={scout.name}>
						<th>{scout.name}</th>
						<th>{scout.login}</th>
						<th>{scout.connections}</th>
						<th><Form.Check onClick={() => setAdmin(scout, !scout.admin)} type='switch' defaultChecked={scout.admin} disabled={scout.login==selfScout.login}/></th>
						<th><Button onClick={() => setUpdatingPassword(scout)}>Update password</Button></th>
						<th><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.login==selfScout.login} /></th>
					</tr>)}
				</tbody>
			</Table>
			<Button onClick={() => setCreatingScout(true)}>
				Add scout
			</Button>
		</Container>
	</>
}
