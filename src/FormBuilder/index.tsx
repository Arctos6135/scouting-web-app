/* eslint-disable react/prop-types */
import * as React from 'react';
import DataEntry from '../DataEntry';
import {Button, Col, Container, Form, Row, Spinner, Tab, Tabs} from 'react-bootstrap';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { editingForm } from './helpers';
import { FormBuilderProps} from './propTypes';
import SectionBuilder from './SectionBuilder';



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

export default function FormBuilder(props: FormBuilderProps) {
	const [form, setForm] = useRecoilState(editingForm);
	useEffect(() => setForm(props.form), [props.form]);
	if (!form || Object.keys(form).length === 0) {
		return <Spinner animation="grow" />;
	}
	return (
		<Container className="h-100">
			<Row className="h-100">
				<Col>
					<ErrorBoundary>
						<DataEntry form={props.form}></DataEntry>
					</ErrorBoundary>
				</Col>
				<Col>
					<Form.Group className="pb-3">
						<Form.Label className="fw-bold fs-3">Form Name</Form.Label>
						<Form.Control
							value={form.name}
							onChange={(e) => {
								form.name = e.target.value;
								setForm(form);
								props.onChange(form);
							}}
						/>
					</Form.Group>
					<Tabs defaultActiveKey="0" className="mb-3">
						{form.sections.map((section, index) => (
							<Tab
								eventKey={`${index}`}
								title={section.header ? section.header : `Section ${index + 1}`}
								key={index}
							>
								<SectionBuilder
									index={index}
									onChange={props.onChange}
									className="mb-2"
								/>
							</Tab>
						))}
					</Tabs>
					<Button
						onClick={() => {
							form.sections.push({ type: 'section', groups: [] });
							setForm(form);
							props.onChange(form);
						}}
					>
						Add Section
					</Button>
				</Col>
			</Row>
		</Container>
	);
}
