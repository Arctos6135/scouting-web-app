import * as React from 'react';
import { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Picker from 'shared/dataClasses/FormClass/Picker';

export function PickerInput(props: {
	component: Picker;
}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID + '/' + props.component.valueID));
	useEffect(() => {
		if (value == undefined) {
			setValue(props.component.default ?? props.component.options[0]);
		}
	});
	return <Form.Select value={value ?? ''} onChange={(value) => setValue(value.target.value)}>
		{props.component.options.map(opt => <option key={opt}>{opt}</option>)}
	</Form.Select>;
}
