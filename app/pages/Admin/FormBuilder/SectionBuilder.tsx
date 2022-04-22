/* eslint-disable react/prop-types */
import * as React from 'react';
import { formTypeMap, Group, Row, Section } from 'shared/dataClasses/Form';
import { Button, Accordion } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { createComponent, sectionsPropsAreEqual } from './helpers';
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
				text={section.header ?? ''}
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
							{builders[group.type](group as any, index)}
						</Accordion.Body>
					</Accordion.Item>
				))}
			</Accordion>
			<Button className='mb-1 mt-2'
				onClick={() => {
					onChange({...section, groups: section.groups.concat([{type: 'row', components: []}])});
				}}
			>
				Add Row
			</Button>
			<Select className='mb-2'
				options={Object.keys(formTypeMap).map((option) => {
					return { value: option, selected: false };
				})}
				onChange={(value) => {
					const component = createComponent(
						{ valueID: '', type: value as keyof typeof formTypeMap },
						value as 'num' | 'text' | 'picker'
					);
					const group: Group = {
						type: 'group',
						label: '',
						component: component,
					};
					onChange({ ...section, groups: section.groups.concat([group])});
				}}
				label="New Group"
				buttonText="Add Group"
			/>
		</div>
	);
}

export default React.memo(SectionBuilder, sectionsPropsAreEqual);
