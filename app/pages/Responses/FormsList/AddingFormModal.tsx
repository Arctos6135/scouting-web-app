import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, DropdownButton, Form, InputGroup, Modal } from 'react-bootstrap';
import { useSelector } from 'app/hooks';
import _ from 'lodash';

export function AddingFormModal(props: {
	show: boolean;
	onClose: (res?: { name: string; form: string; error: boolean; }) => void;
}) {
	const forms = useSelector(state => state.user.forms.schemas.list, (l, r) => _.isEqual(l, r));

	const [name, setName] = useState<string>('');
	const [form, setForm] = useState<string>();
	const [error, setError] = useState<boolean>(name.length === 0);
	useEffect(() => {
		setForm(forms[0]?.id ?? '');
	}, [forms]);

	useEffect(() => {
		if (name.length === 0) {
			setError(true);
		} else {
			setError(false);
		}
	}, [name]);

	const handleClose = (res?) => {
		props.onClose(res);
		setTimeout(() => {
			setName('');
			setForm(forms[0].id);
		}, 500);
	};
	return <Modal centered show={props.show} onHide={() => handleClose()}>
		<Modal.Header closeButton>
			<Modal.Title>
				Add form
			</Modal.Title>
		</Modal.Header>
		<Modal.Body>
			<InputGroup className='mb-3'>
				<InputGroup.Text>Name</InputGroup.Text>
				<Form.Control value={name} onChange={e => setName(e.target.value)} isInvalid={error} />
				<Form.Control.Feedback type='invalid'>Name must not be empty.</Form.Control.Feedback>
			</InputGroup>

			<InputGroup className='mb-3'>
				<InputGroup.Text>Form</InputGroup.Text>
				<Form.Select value={form} onChange={ e => setForm(e.target?.value) }>
					{forms.map((form, idx) => <option key={idx} value={form.id}>{form.name}</option>)}
				</Form.Select>	
			</InputGroup>
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => handleClose({ name, form, error })} variant="primary" disabled={error}>Create</Button>
		</Modal.Footer>
	</Modal>;
}
