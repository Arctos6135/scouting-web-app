/* eslint-disable react/prop-types */
import * as React from 'react';
import { Group } from '../../formSchema/Form';
import { Button, ListGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { createComponent, options, editingForm } from './helpers';
import { SectionBuilderProps } from './propTypes';
import RowBuilder from './RowBuilder';
import GroupBuilder from './GroupBuilder';
import TextChange from './TextChange';
import SelectChange from './SelectChange';

export default function SectionBuilder(props: SectionBuilderProps) {
	const [form, setForm] = useRecoilState(editingForm);
	const [section, setSection] = useState(form.sections[props.index]);

	const builders = {
		row: (index: number) => (
			<RowBuilder
				sectionIndex={props.index}
				index={index}
				onChange={props.onChange}
			/>
		),
		group: (index: number) => (
			<GroupBuilder
				sectionIndex={props.index}
				index={index}
				onChange={props.onChange}
			/>
		),
	};

	function onChange(section) {
		setSection(section);
		form.sections[props.index] = section;
		setForm(form);
		props.onChange(form);
	}

	return (
		<div className={props.className}>
			<h4>Section {props.index + 1}</h4>
			<TextChange
				className="mb-2"
				text={section.header}
				label="Section Header"
				onChange={(value) => {
					section.header = value;
					onChange(section);
				}}
			/>
			<ListGroup>
				{section.groups.map((group, index) => (
					<ListGroup.Item key={index}>
						{builders[group.type](index)}
					</ListGroup.Item>
				))}
			</ListGroup>
			<Button className='mb-1 mt-2'
				onClick={() => {
					section.groups.push({ type: 'row', components: [] });
					onChange(section);
				}}
			>
				Add Row
			</Button>
			<SelectChange className='mb-2'
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
