import * as React from 'react';
import { useEffect } from 'react';
import { FormCheck } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Toggle from 'shared/dataClasses/FormClass/Toggle';

export function ToggleInput(props: {
	component: Toggle;
}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID + '/' + props.component.valueID));
	useEffect(() => {
		if (value == undefined) {
			setValue(0);
		}
	});
	return <div>
		<FormCheck
			type='switch'
			onChange={() => setValue(value == 0 ? 1 : 0)}
			defaultChecked={value == 1}
		/>
	</div>;
}
