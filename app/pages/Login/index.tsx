import * as React from 'react';
import {useEffect, useState} from 'react';
import {Form, Button, Container, Card, Alert} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'app/hooks';
import { socket } from 'app/store';
import { closeAlert } from 'app/store/reducers/alerts';

export default function LoginPage() {
	const loggedIn = useSelector(state => !!state.user.scout);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const org = (new URLSearchParams(window.location.search)).get('orgID')?.replace?.(/ /g, '+');
	const alerts = useSelector(state => state.alerts['login'] ?? []);
	const onSubmit = (e) => {
		socket.emit('login', { login: e.target?.email?.value as string | undefined, password: e.target?.password?.value as string | undefined, org });

		e.preventDefault();
		return false;
	};
	useEffect(() => {
		if (loggedIn) {
			navigate('/home', {replace: true});
		}
	}, [loggedIn]);


	return (<Container>
		{alerts.map(alert =>
			<Alert variant={alert.type} key={alert.id} dismissible onClose={() => dispatch(closeAlert(alert))}>
				<Alert.Heading>{alert}</Alert.Heading>
			</Alert>
		)};
		<Card>
			<Form onSubmit={(e) => onSubmit(e)}>
				<Card.Header>
					<Card.Title>Login</Card.Title>
					{!org ? <Card.Subtitle>Are you looking to log in as a scout? Ask your organization for a link.</Card.Subtitle> : <></>}
				</Card.Header>
				<Card.Body>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="emailInput">Login</Form.Label>
						<Form.Control type="text" id="emailInput" name="email"></Form.Control>
					</Form.Group>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="passwordInput">Password</Form.Label>
						<Form.Control type="password" id="passwordInput" name="password"></Form.Control>
					</Form.Group>
				</Card.Body>
				<Card.Footer>
					<Button type="submit">Submit</Button>
				</Card.Footer>
			</Form>
		</Card>
	</Container>);
}
