import FormSchema from '../../shared/dataClasses/FormClass';
import * as React from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import { FormIDContext, forms, FormErrorsContext } from './formState';
import { FormSection } from './FormSection';
import { useForm } from 'react-hook-form';

export { forms };

export default function DataEntry(props: {
	form: FormSchema;
	formID?: string;
	inputComponent?: any;
	onSubmit?: () => void;
}) {
	const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});
	const handleSubmit = (f: () => void) => {
		let isInvalid = false;
		for (const error in errors) {
			isInvalid = errors[error] || isInvalid;
		}
		if (!isInvalid) {
			f();
		}
	};
	return <Form>
		<FormIDContext.Provider value={props.formID ?? ''}>
			<FormErrorsContext.Provider value={{ errors: errors, setErrors: setErrors }}>
				<ListGroup variant="flush">
					{props.form.sections.map((section, i) =>
						<ListGroup.Item key={i}>
							<FormSection section={section} inputComponent={props.inputComponent} />
						</ListGroup.Item>
					)}
				</ListGroup>
			</FormErrorsContext.Provider>
		</FormIDContext.Provider>
		<Button onClick={() => handleSubmit(props.onSubmit)}>Submit</Button>
	</Form>;
}
