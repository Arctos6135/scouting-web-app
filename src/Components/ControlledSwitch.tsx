import * as React from 'react';
import { Form } from 'react-bootstrap';

export function ControlledSwitch(props: {
	[key: string]: any;
	onChange: (val: boolean) => void
}) {
	const ref = React.useRef<HTMLInputElement>();

	return <Form.Check {...props} onChange={val => {
		props.onChange?.(ref.current.checked);
		ref.current.checked = props.value;
	}} ref={ref}/> 
}
