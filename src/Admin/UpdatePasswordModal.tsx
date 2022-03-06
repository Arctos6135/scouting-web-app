import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

// Modal for updating scouts' passwords
export function UpdatePasswordModal(props: {
	show: boolean;
	onClose: (result: { newPassword: string; update: boolean; }) => any;
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
				<Form.Control type='password' value={pass} onChange={e => setPass(e.target.value)} />
			</Form.Group>
			<Form.Group>
				<Form.Text>Repeat password</Form.Text>
				<Form.Control type='password' value={passRepeat} onChange={e => setPassRepeat(e.target.value)} />
			</Form.Group>
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => props.onClose({ newPassword: pass, update: true })} disabled={pass != passRepeat}>Update</Button>
		</Modal.Footer>
	</Modal>;
}
