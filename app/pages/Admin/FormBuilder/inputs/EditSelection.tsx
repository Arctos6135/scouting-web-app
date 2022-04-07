import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import { EditSelectionProps } from '../types';

export default function EditSelection(props: EditSelectionProps) {
	const [selection, setSelection] = useState(
		props.options.length !== 0
			? props.options.find((value) => value.selected)?.value || props.options[0].value
			: undefined
	);
	const [edit, setEdit] = useState('');

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
				<Form.Control
					value={edit}
					onChange={(e) => setEdit(e.target.value)}
					className="form-control-sm" />
				<Button
					variant="outline-secondary"
					onClick={() => props.onChange(selection, edit)}
				>
					{props.buttonText}
				</Button>
			</InputGroup>
		</Form.Group>
	);
}