/* eslint-disable react/prop-types */
import * as React from 'react';
import DataEntry from '../DataEntry';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import FormClass from '../../shared/dataClasses/FormClass';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
	}
    
	componentDidCatch(error, errorInfo) {
		console.log(error, errorInfo);
	}
	render() {
		return this.props.children;
	}
}

export default function FormBuilder(props: { form: FormClass; onChange: (param: FormClass) => any }) {
	const [formJSON, setFormJSON] = useState(JSON.stringify(props.form, null, 4));

	return <Container className='h-100'>
		<Row className='h-100'>
			<Col>
				<ErrorBoundary>
					<DataEntry form={props.form}></DataEntry>
				</ErrorBoundary>
			</Col>
			<Col>
				<Form.Control className='h-100' as="textarea" value={formJSON} onChange={(e) => {
					const newText = e.target.value;
					setFormJSON(newText);
					try {
						const obj = JSON.parse(newText);
						props.onChange(obj);
					}
					catch (e) {
						console.log(e);

					}
				}}/>
			</Col>
		</Row>
	</Container>;

}