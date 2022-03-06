import * as React from 'react';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export function RegisterModal(props: {
	show: boolean;
	onClose: (user?: { login: string; name: string; password: string; }) => any;
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
				<Form.Control value={login} onChange={e => setLogin(e.target.value)} />
			</Form.Group>
			<Form.Group>
				<Form.Text>Name</Form.Text>
				<Form.Control value={name} onChange={e => setName(e.target.value)} />
			</Form.Group>
			Password is blank by default. You may change this once the scout is created.
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => props.onClose({ login, name, password: '' })} variant="primary">Create</Button>
		</Modal.Footer>
	</Modal>;
}
