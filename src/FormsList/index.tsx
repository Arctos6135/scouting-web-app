import * as React from 'react';
import { Accordion, Button, Card, CloseButton, Dropdown, Stack, Table } from 'react-bootstrap';
import { useRecoilValue, useRecoilState } from 'recoil';
import * as conn from '../connection';

import DataEntry, { forms } from '../DataEntry';
import FormClass from '../../shared/dataClasses/FormClass';
import ResponseClass from '../../shared/dataClasses/ResponseClass';
import { AddingFormModal } from './AddingFormModal';
import {QRCodeModal} from './QRCodeModal';
import { uniqueId } from 'react-bootstrap-typeahead/types/utils';

function Response(props: {
	form?: FormClass;
	response: ResponseClass;
}) {
	const [submitQueue, setSubmitQueue] = useRecoilState(conn.submitQueue);
	const scout = useRecoilValue(conn.scout);
	return <>
		{props.form ?
			<>
				{props.form && <DataEntry form={props.form} formID={props.response.name} />}
				<Button onClick={() => setSubmitQueue([...submitQueue, {
					form: props.form.id,
					data: forms[props.response.name] ?? {},
					org: scout.org,
					scout: scout.login,
					id: props.response.id,
					name: props.response.name
				}])}>Submit</Button>
			</> : 'Invalid form'
		}
	</>;
}

function submitResponses(queue: ResponseClass[]) {
	for (const resp of queue) {
		conn.socket.emit('data:respond', resp);
	}
}

export default function FormsList() {
	const forms = useRecoilValue(conn.forms);
	const submitQueue = useRecoilValue(conn.submitQueue);
	const responses = useRecoilValue(conn.responses);
	const [activeForms, setActiveForms] = useRecoilState(conn.activeForms);
	const scout = useRecoilValue(conn.scout);
	const signedIn = useRecoilValue(conn.signedIn);
	console.log(signedIn);

	const [addingForm, setAddingForm] = React.useState<boolean>(false);
	const [showingQR, setShowingQR] = React.useState(false);

	return <>
		<AddingFormModal show={addingForm} onClose={response => {
			if (response) {
				setActiveForms([
					...activeForms, 
					{
						data: {},
						form: response.form,
						id: uniqueId(),
						name: response.name,
						org: scout.org,
						scout: scout.login
					}
				]);
			}
			setAddingForm(false);
		}}></AddingFormModal>
		<QRCodeModal show={showingQR} onClose={() => setShowingQR(false)}/>
		<Card>
			<Card.Body>
				{signedIn ? (activeForms.length ? <Accordion>
					{activeForms
						// Don't display responses queued for submission
						.filter((response) => !submitQueue.find((a) => a.id == response.id))
						// Don't display responses that have already been submitted
						.filter((response) => !responses.find((r) => r.id == response.id))
						.map((response, idx) =>
							<Accordion.Item key={response.id} eventKey={idx.toString()}>
								<Accordion.Header>
									{response.name}
								</Accordion.Header>
								<Accordion.Body>
									<Response form={forms.find(f => f.id == response.form)} response={response} />
								</Accordion.Body>
							</Accordion.Item>
						)}
				</Accordion> : 'No forms') : 'You are not logged in as a scout' }
			</Card.Body>
		</Card>
		<br/>
		<Card>
			<Card.Body>
				<Stack className="mb-3" direction='horizontal' gap={3}>
					<Button onClick={() => setAddingForm(true)} disabled={!signedIn}>
						Add form
					</Button>
				</Stack>
				<Stack direction='horizontal' gap={3}>
					<Button variant='outline-primary' onClick={() => submitResponses(submitQueue)} disabled={!signedIn}>
						Sync ({submitQueue.filter(resp => !responses.find(res => res.id == resp.id)).length} forms)
					</Button>
					<Button variant='outline-secondary' disabled={!signedIn} onClick={() => setShowingQR(true)}>Sync by QR Code</Button>
				</Stack>
			</Card.Body>
		</Card>
	</>;
}
