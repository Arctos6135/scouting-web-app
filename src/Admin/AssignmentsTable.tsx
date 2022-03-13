import * as React from 'react';
import { CloseButton, Dropdown, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';

import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import FormClass from '../../shared/dataClasses/FormClass';

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
			{assignments.map((assignment, idx) => ((selected: FormClass | undefined) => <tr key={idx}>
				<td>{assignment.name}</td>
				<td>
					<Dropdown onSelect={(val) => {
						conn.socket.emit('organization:assign', {
							...assignment,
							form: val
						});
					}}>
						<Dropdown.Toggle variant='outline' id='dropdown-basic'>
							{selected?.name ?? 'Unknown form'}
						</Dropdown.Toggle>
						<Dropdown.Menu>
							{forms.map((form, idx) => <Dropdown.Item key={idx} eventKey={form.id}>{form.name}</Dropdown.Item>)}
						</Dropdown.Menu>
					</Dropdown>
				</td>
				{/*<td>*/}
				{/* TODO: Make date editing work*/}
				{/*<Form.Control name='wtf' defaultValue={assignment.due ?? 'Not set'} type='datetime-local'></Form.Control>*/}
				{/*{assignment.due ?? 'Not set'}*/}
				{/*</td>*/}
				<td><Typeahead labelKey='login' selected={assignment.scouts} onChange={(newVal) => {
					conn.socket.emit('organization:assign', {
						...assignment,
						// Typeahead types are weird
						scouts: (newVal as string[])
					});
				}
				} options={scouts.map(s=>s.login)} multiple id={`user-selector-${idx}`}></Typeahead></td>
				<td><CloseButton onClick={() => conn.socket.emit('organization:delete assignment', assignment.id)} /></td>
			</tr>)(forms.find((form) => form.id == assignment.form)))}
		</tbody>
	</Table>;
}
