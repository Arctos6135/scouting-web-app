import * as React from 'react';
import { Button, Card, Container, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { ErrorModal } from './ErrorModal';
import { RegisterModal } from './RegisterModal';

import { BsPlus } from 'react-icons/bs';

import './styles.css';

import { ScoutsTable } from './ScoutsTable';
import { FormsTable } from './FormsTable';
import { useDispatch, useSelector } from 'app/hooks';
import uniqueId from 'shared/uniqueId';
import { socket } from 'app/store';
const { useState, useEffect } = React;


function createForm() {
	socket.emit('team:update form', { id: uniqueId(), name: 'Form', sections: [] });
}

export default function AdminPage() {
	const loginLink = useSelector(state => state.admin.teamURL);
	const dispatch = useDispatch();
	const signedIn = useSelector(state => !!state.user.scout);
	const online = useSelector(state => state.user.online);

	const navigate = useNavigate();

	useEffect(() => {
		if (!signedIn) {
			navigate('/home', { replace: true });
		}
		else {
			socket.emit('team:get scouts');
			socket.emit('team:get forms');
			socket.emit('team:get url');
		}
	}, [signedIn]);

	const [errorPopup, setErrorPopup] = useState<string | null>(null);
	const [creatingScout, setCreatingScout] = useState(false);

	return <>
		{online ? <></> : <div id="screen-cover">You are not connected to the internet.</div>}
		<ErrorModal show={errorPopup != null} content={errorPopup ?? ''} onClose={
			() => setErrorPopup(null)
		} />

		<RegisterModal show={creatingScout} onClose={(user) => {
			setCreatingScout(false);
			if (user) socket.emit('team:create scout', user);
		}} />

		<Container style={{ overflow: online ? 'visible' : 'hidden', maxHeight: online ? undefined : '80vh' }}>
			<InputGroup>
				<InputGroup.Text>team login link</InputGroup.Text>
				<Form.Control id="login-link" readOnly={true} value={loginLink}></Form.Control>
				<Button onClick={() => navigator.clipboard.writeText(loginLink)}>Copy</Button>
			</InputGroup>
			<br />
			<Card>
				<Card.Header>
					<Card.Title as='h2'>Scouts</Card.Title>
				</Card.Header>
				<Card.Body style={{ overflow: 'scroll' }}>
					<ScoutsTable></ScoutsTable>
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => setCreatingScout(true)}>
						Add scout <BsPlus size={20} style={{ marginLeft: 8 }} />
					</Button>
				</Card.Footer>
			</Card>

			<br />
			<Card>
				<Card.Header>
					<Card.Title as='h2'>Forms</Card.Title>
				</Card.Header>
				<Card.Body>
					<FormsTable></FormsTable>
				</Card.Body>
				<Card.Footer>
					<Button onClick={() => createForm()}>
						Add form <BsPlus size={20} style={{ marginLeft: 8 }} />
					</Button>
				</Card.Footer>
			</Card>
		</Container>
	</>;
}
