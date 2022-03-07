import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { TextWithButtonChangeProps } from './propTypes';

export default function SelectChange(props: TextWithButtonChangeProps) {
	const [value, setValue] = useState('');

	return (
		<Form.Group className={props.className}>
			<Form.Label>{props.label}</Form.Label>
			<InputGroup>
				<Form.Control onChange={(e) => setValue(e.target.value)} />
				<Button
					variant="outline-secondary"
					onClick={() => props.onChange(value)}
				>
					{props.buttonText}
				</Button>
			</InputGroup>
		</Form.Group>
	);
}