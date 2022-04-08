import * as React from 'react';
import { useEffect } from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData, useFormErrors } from './formState';
import Num from '../../shared/dataClasses/FormClass/Number';

export function NumInput(props: {
	component: Num;

}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID + '/' + props.component.valueID));
	const [error, setError] = React.useState<string | undefined>(undefined);
	const { setErrors } = useFormErrors();

	useEffect(() => {
		if (value == undefined) {
			setValue(props.component.default ?? '0');
		}
	});
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
				setValue(Number.parseInt(value.toString()) - 1);
			}}>-</Button>
			<FormControl
				value={value ?? 0}
				onChange={value => setValue(value.target.value)}
				type='number'
				isInvalid={error !== undefined}
			/>
			<Button onClick={() => {
				setValue(Number.parseInt(value.toString()) + 1);
			}}>+</Button>
		</div>
		{error
			? <div className='text-danger'>
				{error}
			</div>
			: <></>}
	</>;
}
