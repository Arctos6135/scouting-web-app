import FormSchema, {Section, Group, Row as FormRow} from '../shared/dataClasses/FormClass';
import * as React from 'react';
import {useEffect} from 'react';
import {Form,  Row, ListGroup, Col} from 'react-bootstrap';
import { useRecoilState, atomFamily, selectorFamily} from 'recoil';
import FormComponent from '../shared/dataClasses/FormClass/FormComponent';

// Context that stores the id of a form
// Inputs for that form use this to know where to store their values
const FormIDContext = React.createContext('');  

// Contains all the forms' data in an object. Used to sync with database
export let forms = {};
if (localStorage.getItem('formData')) forms = JSON.parse(localStorage.getItem('formData'));

// Atom family that stores values for every form input
const formDataAtom = atomFamily({
	key: 'formDataAtom',
	default: (id: string) => forms[id.split('/')[0]]?.[id.split('/')[1]],
});

const formData = selectorFamily<string|number, string>({
	key: 'formData',
	get:  (id) => ({ get }) => {
		const atom = get(formDataAtom(id));
		return atom;
	},
	set: (id) => ({set}, value) => {
		set(formDataAtom(id), value);
		const [formName, propName] = id.split('/'); 
		if (!forms[formName]) forms[formName] = {};
		forms[formName][propName] = value;
		// Don't save to local storage if form name is blank
		if (formName != '') localStorage.setItem('formData', JSON.stringify(forms));
	}
});

function FormInput(props: { 
	component: FormComponent;
}) {
	const formID = React.useContext(FormIDContext);
	const [value, setValue] = useRecoilState(formData(formID +'/'+ props.component.valueID));
	useEffect(() => {
		if (value == undefined) {
			switch (props.component.type) {
			case 'text':
				setValue('');
				break;
			case 'num':
				setValue(0);
				break;
			case 'picker':
				setValue((props.component as any)?.default ?? (props.component as any).options[0]);
				break;
			}
		}
	});
	const component = props.component as any;
	switch (props.component.type) {
	case 'text':
		return <Form.Control value={value??''} onChange={(value) => (setValue(value.target.value))}></Form.Control>;
	case 'picker':
		return <Form.Select value={value??''} onChange={(value) => setValue(value.target.value)}>
			{component.options.map(opt => <option key={opt}>{opt}</option>)}
		</Form.Select>;
	case 'num':
		return <Form.Control value={value??0} onChange={value => setValue(value.target.value)} type='number' ></Form.Control>;
	}
}

function FormGroup(props: { 
	group: Group | FormRow;
	inputComponent: any;
}) {
	if (props.group.type == 'row') {
		const group = props.group as FormRow;
		return <Row className='mb-3'>{group.components.map((group, i) => 
			<FormGroup
				inputComponent={props.inputComponent}
				key={i}
				group={group}></FormGroup>
		)}</Row>;
	}
	else {
		const group = props.group as Group;
		const component = <props.inputComponent component={group.component}></props.inputComponent>;
		return <Form.Group className='mb-3' as={Col}>
			<Form.Label>{group.label}</Form.Label>
			{component}
			{group.description ? <Form.Text>{group.description}</Form.Text> : <></>}
		</Form.Group>;
	}
}

function FormSection(props: { 
	section: Section;
	inputComponent: any;
}) {
	const body = <>
		{props.section.header ? <h2>{props.section.header}</h2> : <></>}
		{props.section.groups.map((group, i) => <FormGroup inputComponent={props.inputComponent} key={i} group={group}></FormGroup>)}
	</>;

	return body; 
}

export default function DataEntry(props: {
	form: FormSchema;
	formID?: string;
	inputComponent?: any;
}) {
	return <Form>
		<FormIDContext.Provider value={props.formID ?? ''}>
			<ListGroup variant="flush">
				{ props.form.sections.map((section, i) => <ListGroup.Item key={i}><FormSection inputComponent={props.inputComponent ?? FormInput} section={section}></FormSection></ListGroup.Item>) }
			</ListGroup>
		</FormIDContext.Provider>
	</Form>;
}
