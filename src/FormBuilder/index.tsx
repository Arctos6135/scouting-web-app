/* eslint-disable react/prop-types */
import * as React from 'react';
import DataEntry from '../DataEntry';
import {
	Button,
	Col,
	Container,
	Form,
	Row,
	Spinner,
	Tab,
	Tabs,
} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { FormBuilderProps, OnChangeParams } from './types';
import SectionBuilder from './SectionBuilder';
import FormClass, { Row as RowType } from '../../shared/dataClasses/FormClass';

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
	const [form, setForm] = useState<FormClass>(undefined);
	useEffect(() => setForm(JSON.parse(JSON.stringify(props.form))), [props.form]);
	const onChange = React.useCallback((params: OnChangeParams) => {
		setForm((form) => {
			switch (params.type) {
			case ('group'): {
				if (typeof params.indices.rowIndex === 'number') {
					(
							form.sections[params.indices.sectionIndex].groups[params.indices.rowIndex] as RowType
					).components[params.indices.index] = params.update;
				} else {
					form.sections[params.indices.sectionIndex].groups[params.indices.index] = params.update;
				}
				break;
			}
			case ('section'): {
				form.sections[params.indices.index] = params.update;
				break;
			}
			case ('row'): {
				form.sections[params.indices.sectionIndex].groups[params.indices.index] = params.update;
				break;
			}
			default: break;
			}
			const updateForm = Object.assign({}, form);
			props.onChange(updateForm);
			return updateForm;
		});
	}, []);
	
	if (!form || Object.keys(form).length === 0) {
		return <Spinner animation="grow" />;
	}

	return (
		<Container className="h-100">
			<Row className="h-100">
				<Col>
					<ErrorBoundary>
						<DataEntry form={form}></DataEntry>
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
								<Button onClick={() => {
									form.sections.splice(index, 1);
									setForm(form);
									props.onChange(form);
								}}>Delete {section.header ? section.header : `Section ${index + 1}`}</Button>
								<SectionBuilder
									index={index}
									onChange={onChange}
									section={section}
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
		</Container >
	);
}
