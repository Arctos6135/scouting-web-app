import { Section } from 'shared/dataClasses/FormClass';
import * as React from 'react';
import { FormGroup } from './FormGroup';
import { FormRow } from './FormRow';

export function FormSection(props: {
	section: Section;
    inputComponent?: any;
}) {
	const groups = {
		'group': (group, i) => <FormGroup key={i} group={group} inputComponent={props.inputComponent} />,
		'row': (row, i) => <FormRow key={i} row={row} inputComponent={props.inputComponent}/>
	};

	return <>
		{props.section.header ? <h2>{props.section.header}</h2> : <></>}
		{props.section.groups.map((group, i) => groups[group.type](group, i))}
	</>;
}
