import * as React from 'react';
import { Form } from 'react-bootstrap';
import { TextChangeProps } from './types';

export default function TextChange(props: TextChangeProps) {
	return (
		<Form.Group className={props.className}>
			<Form.Label>{props.label}</Form.Label>
			<Form.Control
				value={props.text || ''}
				onChange={(e) => props.onChange(e.target.value)}
				className="form-control-sm" />
		</Form.Group>
	);
}
