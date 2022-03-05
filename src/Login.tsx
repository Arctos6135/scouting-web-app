import * as React from 'react';
import {useEffect, useState} from 'react';
import * as conn from './connection';
import {Form, Button, Container} from 'react-bootstrap';
import {useRecoilValue} from 'recoil';
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [failedLogin, setFailedLogin] = useState<boolean>(false);
	const [unverified, setUnverified] = useState<boolean>(false);
	const loggedIn = useRecoilValue(conn.signedIn);
	const scout = useRecoilValue(conn.scout);
	const navigate = useNavigate();
	const org = (new URLSearchParams(window.location.search)).get('orgID')?.replace(' ', '+');
	const onSubmit = (e) => {
		conn.socket.emit('login', { login: e.target?.email?.value, password: e.target?.password?.value, org });

		e.preventDefault();
		return false;
	};
	useEffect(() => {
		const listen = () => {
			setFailedLogin(true);
		}
		conn.socket.on('login:failed', listen);
		return () => {
			conn.socket.off('login:failed', listen);
		}
	});
	useEffect(() => {
		const listen = () => {
			setUnverified(true);
		}
		conn.socket.on('login:unverified', listen);
		return () => {
			conn.socket.off('login:unverified', listen);
		}
	});
	useEffect(() => {
		if (loggedIn) {
			navigate("/home", {replace: true});
		}
	}, [loggedIn]);


	return (<Container>
		{!org ? <h3>Are you looking to log in as a scout? Ask your organization for a link.</h3> : <></>}
		{failedLogin ? (<h3 style={{color: "red"}}>Failed login, please try again</h3>) : ""}
		{unverified ? (<h3 style={{color: "red"}}>This account has not been verified yet. Please check your email.</h3>) : ""}
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label htmlFor="emailInput">Email</Form.Label>
				<Form.Control type="text" id="emailInput" name="email"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label htmlFor="passwordInput">Password</Form.Label>
				<Form.Control type="password" id="passwordInput" name="password"></Form.Control>
			</Form.Group>
			<Button type="submit">Submit</Button>
		</Form>
	</Container>)
}
