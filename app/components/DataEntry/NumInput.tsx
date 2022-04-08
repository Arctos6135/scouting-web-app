import * as React from 'react';
import { useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FormIDContext } from './formState';
import Num from 'shared/dataClasses/FormClass/Number';
import { useSelector, useDispatch } from 'app/hooks';
import { setFormData } from 'app/store/reducers/forms';

export function NumInput(props: {
	component: Num;
}) {
	const formID = React.useContext(FormIDContext);
	const dispatch = useDispatch();
	const value = useSelector(state => state.forms.data[formID]?.[props.component.valueID]);
	useEffect(() => {
		if (value == undefined) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: props.component.default ?? '0'
			}));
		}
	});
	const setNum = (num: number) => {
		if (props.component.min <= num && num <= props.component.max) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: num
			}));
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
