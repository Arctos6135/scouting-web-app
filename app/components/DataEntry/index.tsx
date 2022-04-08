import FormSchema from 'shared/dataClasses/FormClass';
import * as React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { FormIDContext, FormErrorsContext } from './formState';
import { FormSection } from './FormSection';

export default function DataEntry(props: {
	form: FormSchema;
	formID?: string;
	inputComponent?: any;
	setValid?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});

	React.useEffect(() => {
		let isInvalid = false;
		for (const error in errors) {
			isInvalid = errors[error] || isInvalid;
		}
		console.log(isInvalid);
		props.setValid?.(!isInvalid);
	}, [errors]);

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
	</Form>;
}
