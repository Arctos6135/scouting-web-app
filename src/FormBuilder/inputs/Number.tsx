import * as React from 'react';
import { Form } from 'react-bootstrap';
import { NumberProps } from '../types';

export default function NumberInput(props: NumberProps) {
	return (
		<Form.Group className={props.className}>
			<Form.Label>{props.label}</Form.Label>
			<Form.Control
				type='number'
				value={props.number}
				onChange={(e) => props.onChange(e.target.value)}
				className="form-control-sm" />
		</Form.Group>
	);
}