import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import LoginPage from './Login';
import Nav from './Nav';
import { RecoilRoot, useRecoilValue } from 'recoil';
import SocketConnection from './connection';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import RegisterPage from './Register';
import AdminPage from './Admin';
import * as conn from './connection';
import './styles.css';
import FormsList from './FormsList';
import { Workbox } from 'workbox-window';

function App() {
	return (<div>
		<Container><FormsList /></Container>
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

if ('serviceWorker' in navigator) {
	const wb = new Workbox('/sw.js');
	wb.register();
}
