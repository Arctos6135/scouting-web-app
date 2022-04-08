import * as React from 'react';
import { useEffect } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { FormIDContext, useFormErrors } from './formState';
import Num from 'shared/dataClasses/FormClass/Number';
import { useSelector, useDispatch } from 'app/hooks';
import { setFormData } from 'app/store/reducers/user';

export function NumInput(props: {
	component: Num;

}) {
	const formID = React.useContext(FormIDContext);
	const dispatch = useDispatch();
	const value = useSelector(state => state.user.forms.data[formID]?.[props.component.valueID]);
	const [error, setError] = React.useState<string | undefined>(undefined);
	const { setErrors } = useFormErrors();

	useEffect(() => {
		if (value == undefined) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: props.component.default ?? 0
			}));
		}
	});
	const setNum = (num: number) => {
		dispatch(setFormData({
			form: formID, 
			valueID: props.component.valueID, 
			value: num
		}));
	};
	const changeError = (error: boolean) => setErrors((errors) => {
		errors[props.component.valueID] = error;
		return Object.assign({}, errors);
	});
	React.useEffect(() => {
		if (value === undefined || value.toString().length === 0) {
			setError('Value can\'t be empty');
			changeError(true);
		} else if (props.component.min > Number.parseInt(value.toString())) {
			setError(`Value must be at least ${props.component.min}`);
			changeError(true);
		} else if (props.component.max < Number.parseInt(value.toString())) {
			setError(`Value can't be higher then ${props.component.max}`);
			changeError(true);
		} else {
			setError(undefined);
			changeError(false);
		}
	}, [value]);

	return <>
		<div className='d-flex'>
			<Button onClick={() => {
				setNum(Number.parseInt(value.toString()) - 1);
			}}>-</Button>
			<FormControl
				value={value ?? 0}
				onChange={value => setNum(Number.parseInt(value.target.value))}
				type='number'
				isInvalid={error !== undefined}
			/>
			<Button onClick={() => {
				setNum(Number.parseInt(value.toString()) + 1);
			}}>+</Button>
		</div>
		{error
			? <div className='text-danger'>
				{error}
			</div>
			: <></>}
	</>;
}
