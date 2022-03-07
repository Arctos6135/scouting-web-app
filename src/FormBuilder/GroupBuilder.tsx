import * as React from 'react';
import { Row, Group } from '../../formSchema/Form';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { createComponent, options, editingForm } from './helpers';
import { GroupBuilderProps } from './propTypes';
import TextChange from './TextChange';
import SelectChange from './SelectChange';
import NumberChange from './NumberChange';
import ToggleChange from './ToggleChange';
import TextWithButtonChange from './TextWithButtonChange';

export default function GroupBuilder(props: GroupBuilderProps) {
	const [form, setForm] = useRecoilState(editingForm);
	const [group, setGroup] = useState(
		(props.rowIndex !== undefined
			? (form.sections[props.sectionIndex].groups[props.rowIndex] as Row)
				.components[props.index]
			: form.sections[props.sectionIndex].groups[props.index]) as Group
	);
	console.log(group);
	const onChange = (group: Group) => {
		setGroup(group);
		if (props.rowIndex) {
			(
				form.sections[props.sectionIndex].groups[props.rowIndex] as Row
			).components[props.index] = group;
		} else {
			form.sections[props.sectionIndex].groups[props.index] = group;
		}
		setForm(form);
		props.onChange(form);
	};

	return (
		<div className={props.className}>
			<TextChange
				text={group.label}
				label='Group Label'
				onChange={(value) => {
					group.label = value;
					onChange(group);
				}}
			/>
			<TextChange
				text={group.description}
				label='Group Description'
				onChange={(value) => {
					group.description = value;
					onChange(group);
				}}
			/>
			<TextChange
				text={group.component.valueID}
				label='Value ID'
				onChange={(value) => {
					const newComponent = { ...group.component };
					newComponent.valueID = value;
					group.component = newComponent;
					onChange(group);
				}}
			/>
			{group.component.type === 'num' ? (
				<NumberChange
					label='Min'
					number={group.component.min}
					onChange={(value) => {
						if (group.component.type === 'num') {
							group.component.max = Number.parseInt(value);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'num' ? (
				<NumberChange
					label='Max'
					number={group.component.max}
					onChange={(value) => {
						if (group.component.type === 'num') {
							group.component.max = Number.parseInt(value);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'text' ? (
				<TextChange
					label='Allowed Characters'
					text={group.component.charset}
					onChange={(value) => {
						if (group.component.type === 'text') {
							group.component.charset = value;
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'text' ? (
				<NumberChange
					label='Minimum Length'
					number={group.component.minlength}
					onChange={(value) => {
						if (group.component.type === 'text') {
							group.component.minlength = Number.parseInt(value);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'text' ? (
				<NumberChange
					label='Maximum Length'
					number={group.component.maxlength}
					onChange={(value) => {
						if (group.component.type === 'text') {
							group.component.maxlength = Number.parseInt(value);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'text' ? (
				<ToggleChange className='mt-1'
					label='Password'
					checked={group.component.password}
					onChange={() => {
						if (group.component.type === 'text') {
							group.component.password = !group.component.password;
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'picker' ? (
				<TextWithButtonChange
					label='New Option'
					buttonText='Add Option'
					onChange={(value) => {
						if (group.component.type === 'picker') {
							group.component.options.push(value);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{/* currently wont't update default
			{group.component.type === 'num' ? <TextChange text={group.component.default} label='Default Value' onChange={(value) => {
				if (group.component.type === 'num') {
					group.component.default = value;
					onChange(group);
				}
			}} /> : undefined}
			*/}
			<SelectChange
				options={options.map((option) => {
					return { value: option, selected: option === group.component.type };
				})}
				onChange={(value) => {
					group.component = createComponent(
						group.component,
						value as 'num' | 'text' | 'picker'
					);
					onChange(group);
				}}
				label='Group Type'
				buttonText='Change Type'
			/>
		</div>
	);
}
