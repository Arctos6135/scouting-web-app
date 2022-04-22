import * as React from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FormIDContext } from './formState';
import { Picker } from 'shared/dataClasses/Form/Picker';
import { useSelector, useDispatch } from 'app/hooks';
import { setFormData } from 'app/store/reducers/user';

export function PickerInput(props: {
	component: Picker;
}) {
	const formID = React.useContext(FormIDContext);
	const dispatch = useDispatch();
	const value = useSelector(state => state.user.forms.data[formID]?.[props.component.valueID]);
	useEffect(() => {
		if (value == undefined) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: props.component.default ?? props.component.options[0]
			}));
		}
	});
	return <Form.Select value={value ?? ''} onChange={(value) => dispatch(setFormData({
		form: formID,
		valueID: props.component.valueID,
		value: value.target.value
	}))}>
		{props.component.options.map(opt => <option key={opt}>{opt}</option>)}
	</Form.Select>;
}
