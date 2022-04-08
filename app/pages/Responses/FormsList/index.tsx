import * as React from 'react';
import { Accordion, Button, Card, CloseButton, Collapse, Dropdown, Form, InputGroup, Stack, Table } from 'react-bootstrap';

import DataEntry from 'app/components/DataEntry';
import FormClass from 'shared/dataClasses/FormClass';
import ResponseClass from 'shared/dataClasses/ResponseClass';
import { AddingFormModal } from './AddingFormModal';
import {QRCodeModal} from './QRCodeModal';
import uniqueId from 'shared/uniqueId';
import DeleteModal from 'app/components/DeleteModal';
import { useDispatch, useSelector } from 'app/hooks';
import { moveToSubmitQueue, submit, createResponse, deleteResponse, updateResponse } from 'app/store/reducers/user';
import _ from 'lodash';

function Response(props: {
	form?: FormClass;
	response: ResponseClass;
}) {
	const scout = useSelector(state => state.user.scout, _.isEqual);
	const dispatch = useDispatch();
	const [deleting, setDeleting] = React.useState<boolean>(false);
	const [renaming, setRenaming] = React.useState<boolean>(false);
	const [valid, setValid] = React.useState(true);
	const [newName, setNewName] = React.useState(props.response.name);

	return <>
		{props.form ?
			<>
				<DeleteModal 
					bodyText="This will permanently delete any data you have entered." 
					titleText="Are you sure you want to delete this response?"
					onClose={del => {
						setDeleting(false);
						// Delete with a delay to let the modal fade out
						if (del) setTimeout(() => dispatch(deleteResponse(props.response.id)), 100);
					}}
					show={deleting}/>
				{props.form && <DataEntry form={props.form} formID={props.response.name} setValid={setValid}/>}
				<Stack gap={3} direction={'horizontal'}>
					<Button disabled={!valid} onClick={() => valid && dispatch(moveToSubmitQueue(props.response.id))}>Submit</Button>
					{renaming ?
						<InputGroup>
							<InputGroup.Text>Renaming</InputGroup.Text>
							<Form.Control value={newName} onChange={val => setNewName(val.target.value)} />
							<Button variant='outline-secondary' onClick={() => {
								setRenaming(false);
								const response = _.cloneDeep(props.response);
								response.name = newName;
								dispatch(updateResponse({
									id: props.response.id,
									update: response
								}));
							}}>Done</Button>
						</InputGroup> :
						<Button variant='outline-secondary' onClick={() => setRenaming(true)}>
							Rename
						</Button>}
					<Button variant='danger' onClick={() => setDeleting(true)}>
						Delete
					</Button>
				</Stack>
			</> : 'Invalid form'
		}
	</>;
}

export default function FormsList() {
	const signedIn = useSelector(state => !!state.user.scout);
	const activeResponses = useSelector(state => state.user.responses.activeResponses, _.isEqual);
	const submitQueueLength = useSelector(state => state.user.responses.submitQueue.length);
	const dispatch = useDispatch();
	const forms = useSelector(state => state.user.forms.schemas.map, _.isEqual);
	const [addingForm, setAddingForm] = React.useState<boolean>(false);
	const [showingQR, setShowingQR] = React.useState(false);
	const scout = useSelector(state => state.user.scout, _.isEqual);

	return <>
		<AddingFormModal show={addingForm} onClose={response => {
			if (response) {
				dispatch(createResponse({
					data: {},
					form: response.form,
					id: uniqueId(),
					name: response.name,
					org: scout.org,
					scout: scout.login
				}));
			}
			setAddingForm(false);
		}}></AddingFormModal>
		<QRCodeModal show={showingQR} onClose={() => setShowingQR(false)}/>
		<Card>
			<Card.Body>
				{signedIn ? (activeResponses.length ? <Accordion>
					{activeResponses
						.map((response, idx) =>
							<Accordion.Item key={response.id} eventKey={response.id}>
								<Accordion.Header>
									{response.name}
								</Accordion.Header>
								<Accordion.Body>
									<Response form={forms[response.form]} response={response} />
								</Accordion.Body>
							</Accordion.Item>
						)}
				</Accordion> : 'No active responses') : 'You are not logged in as a scout' }
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
					<Button variant='outline-primary' onClick={() => dispatch(submit())} disabled={!signedIn}>
						Sync ({submitQueueLength} responses)
					</Button>
					<Button variant='outline-secondary' disabled={!signedIn} onClick={() => setShowingQR(true)}>Sync by QR Code</Button>
				</Stack>
			</Card.Body>
		</Card>
	</>;
}