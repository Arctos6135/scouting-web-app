/* eslint-disable react/prop-types */
import * as React from 'react';
import DataEntry from '../DataEntry';
import FormClass, { Section } from '../../formSchema/Form';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

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

function RowBuilder(props: any) {
    return <></>
}
function GroupBuilder(props: any) {
    return <></>
}
function SectionBuilder(props: { index: number; form: FormClass; setForm: (param: FormClass) => any; onChange: (param: FormClass) => any }) {
    const [section, setSection] = useState(props.form.sections[props.index]);
    return <>
        <Form.Group>
            <Form.Label>Optional Header</Form.Label>
            <Form.Control value={section.header} onChange={(e) => {
                section.header = e.target.value;
                setSection(section);
                props.form.sections[props.index] = section;
                props.setForm(props.form);
                props.onChange(props.form);
            }} />
        </Form.Group>
        {section.groups.map((group) => {
            switch (group.type) {
                case "row":

                    return <RowBuilder />;
                case "group":
                    return <GroupBuilder />
                default:
                    break;
            }
        })}
    </>
}

export default function FormBuilder(props: { form: FormClass; onChange: (param: FormClass) => any }) {
    const [formJSON, setFormJSON] = useState(JSON.stringify(props.form, null, 4));
    const [form, setForm] = useState(props.form)

    return <Container className='h-100'>
        <Row className='h-100'>
            <Col>
                <ErrorBoundary>
                    <DataEntry form={props.form}></DataEntry>
                </ErrorBoundary>
            </Col>
            <Col>
                <Form.Group>
                    <Form.Label className="">Form Name</Form.Label>
                    <Form.Control value={form.name} onChange={(e) => {
                        form.name = e.target.value;
                        setForm(form)
                        props.onChange(form);
                    }} />
                </Form.Group>
                <div className='mb-3'>
                    {form.sections.map((section, index) => <SectionBuilder key={index} index={index} form={form} setForm={setForm} onChange={props.onChange} />)}
                </div><Button onClick={() => {
                    form.sections.push({ type: "section", groups: [] });
                    setForm(form);
                    props.onChange(form);
                }
                }>Add Section</Button>
                {/*             <Form.Control className='h-100' as="textarea" value={formJSON} onChange={(e) => {
                const newText = e.target.value;
                setFormJSON(newText);
                try {
                    const obj = JSON.parse(newText);
                    console.log(obj);
                    props.onChange(obj);
                }
                catch (e) {
                    console.log(e);

                }
            }}/> */}
            </Col>
        </Row>
    </Container>

}