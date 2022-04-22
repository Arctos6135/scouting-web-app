import { Group, formTypeMap, Component } from 'shared/dataClasses/Form';
import * as React from 'react';
import { Form, Col } from 'react-bootstrap';
import { TextInput } from './TextInput';
import { NumInput } from './NumInput';
import { PickerInput } from './PickerInput';
import { TimerInput } from './TimerInput';
import { ToggleInput } from './ToggleInput';

export function FormGroup(props: {
	group: Group;
	inputComponent?: any;
}) {
	const components: {
		[key in Component['type']]: (component: Extract<Component, {type: key}>) => JSX.Element
	} = {
		'text': (component) => <TextInput component={component} />,
		'num': (component) => <NumInput component={component} />,
		'picker': (component) => <PickerInput component={component} />,
		'timer': (component) => <TimerInput component={component} />,
		'toggle': (component) => <ToggleInput component={component} />
	};
	return <Form.Group className='mb-3' as={Col}>
		<Form.Label>{props.group.label}</Form.Label>
		{props.inputComponent
			? <props.inputComponent component={props.group.component} />
			: components[props.group.component.type](props.group.component as never)}
		{props.group.description ? <Form.Text>{props.group.description}</Form.Text> : <></>}
	</Form.Group>;
}
