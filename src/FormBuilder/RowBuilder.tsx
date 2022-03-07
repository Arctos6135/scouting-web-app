import * as React from 'react';
import { Group, Row as RowType } from '../../formSchema/Form';
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { createComponent, editingForm, options } from './helpers';
import { RowBuilderProps } from './propTypes';
import GroupBuilder from './GroupBuilder';
import SelectChange from './SelectChange';

export default function RowBuilder(props: RowBuilderProps) {
	const [form, setForm] = useRecoilState(editingForm);
	const [row, setRow] = useState(
		form.sections[props.sectionIndex].groups[props.index] as RowType
	);
	console.log(row);
	return (
		<div className={props.className}>
			<Row>
				{row.components.map((component, index) => (
					<Col key={index}>
						<GroupBuilder
							sectionIndex={props.sectionIndex}
							index={index}
							rowIndex={props.index}
							onChange={props.onChange} />
					</Col>
				))}
			</Row>
			<SelectChange
				options={options.map((option) => {
					return { value: option, selected: false };
				})}
				onChange={(value) => {
					const component = createComponent(
						{ valueID: '', type: value },
						value as 'num' | 'text' | 'picker'
					);
					const group: Group = {
						type: 'group',
						label: '',
						component: component,
					};
					row.components.push(group);
					setRow(row);
					form.sections[props.sectionIndex].groups[props.index] = row;
					setForm(form);
					props.onChange(form);
				}}
				label=" New Group"
				buttonText="Add Group"
			/>
		</div>
	);
}
