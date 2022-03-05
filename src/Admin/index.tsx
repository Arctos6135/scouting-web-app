import * as React from 'react';
import { Button, CloseButton, Container, Form, InputGroup, Table } from "react-bootstrap";
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { ScoutClass } from '../../backend/db/models/Scouting';
import * as conn from '../connection';
import { DeleteModal } from './DeleteModal';
import { ErrorModal } from './ErrorModal';
import { RegisterModal } from './RegisterModal';
import { UpdatePasswordModal } from './UpdatePasswordModal';
const {useState, useEffect} = React;

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
