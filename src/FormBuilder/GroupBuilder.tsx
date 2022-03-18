import * as React from 'react';
import { Group } from '../../shared/dataClasses/FormClass';
import { useState, useEffect } from 'react';
import { createComponent, groupsPropsAreEqual, options } from './helpers';
import { GroupBuilderProps } from './types';
import TextInput from './inputs/Text';
import Select from './inputs/Select';
import NumberInput from './inputs/Number';
import Toggle from './inputs/Toggle';
import TextWithConfirm from './inputs/TextWithConfirm';
import EditSelection from './inputs/EditSelection';
import Picker from '../../shared/dataClasses/FormClass/Picker';

function GroupBuilder(props: GroupBuilderProps) {
	const [group, setGroup] = useState(props.group);
	useEffect(() => setGroup(props.group), [props.group]);
	const onChange = (group: Group) => {
		const groupUpdate = Object.assign({}, group);
		setGroup(groupUpdate);
		props.onChange({ indices: { index: props.index, sectionIndex: props.sectionIndex, rowIndex: props.rowIndex }, update: groupUpdate, type: 'group' });
	};

	return (
		<div className={props.className}>
			<TextInput
				text={group.label}
				label='Group Label'
				onChange={(value) => {
					group.label = value;
					onChange(group);
				}}
			/>
			<TextInput
				text={group.description}
				label='Group Description'
				onChange={(value) => {
					group.description = value;
					onChange(group);
				}}
			/>
			<TextInput
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
				<NumberInput
					label='Min'
					number={group.component.min}
					onChange={(value) => {
						if (group.component.type === 'num') {
							group.component.min = Number.parseInt(value);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'num' ? (
				<NumberInput
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
				<TextInput
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
				<NumberInput
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
				<NumberInput
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
				<Toggle className='mt-1'
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
				<EditSelection
					label='Edit Option'
					buttonText='Edit'
					options={group.component.options.map(option => ({ value: option, selected: false }))}
					onChange={(value, edit) => {
						if (group.component.type === 'picker') {
							group.component.options.splice(group.component.options.indexOf(value), 1);
							group.component.options.push(edit);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'picker' ? (
				<Select
					label='Delete Option'
					buttonText='Delete'
					options={group.component.options.map(option => ({ value: option, selected: false }))}
					onChange={(value) => {
						if (group.component.type === 'picker') {
							group.component.options.splice(group.component.options.indexOf(value), 1);
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'picker' ? (
				<Select
					label='Default Option'
					buttonText='Set Default'
					options={group.component.options.map(option => ({ value: option, selected: option === (group.component as Picker).default }))}
					onChange={(value) => {
						if (group.component.type === 'picker') {
							group.component.default = value;
							onChange(group);
						}
					}}
				/>
			) : undefined}
			{group.component.type === 'picker' ? (
				<TextWithConfirm
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
			{group.component.type === 'num' ? (
				<TextInput
					text={group.component.default}
					label='Default Value'
					onChange={(value) => {
						if (group.component.type === 'num') {
							group.component.default = value;
							onChange(group);
						}
					}}
				/>
			) : undefined}

			<Select
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

export default React.memo(GroupBuilder, groupsPropsAreEqual);
