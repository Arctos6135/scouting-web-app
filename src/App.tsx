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
import Text from '../formSchema/Text';
import './styles.css';

function App() {
	return (<div>
		<h1>Scouting app</h1>
		<DataEntry formID='abc' form={{ 
			ownerOrg: "abdfc", 
			name: "test", 
			id: 'dfijoefpaosidjf',
			sections: [
				{
					type: 'section',
					groups: [
						{component: { type: 'text', valueID: 'test1' }, label: "Test", description: "test", type: 'group'}, 
						{component: { type: 'text', valueID: 'test2' }, label: "Test 2", type: 'group'},
						{component: { type: 'picker', options: ['a', 'b', 'c'], default: 'b', valueID: 'pick' }, label: 'Picker test', type: 'group' }
					], 
					header: "Hello"
				},
				{
					type: 'section',
					header: "Hello",
					groups: [
						{components: [{ component: {type: 'text', valueID: 'test3'}, label: 'test3', type:'group' }, { component: {type: 'text', valueID: 'test4'}, type:'group', label: 'test4', description: 'description in row looks like this' }], type: 'row'}, 
						{component: { type: 'num', valueID: 'numberInput', min: 0, max: 100 }, label: "Test 2", type: 'group'},

					]
				}
			]
		}}></DataEntry>
	</div>
	)
}

function Routing() {
	const scout = useRecoilValue(conn.scout);
	return <Routes>
		<Route path="/" element={<App/>}/>
		<Route path="/login" element={<LoginPage/>}/>
		<Route path="/register" element={<RegisterPage/>}/>
		<Route path="/admin" element={scout?.admin ? <AdminPage/> : <LoginPage/>}/>
	</Routes>
}

ReactDOM.render((<RecoilRoot>
	<BrowserRouter>
		<Nav/>
		<br/>
		<Routing/>
	</BrowserRouter>
	<SocketConnection />
</RecoilRoot>), document.getElementById('root'));
