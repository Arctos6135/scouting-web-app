import FormSchema from '../../shared/dataClasses/FormClass';
import * as React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { FormIDContext, forms } from './formState';
import { FormSection } from './FormSection';

export { forms };

export default function DataEntry(props: {
	form: FormSchema;
	formID?: string;
	inputComponent?: any;
}) {

	return <Form>
		<FormIDContext.Provider value={props.formID ?? ''}>
			<ListGroup variant="flush">
				{props.form.sections.map((section, i) =>
					<ListGroup.Item key={i}>
						<FormSection section={section} inputComponent={props.inputComponent}/>
					</ListGroup.Item>
				)}
			</ListGroup>
		</FormIDContext.Provider>
	</Form>;
}
