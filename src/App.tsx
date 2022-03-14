import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Link } from 'react-router-dom';
import { Route, Router, Navigate, Routes } from 'react-router';
import LoginPage from './Login';
import Nav from './Nav';
import { atom, RecoilRoot, useRecoilValue } from 'recoil';
import SocketConnection from './connection';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import RegisterPage from './Register';
import AdminPage from './Admin';
import * as conn from './connection';
import DataEntry from './DataEntry';
import Text from '../shared/dataClasses/FormClass/Text';
import './styles.css';
import AssignmentsList from './AssignmentsList';

function App() {
	return (<div>
		<Container><AssignmentsList /></Container>
	</div>
	);
}

function Routing() {
	const scout = useRecoilValue(conn.scout);
	return <Routes>
		<Route path="/" element={<App/>}/>
		<Route path="/home" element={<App/>}/>
		<Route path="/login" element={<LoginPage/>}/>
		<Route path="/register" element={<RegisterPage/>}/>
		<Route path="/admin" element={scout?.admin ? <AdminPage/> : <LoginPage/>}/>
	</Routes>;
}

ReactDOM.render((<React.StrictMode><RecoilRoot>
	<BrowserRouter>
		<Nav/>
		<br/>
		<Routing/>
	</BrowserRouter>
	<SocketConnection />
</RecoilRoot></React.StrictMode>), document.getElementById('root'));
