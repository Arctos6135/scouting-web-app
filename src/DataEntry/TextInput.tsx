import * as React from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Text from '../../shared/dataClasses/FormClass/Text';

export function TextInput(props: {
	component: Text;
}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID + '/' + props.component.valueID));
	useEffect(() => {
		if (value == undefined) {
			setValue('');
		}
	});
	return <Form.Control
		value={value ?? ''}
		onChange={(value) => (setValue(value.target.value))} />;
}
