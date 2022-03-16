import * as React from 'react';
import { Accordion, Button, CloseButton, Dropdown, Stack, Table } from 'react-bootstrap';
import { useRecoilValue, useRecoilState } from 'recoil';
import * as conn from '../connection';

import DataEntry, { forms } from '../DataEntry';
import FormClass from '../../shared/dataClasses/FormClass';
import AssignmentClass from '../../shared/dataClasses/AssignmentClass';
import AssignmentResponseClass from '../../shared/dataClasses/AssignmentResponseClass';

function Assignment(props: {
	form?: FormClass;
	assignment: AssignmentClass;
}) {
	const [submitQueue, setSubmitQueue] = useRecoilState(conn.submitQueue);
	return <>
		{props.form && <DataEntry form={props.form} formID={props.assignment.id} />}
		<Button onClick={() => setSubmitQueue([...submitQueue, props.assignment])}>Submit</Button>
	</>
}

function submitResponses(queue: AssignmentClass[]) {
	for (let resp of queue) {
		console.log(resp);
		conn.socket.emit('assignment:respond', {
			assignment: resp.id,
			data: forms[resp.id]
		});
	}
}

export default function AssignmentsList() {
	const assignments = useRecoilValue(conn.assignments);
	const forms = useRecoilValue(conn.forms);
	const submitQueue = useRecoilValue(conn.submitQueue);
	const responses = useRecoilValue(conn.responses);

	return <>
		<Accordion>
			{assignments
				// Don't display assignments queued for submission
				.filter((assignment) => !submitQueue.find((a) => a.id == assignment.id))
				// Don't display assignments that have already been submitted
				.filter((assignment) => !responses.find((r) => r.assignment == assignment.id))
				.map((assignment, idx) => 
					<Accordion.Item key={assignment.id} eventKey={idx.toString()}>
						<Accordion.Header>
							{assignment.name}
						</Accordion.Header>
						<Accordion.Body>
							<Assignment form={forms.find(f => f.id==assignment.form)} assignment={assignment}/>
						</Accordion.Body>
					</Accordion.Item>
			)}
		</Accordion>
		<Stack direction='horizontal' gap={3}>
			<Button onClick={() => submitResponses(submitQueue)}>
				Sync ({submitQueue.filter(assignment => responses.find(res => res.assignment == assignment.id)).length} forms)
		  </Button> 
			<Button variant='secondary'>Sync by QR Code</Button>
		</Stack>
	</>;
}
