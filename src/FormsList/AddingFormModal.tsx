import * as React from 'react';
import { useState, useEffect } from 'react';
import { Button, DropdownButton, Form, InputGroup, Modal } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';

export function AddingFormModal(props: {
	show: boolean;
	onClose: (res?: { name: string; form: string; }) => void;
}) {
	const forms = useRecoilValue(conn.forms);

	const [name, setName] = useState<string>('');
	const [form, setForm] = useState<string>();
	useEffect(() => {
		setForm(forms[0]?.id ?? '');
	}, [forms]);

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
				<Form.Control value={name} onChange={e => setName(e.target.value)} />
			</InputGroup>

			<InputGroup className='mb-3'>
				<InputGroup.Text>Form</InputGroup.Text>
				<Form.Select value={form} onChange={ e => setForm(e.target?.value) }>
					{forms.map((form, idx) => <option key={idx} value={form.id}>{form.name}</option>)}
				</Form.Select>	
			</InputGroup>
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => handleClose({ name, form })} variant="primary">Create</Button>
		</Modal.Footer>
	</Modal>;
}