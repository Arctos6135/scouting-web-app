import * as React from 'react';
import {useEffect, useState} from 'react';
import {Form, Button, Container, Card, Alert} from 'react-bootstrap';
import { useSelector, useSocketEffect, useDispatch } from 'app/hooks';

import { closeAlert } from 'app/store/reducers/alerts';

import { socket } from 'app/store';

export default function RegisterPage() {
	const [success, setSuccess] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const dispatch = useDispatch();

	const alerts = useSelector(state => state.alerts['register'] ?? []);

	const onSubmit = (e) => {
		socket.emit('register', {email: e.target?.email?.value, password: e.target?.password?.value, name: e.target?.team?.value});
		e.preventDefault();
		return false;
	};

	useSocketEffect('register', registered => {
		setSuccess(registered);
	});

	return (<Container>
		{alerts.map(alert =>
			<Alert variant={alert.type} key={alert.id} dismissible onClose={() => dispatch(closeAlert(alert))}>
				<Alert.Heading>{alert}</Alert.Heading>
			</Alert>
		)});
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

