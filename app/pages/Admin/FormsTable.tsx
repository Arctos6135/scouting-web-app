import * as React from 'react';
import {useState, useEffect} from 'react';
import { Button, Card, Col, Modal, Row, Stack } from 'react-bootstrap';
import FormClass from 'shared/dataClasses/FormClass';
import FormBuilder from './FormBuilder';
import DeleteModal from 'app/components/DeleteModal';
import DataEntry from 'app/components/DataEntry';

import './forms-table-styles.css';
import { useSelector } from 'app/hooks';
import _ from 'lodash';
import { socket } from 'app/store';

export function FormsTable() {
	const forms = useSelector(state => state.forms.schemas.list, _.isEqual);

	const [deletingForm, setDeletingForm] = useState<FormClass>(null);
	const [editingForm, setEditingForm] = useState<FormClass>(null);

	useEffect(() => {
		if (editingForm) {
			window.onbeforeunload = function () {
				return 'Data will be lost if you leave the page, are you sure?';
			};
		}
		return () => {
			window.onbeforeunload = () => { return; };
		};
	});

	return <>
		<DeleteModal bodyText={`All information related to this form will be deleted. Name: ${deletingForm?.name}`} show={!!deletingForm} onClose={(del) => {
			if (del)
				socket.emit('organization:delete form', { id: deletingForm.id });
			setDeletingForm(null);
		}} />

		<Modal show={!!editingForm} centered fullscreen={true} onHide={() => setEditingForm(null)}>
			<Modal.Header>
				<Modal.Title>Editing Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormBuilder form={editingForm} onChange={(update) => {
					setEditingForm(update);
					socket.emit('organization:update form', update);
				}}></FormBuilder>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={() => setEditingForm(null)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>

		<Row xs={2} md={3} lg={4} className="g-4 form-card">
			{forms.map((form, idx) => <Col key={idx}><Card>
				<Card.Header>
					<Card.Title>{form.name}</Card.Title>
				</Card.Header>
				<Card.Body style={{ maxHeight: 200, overflow: 'scroll', fontSize: 10 }}>
					<DataEntry form={form} inputComponent={() => <hr style={{ margin: 0, height: 6, color: '#d0d0d0' }} />}></DataEntry>
				</Card.Body>
				<Card.Footer>
					<Stack direction='horizontal' gap={3}>
						<Button size="sm" onClick={() => setEditingForm(form)} variant='secondary'>Edit</Button>
						<Button size="sm" onClick={() => setDeletingForm(form)} variant='outline-secondary'>Delete</Button>
					</Stack>
				</Card.Footer>
			</Card></Col>)}
		</Row>
	</>;
}
