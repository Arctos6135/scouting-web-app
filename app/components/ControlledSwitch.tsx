import * as React from 'react';
import { Form } from 'react-bootstrap';

export function ControlledSwitch(props: {
	[key: string]: any;
	value: boolean;
	onChange: (val: boolean) => void;
}) {
	const ref = React.useRef<HTMLInputElement | null>(null);
	
	const {value, onChange, ...options} = props;

	React.useEffect(() => {
		if (ref && ref.current) ref.current.checked = value ?? false;
	}, [value]);

	return <Form.Check {...options} onChange={val => {
		if (!ref || !ref.current) return;
		onChange?.(ref.current.checked);
	}} ref={ref}/>;
}
