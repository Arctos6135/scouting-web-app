import { Row as RowType } from '../../shared/dataClasses/FormClass';
import * as React from 'react';
import { Row } from 'react-bootstrap';
import { FormGroup } from './FormGroup';

export function FormRow(props: {
	row: RowType;
	inputComponent?: any;
}) {
	return <Row className='mb-3'>{props.row.components.map((group, i) => <FormGroup
		key={i}
		group={group}
		inputComponent={props.inputComponent}
	/>
	)}</Row>;
}
