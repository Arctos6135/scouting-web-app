import * as React from 'react';
import { Button, Card, CardGroup, CloseButton, Col, Container, Form, InputGroup, Modal, Row, Stack, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import ScoutClass from '../../shared/dataClasses/ScoutClass';
import FormClass from '../../shared/dataClasses/FormClass';
import * as conn from '../connection';
import FormBuilder from '../FormBuilder';
import { DeleteModal } from './DeleteModal';
import { ErrorModal } from './ErrorModal';
import { RegisterModal } from './RegisterModal';
import { UpdatePasswordModal } from './UpdatePasswordModal';

import { FaPlus } from 'react-icons/fa';

import './styles.css';
import DataEntry from '../DataEntry';

const {useState, useEffect} = React;

const randomID = (len: number) => [...Array(len)].map(()=>Math.floor(Math.random()*16).toString(16)).join('');

function createForm(forms: FormClass[]) {
	let nameSuffix = 0;
	while (forms.some((form) => form.name == `Form #${nameSuffix}`)) nameSuffix++;
	conn.socket.emit('organization:update form', { id: randomID(32), name: `Form #${nameSuffix}`, sections: [] });
}

export default function AdminPage() {
	const [loginLink, setLoginLink] = useState<string>('Loading...');
	const signedIn = useRecoilValue(conn.signedIn);

	const [scouts, setScouts] = useState<ScoutClass[]>([]);
	const selfScout = useRecoilValue(conn.scout);

	const [forms, setForms] = useState<FormClass[]>([]);

	const navigate = useNavigate();

	
	useEffect(() => {
		if (!signedIn) {
			navigate('/home', {replace: true});
		}
		else {
			conn.socket.emit('organization:get scouts');
			conn.socket.emit('organization:get forms');
		}
	}, [signedIn]);

	conn.useSocketEffect('organization:get scouts', (scouts: ScoutClass[]) => {
		setScouts(scouts);
	});

	conn.useSocketEffect('organization:get forms', (forms: FormClass[]) => {
		setForms(forms);
	});

	useEffect(() => {
		conn.socket.emit('organization:get url');
	}, [signedIn]);
	conn.useSocketEffect('organization:get url', (url: string) => {
		setLoginLink(url);
	});

	const [deletingScout, setDeletingScout] = useState<ScoutClass>(null);
	const [deletingForm, setDeletingForm] = useState<FormClass>(null);

	const setAdmin = (scout: ScoutClass, admin: boolean) => {
		return;
	};

	const [updatingPassword, setUpdatingPassword] = useState<ScoutClass>(null);
	const [errorPopup, setErrorPopup] = useState<string>(null);
	const [creatingScout, setCreatingScout] = useState(false);
	const [editingForm, setEditingForm] = useState<FormClass>(null);

	useEffect(() => {
		if (editingForm) {
			window.onbeforeunload = function() {
				return 'Data will be lost if you leave the page, are you sure?';
			};
		}
		return () => {
			window.onbeforeunload = () => {return;};
		};
	});

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

	const ScoutTable = <Table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Login</th>
				<th className='text-truncate'>Connections</th>
				<th>Admin</th>
			</tr>
		</thead>
		<tbody>
			{scouts.map(scout => <tr className={scout.login == selfScout.login ? 'table-primary' : ''} key={scout.name}>
				<td className='text-truncate'>{scout.name}</td>
				<td className='text-truncate'>{scout.login}</td>
				<td className='text-truncate'>{scout.connections}</td>
				<td className='text-truncate'><Form.Check onClick={() => setAdmin(scout, !scout.admin)} type='switch' defaultChecked={scout.admin} disabled={scout.login == selfScout.login} /></td>
				<td><Button size="sm" onClick={() => setUpdatingPassword(scout)} variant='outline-primary'>Update password</Button></td>
				<td><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.login == selfScout.login} /></td>
			</tr>)}
		</tbody>
	</Table>;

	const FormTable = <Row xs={2} md={3} lg={4} className="g-4">
		{forms.map(form => <Col key={form.name}><Card>
			<Card.Header>
				<Card.Title>{form.name}</Card.Title>
			</Card.Header>
			<Card.Body style={{maxHeight: 200, overflow: 'scroll', fontSize:10}}>
				<DataEntry form={form} inputComponent={() => <hr style={{margin:0, height:6,color:'#d0d0d0'}}/>}></DataEntry>
			</Card.Body>
			<Card.Footer>
				<Stack direction='horizontal' gap={3}>
					<Button size="sm" onClick={() => setEditingForm(form)} variant='secondary'>Edit</Button>
					<Button size="sm" onClick={() => setDeletingForm(form)} variant='outline-secondary'>Delete</Button>
				</Stack>
			</Card.Footer>
		</Card></Col>)}
	</Row>;

	console.log(editingForm);

	return <>
		<DeleteModal bodyText={`All information related to this scout will be deleted. Username: ${deletingScout?.name}`} show={!!deletingScout} onClose={(del) => {
			if (del) conn.socket.emit('organization:delete scout', deletingScout.login);
			setDeletingScout(null);
		}}/>

		<DeleteModal bodyText={`All information related to this form will be deleted. Name: ${deletingForm?.name}`} show={!!deletingForm} onClose={(del) => {
			if (del) conn.socket.emit('organization:delete form', {id: deletingForm.id});
			setDeletingForm(null);
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

		<Modal show={!!editingForm} centered fullscreen={true} onHide={() => setEditingForm(null)}>
			<Modal.Header>
				<Modal.Title>Editing Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormBuilder form={editingForm} onChange={(update) => {
					setEditingForm(update);
					console.log(update);
					conn.socket.emit('organization:update form', update);
				}}></FormBuilder>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={() => setEditingForm(null)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
		
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
					{ScoutTable}
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => setCreatingScout(true)}>
						Add scout <FaPlus size={10} style={{marginLeft: 8}}/>
					</Button>
				</Card.Footer>
			</Card>

			<br/>
			<Card>
				<Card.Header>
					<Card.Title as='h2'>Forms</Card.Title>
				</Card.Header>
				<Card.Body>
					{FormTable}
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => createForm(forms)}>
						Add form <FaPlus size={10} style={{marginLeft: 8}}/>
					</Button>
				</Card.Footer>
			</Card>
		</Container>
	</>;
}
