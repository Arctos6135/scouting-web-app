/* eslint-disable react/prop-types */
import * as React from 'react';
import { Group, Row, Section } from 'shared/dataClasses/FormClass';
import { Button, Accordion } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createComponent, options, sectionsPropsAreEqual } from './helpers';
import { SectionBuilderProps } from './types';
import RowBuilder from './RowBuilder';
import GroupBuilder from './GroupBuilder';
import TextInput from './inputs/Text';
import Select from './inputs/Select';

function SectionBuilder(props: SectionBuilderProps) {
	const [section, setSection] = useState(props.section);
	useEffect(() => setSection(props.section), [props.section]);

	const builders = {
		row: (row: Row, index: number) => (
			<RowBuilder
				sectionIndex={props.index}
				index={index}
				row={row}
				onChange={props.onChange}
			/>
		),
		group: (group: Group, index: number) => (
			<GroupBuilder
				sectionIndex={props.index}
				index={index}
				group={group}
				onChange={props.onChange}
			/>
		),
	};

	function onChange(section: Section) {
		const sectionUpdate = Object.assign({}, section);
		setSection(sectionUpdate);
		props.onChange({ indices: { index: props.index }, update: sectionUpdate, type: 'section' });
	}

	return (
		<div className={props.className}>
			<TextInput
				className="mb-2"
				text={section.header}
				label="Section Header"
				onChange={(value) => {
					section.header = value;
					onChange(section);
				}}
			/>
			<Accordion>
				{section.groups.map((group, index) => (
					<Accordion.Item key={index} eventKey={`${index}`} >
						<Accordion.Header>
							{group.type === 'group' ? `Group ${index + 1}` : `Row ${index + 1}`}
						</Accordion.Header>
						<Accordion.Body>
							<Button className='mb-2' onClick={() => {
								section.groups.splice(index, 1);
								onChange(section);
							}}>Delete {group.type}</Button>
							{builders[group.type](group, index)}
						</Accordion.Body>
					</Accordion.Item>
				))}
			</Accordion>
			<Button className='mb-1 mt-2'
				onClick={() => {
					section.groups.push({ type: 'row', components: [] });
					onChange(section);
				}}
			>
				Add Row
			</Button>
			<Select className='mb-2'
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
					section.groups.push(group);
					onChange(section);
				}}
				label="New Group"
				buttonText="Add Group"
			/>
		</div>
	);
}

export default React.memo(SectionBuilder, sectionsPropsAreEqual);
