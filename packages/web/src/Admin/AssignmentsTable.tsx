import * as React from 'react';
import { useState } from 'react';
import { CloseButton, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';

import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import FormClass from '@scouting-app/shared/dataClasses/FormClass';
import AssignmentClass from '@scouting-app/shared/dataClasses/AssignmentClass';
import ScoutClass from '@scouting-app/shared/dataClasses/ScoutClass';
import { DeleteModal } from './DeleteModal';

// Find the scout that was removed
// Return null if none
function removedScout(before: string[], after: string[]): string | null {
	const afterSet = new Set(after);
	for (const s of before) if (!afterSet.has(s)) return s;
	return null;
}

export function AssignmentsTable() {
	const scouts = useRecoilValue(conn.scouts);
	const assignments = useRecoilValue(conn.assignments);
	const forms = useRecoilValue(conn.forms);

	return <Table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Form</th>
				{/*<th>Due</th>*/}
				<th>Assigned to</th>
			</tr>
		</thead>
		<tbody>
			{assignments.map((assignment, idx) => <AssignmentRow key={idx} scouts={scouts} form={forms.find((form) => form.id == assignment.form)} assignment={assignment}></AssignmentRow>)}
		</tbody>
	</Table>;
}
function AssignmentRow({form, assignment, scouts}: {
	form: FormClass;
	assignment: AssignmentClass;
	scouts: ScoutClass[];
}) {
	const [removingScout, setRemovingScout] = useState<string[]>(null);
	const [removingAssignment, setRemovingAssignment] = useState<string>(null);

	// TODO: Stop typeahead from focusing after closing the delete modal
	return <>
		<DeleteModal show={!!removingScout} onClose={(result) => {
			if (result) {
				conn.socket.emit('organization:assign', {
					...assignment,
					scouts: removingScout
				});
			}
			setRemovingScout(null);
		}} titleText='Are you sure you want to remove a scout from an assignment?' bodyText='This will delete any data entered/submitted by that scout'/>
		<DeleteModal show={!!removingAssignment} onClose={(result) => {
			if (result) {
				conn.socket.emit('organization:delete assignment', removingAssignment);
			}
			setRemovingAssignment(null);
		}} titleText='Are you sure you want to delete an assignment' bodyText='This will delete any data entered/submitted scouts for this assignment'/>
		<tr>
			<td>{assignment.name}</td>
			<td>
				{form?.name ?? 'Unknown form'}
			</td>
			{/*<td>*/}
			{/* TODO: Make date editing work*/}
			{/*<Form.Control name='wtf' defaultValue={assignment.due ?? 'Not set'} type='datetime-local'></Form.Control>*/}
			{/*{assignment.due ?? 'Not set'}*/}
			{/*</td>*/}
			<td><Typeahead labelKey='login' inputProps={{readOnly: true}} selected={assignment.scouts}
				onChange={(newVal: string[]) => {
					const removed = removedScout(assignment.scouts, newVal);
					console.log(removed, assignment.scouts, newVal);
					if (removed) setRemovingScout(newVal);
					else {
						conn.socket.emit('organization:assign', {
							...assignment,
							scouts: newVal
						});
					}
				} } options={scouts.map(s => s.login)} multiple id={`user-selector-${assignment.id}`}></Typeahead>
			</td>
			<td><CloseButton onClick={() => setRemovingAssignment(assignment.id)} /></td>
		</tr>
	</>;
}

