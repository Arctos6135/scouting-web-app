import * as React from 'react';
import {useEffect, useState} from 'react';
import * as conn from 'app/connection';
import {Form, Button, Container, Card, Alert} from 'react-bootstrap';

export default function RegisterPage() {
	const [emailTaken, setEmailTaken] = useState<boolean>(false);
	const [failed, setFailed] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const onSubmit = (e) => {
		conn.socket.emit('register', {email: e.target?.email?.value, password: e.target?.password?.value, name: e.target?.team?.value});
		e.preventDefault();
		return false;
	};
	useEffect(() => {
		const listen = () => {
			setEmailTaken(true);
			setFailed(false);
		};
		conn.socket.on('register:email taken', listen);
		return () => {
			conn.socket.off('register:email taken', listen);
		};
	});

	useEffect(() => {
		const listen = () => {
			setFailed(true);
			setEmailTaken(false);
		};
		conn.socket.on('register:failed', listen);
		return () => {
			conn.socket.off('register:failed', listen);
		};
	});

	useEffect(() => {
		const listen = () => {
			setSuccess(true);
			setFailed(false);
			setEmailTaken(false);
		};
		conn.socket.on('register', listen);
		return () => {
			conn.socket.off('register', listen);
		};
	});

	return (<Container>
		<Alert variant='danger' dismissible show={emailTaken} onClose={() => setEmailTaken(false)}>
			<Alert.Heading>That email is taken, please try again</Alert.Heading>
		</Alert>
		<Alert variant='danger' dismissible show={failed} onClose={() => setFailed(false)}>
			<Alert.Heading>Email or password is invalid</Alert.Heading>
		</Alert>
		<Alert variant='success' dismissible show={success} onClose={() => setSuccess(false)}>
			<Alert.Heading>An email has been sent to that address</Alert.Heading>
		</Alert>
		<Card>
			<Form onSubmit={onSubmit}>
				<Card.Header>
					<Card.Title>Register a new team</Card.Title>
				</Card.Header>
				<Card.Body>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="nameInput">Team Name</Form.Label>
						<Form.Control type="text" id="nameInput" name="team"></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="emailInput">Email</Form.Label>
						<Form.Control type="text" id="emailInput" name="email"></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="passwordInput">Password</Form.Label>
						<Form.Control type="password" id="passwordInput" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="repeatPasswordInput">Repeat Password</Form.Label>
						<Form.Control type="password" id="repeatPasswordInput" value={password2} onChange={(e) => setPassword2(e.target.value)}></Form.Control>
					</Form.Group>
				</Card.Body>
				<Card.Footer>
					<Button type="submit" disabled={password != password2}>Submit</Button>
				</Card.Footer>
			</Form>

		</Card>
	</Container>);
}

