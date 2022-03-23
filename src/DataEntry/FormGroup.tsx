import { Group } from '../../shared/dataClasses/FormClass';
import * as React from 'react';
import { Form, Col } from 'react-bootstrap';
import { TextInput } from './TextInput';
import { NumInput } from './NumInput';
import { PickerInput } from './PickerInput';
import { TimerInput } from './TimerInput';

export function FormGroup(props: {
	group: Group;
	inputComponent?: any;
}) {
	const components = {
		'text': (component) => <TextInput component={component} />,
		'num': (component) => <NumInput component={component} />,
		'picker': (component) => <PickerInput component={component} />,
		'timer': (component) => <TimerInput component={component} />
	};
	return <Form.Group className='mb-3' as={Col}>
		<Form.Label>{props.group.label}</Form.Label>
		{props.inputComponent
			? <props.inputComponent component={props.group.component} />
			: components[props.group.component.type](props.group.component)}
		{props.group.description ? <Form.Text>{props.group.description}</Form.Text> : <></>}
	</Form.Group>;
}
