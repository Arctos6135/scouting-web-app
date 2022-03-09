import * as React from 'react';
import {useState, useEffect} from 'react';
import { Button, Card, Col, Modal, Row, Stack } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import FormClass from '../../shared/dataClasses/FormClass';
import * as conn from '../connection';
import FormBuilder from '../FormBuilder';
import { DeleteModal } from './DeleteModal';
import DataEntry from '../DataEntry';

export function FormsTable() {
	const forms = useRecoilValue(conn.forms);

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
				conn.socket.emit('organization:delete form', { id: deletingForm.id });
			setDeletingForm(null);
		}} />

		<Modal show={!!editingForm} centered fullscreen={true} onHide={() => setEditingForm(null)}>
			<Modal.Header>
				<Modal.Title>Editing Form</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<FormBuilder form={editingForm} onChange={(update) => {
					setEditingForm(update);
					conn.socket.emit('organization:update form', update);
				}}></FormBuilder>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={() => setEditingForm(null)}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>

		<Row xs={2} md={3} lg={4} className="g-4">
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
