import * as React from 'react';
import { useState } from 'react';
import { Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

import * as conn from '../connection';

export function AssignmentModal(props: {
	show: boolean;
	onClose: (user?: { form: string; name: string; due: string; }) => void;
}) {

	const forms = useRecoilValue(conn.forms);
	const [form, setForm] = useState<string>(forms[0]?.id ??'');
	const [name, setName] = useState<string>('');
	//const [due, setDue] = useState<string>('');

	const handleClose = (res?) => {
		props.onClose(res);
		setTimeout(() => {
			setForm('');
			setName('');
			//setDue('');
		}, 500);
	};

	return <Modal centered show={props.show} onHide={() => handleClose()}>
		<Modal.Header closeButton>
			<Modal.Title>
				Create assignment
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

			{/*<InputGroup className='mb-3'>
				<InputGroup.Text>Due date</InputGroup.Text>
				<Form.Control type='datetime-local' value={due} onChange={e => setDue(e.target.value)} />
			</InputGroup>*/}
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => handleClose({ form, name})} variant="primary">Create</Button>
		</Modal.Footer>
	</Modal>;
}
