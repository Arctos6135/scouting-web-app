import * as React from 'react';
import {useEffect, useState} from 'react';
import * as conn from './connection';
import {Form, Button, Container, Card, Alert} from 'react-bootstrap';
import {useRecoilValue} from 'recoil';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const [failedLogin, setFailedLogin] = useState<boolean>(false);
	const [unverified, setUnverified] = useState<boolean>(false);
	const loggedIn = useRecoilValue(conn.signedIn);
	const scout = useRecoilValue(conn.scout);
	const navigate = useNavigate();
	const org = (new URLSearchParams(window.location.search)).get('orgID')?.replace(' ', '+');
	const onSubmit = (e) => {
		conn.socket.emit('login', { login: e.target?.email?.value as string | undefined, password: e.target?.password?.value as string | undefined, org });

		e.preventDefault();
		return false;
	};
	useEffect(() => {
		const listen = () => {
			setFailedLogin(true);
		};
		conn.socket.on('login:failed', listen);
		return () => {
			conn.socket.off('login:failed', listen);
		};
	});
	useEffect(() => {
		const listen = () => {
			setUnverified(true);
		};
		conn.socket.on('login:unverified', listen);
		return () => {
			conn.socket.off('login:unverified', listen);
		};
	});
	useEffect(() => {
		if (loggedIn) {
			navigate('/home', {replace: true});
		}
	}, [loggedIn]);


	return (<Container>
		<Alert variant='danger' dismissible show={failedLogin} onClose={() => setFailedLogin(false)}>
			<Alert.Heading>Failed login, please try again</Alert.Heading>
		</Alert>
		<Alert variant='danger' dismissible show={unverified} onClose={() => setUnverified(false)}>
			<Alert.Heading>This account has not been verified yet. Please check your email.</Alert.Heading>
		</Alert>
		<Card>
			<Form onSubmit={(e) => onSubmit(e)}>
				<Card.Header>
					<Card.Title>Login</Card.Title>
					{!org ? <Card.Subtitle>Are you looking to log in as a scout? Ask your organization for a link.</Card.Subtitle> : <></>}
				</Card.Header>
				<Card.Body>
					<Form.Group className="mb-3" >
						<Form.Label htmlFor="emailInput">Email</Form.Label>
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
