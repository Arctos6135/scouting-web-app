import * as React from 'react';
import { useEffect } from 'react';
import { ToggleButton, ButtonGroup } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import { FormIDContext, formData } from './formState';
import Toggle from '../../shared/dataClasses/FormClass/Toggle';

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
		<ButtonGroup>
			<ToggleButton
				id={`false-${props.component.valueID}`}
				onChange={(e) => setValue(e.currentTarget.value)}
				type='radio'
				name="radio"
				variant={value == 0 ? 'danger' : 'outline-danger'}
				checked={value == 0}
				value={0}>
				{props.component.falseLabel}
			</ToggleButton>
			<ToggleButton
				id={`true-${props.component.valueID}`}
				onChange={(e) => setValue(e.currentTarget.value)}
				type='radio'
				name="radio"
				variant={value == 1 ? 'success' : 'outline-success'}
				checked={value == 1}
				value={1}>
				{props.component.trueLabel}
			</ToggleButton>
		</ButtonGroup>
	</div>;
}
