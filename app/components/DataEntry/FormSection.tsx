import { Group, Row, Section } from 'shared/dataClasses/Form';
import * as React from 'react';
import { FormGroup } from './FormGroup';
import { FormRow } from './FormRow';

export function FormSection(props: {
	section: Section;
    inputComponent?: any;
}) {
	return <>
		{props.section.header ? <h2>{props.section.header}</h2> : <></>}
		{props.section.groups.map((group, i) => group.type == 'group' ? 
			<FormGroup key={i} group={group} inputComponent={props.inputComponent} /> :
			<FormRow key={i} row={group} inputComponent={props.inputComponent}/>
		) }
	</>;
}
