import * as React from 'react';
import { Accordion, CloseButton, Dropdown, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import * as conn from '../connection';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import DataEntry from '../DataEntry';
import FormClass from '../../shared/dataClasses/FormClass';

export default function AssignmentsList() {
	const scouts = useRecoilValue(conn.scouts);
	const assignments = useRecoilValue(conn.assignments);
	const forms = useRecoilValue(conn.forms);

	console.log(assignments, scouts, forms);
	return <Accordion>
		{assignments.map((assignment, idx) => 
			<Accordion.Item key={idx} eventKey={idx.toString()}>
				<Accordion.Header>
					{assignment.name}
				</Accordion.Header>
				<Accordion.Body>
					{forms.find(f => f.id==assignment.form) ? <DataEntry form={forms.find(f => f.id==assignment.form) ?? new FormClass()} formID={assignment.id} /> : <></> }
				</Accordion.Body>
			</Accordion.Item>
		)}
	</Accordion>;
}
