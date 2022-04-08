import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import LoginPage from './pages/Login';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterPage from './pages/Register';
import AdminPage from './pages/Admin';
import './styles.css';
import { Workbox } from 'workbox-window';
import ResponsesPage from './pages/Responses';
import {Provider} from 'react-redux';
import {store} from './store';
import {useSelector} from './hooks';

function Routing() {
	const admin = useSelector(state => state.user.scout?.admin ?? false);
	return <Routes>
		<Route path="/" element={<ResponsesPage/>}/>
		<Route path="/home" element={<ResponsesPage/>}/>
		<Route path="/login" element={<LoginPage/>}/>
		<Route path="/register" element={<RegisterPage/>}/>
		<Route path="/admin" element={admin ? <AdminPage/> : <LoginPage/>}/>
	</Routes>;
}

ReactDOM.render((<React.StrictMode><Provider store={store}>
	<BrowserRouter>
		<Nav/>
		<br/>
		<Routing/>
	</BrowserRouter>
</Provider></React.StrictMode>), document.getElementById('root'));

if ('serviceWorker' in navigator) {
	const wb = new Workbox('/sw.js');
	wb.register();
}
