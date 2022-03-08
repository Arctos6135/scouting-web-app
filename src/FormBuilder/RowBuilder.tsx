import * as React from 'react';
import { Group, Row as RowType } from '../../formSchema/Form';
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { createComponent, options } from './helpers';
import { RowBuilderProps } from './types';
import GroupBuilder from './GroupBuilder';
import SelectChange from './SelectChange';

function RowBuilder(props: RowBuilderProps) {
	const [row, setRow] = useState(props.row);
	function onChange(row: RowType) {
		const rowUpdate = Object.assign({}, row);
		setRow(rowUpdate);
		props.onChange({ indices: { index: props.index, sectionIndex: props.sectionIndex }, update: rowUpdate, type: 'row' });
	}
	console.log('rerender row');
	return (
		<div className={props.className}>
			<Row>
				{row.components.map((component, index) => (
					<Col key={index}>
						<GroupBuilder
							sectionIndex={props.sectionIndex}
							index={index}
							rowIndex={props.index}
							group={component}
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
					onChange(row);
				}}
				label=" New Group"
				buttonText="Add Group"
			/>
		</div>
	);
}
export default React.memo(RowBuilder);