import * as React from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FormIDContext } from './formState';
import { Text } from 'shared/dataClasses/Form/Text';
import { useSelector, useDispatch } from 'app/hooks';
import { setFormData } from 'app/store/reducers/user';

export function TextInput(props: {
	component: Text;
}) {
	const formID = React.useContext(FormIDContext);
	const dispatch = useDispatch();
	const value = useSelector(state => state.user.forms.data[formID]?.[props.component.valueID]);
	useEffect(() => {
		if (value == undefined) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: ''
			}));
		}
	});
	return <Form.Control
		value={value ?? ''}
		onChange={(value) =>
			dispatch(setFormData({
				form: formID,
				valueID: props.component.valueID,
				value: value.target.value
			}))} />;
}
