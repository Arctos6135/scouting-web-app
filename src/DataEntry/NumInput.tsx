import * as React from 'react';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Num from '../../shared/dataClasses/FormClass/Number';

export function NumInput(props: {
	component: Num;
}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID + '/' + props.component.valueID));
	useEffect(() => {
		if (value == undefined) {
			setValue(props.component.default ?? '0');
		}
	});
	const setNum = (num: number) => {
		if (props.component.min <= num && num <= props.component.max) {
			setValue(num);
		}
	};
	return <div className='d-flex'>
		<Button onClick={() => setNum(Number.parseInt(value.toString()) - 1)}>-</Button>
		<Form.Control
			value={value ?? 0}
			onChange={value => setNum(Number.parseInt(value.target.value))} type='number' />
		<Button onClick={() => setNum(Number.parseInt(value.toString()) + 1)}>+</Button>
	</div>;
}
