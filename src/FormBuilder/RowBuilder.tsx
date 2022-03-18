import * as React from 'react';
import { Group, Row as RowType } from '../../shared/dataClasses/FormClass';
import { Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createComponent, options, rowsPropsAreEqual } from './helpers';
import { RowBuilderProps } from './types';
import GroupBuilder from './GroupBuilder';
import Select from './inputs/Select';

function RowBuilder(props: RowBuilderProps) {
	const [row, setRow] = useState(props.row);
	useEffect(() => setRow(props.row), [props.row]);

	function onChange(row: RowType) {
		const rowUpdate = Object.assign({}, row);
		setRow(rowUpdate);
		props.onChange({ indices: { index: props.index, sectionIndex: props.sectionIndex }, update: rowUpdate, type: 'row' });
	}

	return (
		<div className={props.className}>
			<Row xs={1} lg={2} xl={3}>
				{row.components.map((component, index) => (
					<Col key={index}>
						<Button onClick={() => {
							row.components.splice(index, 1);
							onChange(row);
						}}>Delete Group</Button>
						<GroupBuilder
							sectionIndex={props.sectionIndex}
							index={index}
							rowIndex={props.index}
							group={component}
							onChange={props.onChange} />
					</Col>
				))}
			</Row>
			<Select
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
export default React.memo(RowBuilder, rowsPropsAreEqual);