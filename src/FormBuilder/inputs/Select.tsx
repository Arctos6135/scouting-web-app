import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { SelectProps } from '../types';

export default function Select(props: SelectProps) {
	const [selection, setSelection] = useState(
		props.options.find((value) => value.selected)?.value ||
		props.options[0].value
	);

	return (
		<Form.Group className={props.className}>
			<Form.Label>{props.label}</Form.Label>
			<InputGroup>
				<Form.Select defaultValue={selection} onChange={(e) => setSelection(e.target.value)}>
					{props.options.map((option) => (
						<option
							key={option.value}
							value={option.value}
						>
							{option.value}
						</option>
					))}
				</Form.Select>
				<Button
					variant="outline-secondary"
					onClick={() => props.onChange(selection)}
				>
					{props.buttonText}
				</Button>
			</InputGroup>
		</Form.Group>
	);
}
