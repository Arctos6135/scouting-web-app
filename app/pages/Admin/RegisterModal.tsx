import * as React from 'react';
import { useState } from 'react';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

export function RegisterModal(props: {
	show: boolean;
	onClose: (user?: { login: string; name: string; password: string; }) => void;
}) {

	const [login, setLogin] = useState<string>('');
	const [name, setName] = useState<string>('');

	const handleClose = (res?: any) => {
		props.onClose(res);
		setTimeout(() => {
			setLogin('');
			setName('');
		}, 500);
	};
	return <Modal centered show={props.show} onHide={() => handleClose()}>
		<Modal.Header closeButton>
			<Modal.Title>
				Create scout
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<InputGroup className='mb-3'>
				<InputGroup.Text>Login</InputGroup.Text>
				<Form.Control value={login} onChange={e => setLogin(e.target.value)} />
			</InputGroup>

			<InputGroup className='mb-3'>
				<InputGroup.Text>Name</InputGroup.Text>
				<Form.Control value={name} onChange={e => setName(e.target.value)} />
			</InputGroup>
			Password is blank by default. You may change this once the scout is created.
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => handleClose({ login, name, password: '' })} variant="primary">Create</Button>
		</Modal.Footer>
	</Modal>;
}