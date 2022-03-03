import * as React from 'react';
import {useEffect, useState} from 'react';
import * as conn from './connection';
import {Form, Button, Container} from 'react-bootstrap';

export default function RegisterPage() {
	const [emailTaken, setEmailTaken] = useState<boolean>(false);
	const [failed, setFailed] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [password, setPassword] = useState<string>('');
	const [password2, setPassword2] = useState<string>('');
	const onSubmit = (e) => {
		conn.socket.emit('register', {email: e.target?.email?.value, password: e.target?.password?.value});
		e.preventDefault();
		return false;
	};
	useEffect(() => {
		const listen = () => {
			setEmailTaken(true);
			setFailed(false);
		}
		conn.socket.on('register:email taken', listen);
		return () => {
			conn.socket.off('register:email taken', listen);
		}
	});

	useEffect(() => {
		const listen = () => {
			setFailed(true);
			setEmailTaken(false);
		}
		conn.socket.on('register:failed', listen);
		return () => {
			conn.socket.off('register:failed', listen);
		}
	});

	useEffect(() => {
		const listen = () => {
			setSuccess(true);
			setFailed(false);
			setEmailTaken(false);
		}
		conn.socket.on('register', listen);
		return () => {
			conn.socket.off('register', listen);
		}
	});

	return (<Container>
		{emailTaken ? (<h3 style={{color: "red"}}>That email is taken, please try again</h3>) : ""}
		{failed ? (<h3 style={{color: "red"}}>Email or password is invalid</h3>) : ""}
		{success ? (<h3>An email has been sent to this address.</h3>) : ""}
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label htmlFor="emailInput">Email</Form.Label>
				<Form.Control type="text" id="emailInput" name="email"></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label htmlFor="passwordInput">Password</Form.Label>
				<Form.Control type="password" id="passwordInput" name="password" value={password} onChange={(e)=>setPassword(e.target.value)}></Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label htmlFor="repeatPasswordInput">Repeat Password</Form.Label>
				<Form.Control type="password" id="repeatPasswordInput" value={password2} onChange={(e)=>setPassword2(e.target.value)}></Form.Control>
			</Form.Group>
			<Button type="submit" disabled={password!=password2}>Submit</Button>
		</Form>
	</Container>)
}

