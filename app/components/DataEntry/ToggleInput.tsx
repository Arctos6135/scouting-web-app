import * as React from 'react';
import { useEffect } from 'react';
import { FormCheck } from 'react-bootstrap';
import { FormIDContext } from './formState';
import Toggle from 'shared/dataClasses/FormClass/Toggle';
import { useSelector, useDispatch } from 'app/hooks';
import { setFormData } from 'app/store/reducers/forms';

export function ToggleInput(props: {
	component: Toggle;
}) {
	const formID = React.useContext(FormIDContext);
	const dispatch = useDispatch();
	const value = useSelector(state => state.forms.data[formID]?.[props.component.valueID]);
	useEffect(() => {
		if (value == undefined) {
			dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: 0
			}));
		}
	});
	return <div>
		<FormCheck
			type='switch'
			onChange={() => dispatch(setFormData({
				form: formID, 
				valueID: props.component.valueID, 
				value: value == 0 ? 1 : 0
			}))}
			defaultChecked={value == 1}
		/>
	</div>;
}
