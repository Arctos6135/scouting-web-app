import * as React from 'react';
import { Form } from 'react-bootstrap';
import { ToggleProps } from '../types';

export default function Toggle(props: ToggleProps) {
	return (
		<Form.Group className={props.className}>
			<Form.Check
				type='switch'
				label={props.label}
				checked={props.checked}
				onChange={props.onChange} />
		</Form.Group>
	);
}