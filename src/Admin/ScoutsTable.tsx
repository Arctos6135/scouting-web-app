import * as React from 'react';
import {useState} from 'react';
import { Button, CloseButton, Form, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import ScoutClass from '../../shared/dataClasses/ScoutClass';
import * as conn from '../connection';
import { DeleteModal } from './DeleteModal';
import { UpdatePasswordModal } from './UpdatePasswordModal';
import { ControlledSwitch } from '../Components/ControlledSwitch';

export function ScoutsTable() {
	const selfScout = useRecoilValue(conn.scout);
	const scouts = useRecoilValue(conn.scouts);
	const [updatingPassword, setUpdatingPassword] = useState<ScoutClass>(null);
	const [deletingScout, setDeletingScout] = useState<ScoutClass>(null);

	const setAdmin = (scout: ScoutClass, admin: boolean) => {
		conn.socket.emit('organization:set admin', { scout, admin });
		// TODO: implement
	};

	return <>
		<DeleteModal bodyText={`All information related to this scout will be deleted. Username: ${deletingScout?.name}`} show={!!deletingScout} onClose={(del) => {
			if (del)
				conn.socket.emit('organization:delete scout', deletingScout.login);
			setDeletingScout(null);
		}} />

		<UpdatePasswordModal show={!!updatingPassword} onClose={(result) => {
			if (result.update)
				conn.socket.emit('organization:update password', { login: updatingPassword.login, newPassword: result.newPassword });
			setUpdatingPassword(null);
		}} />

		<Table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Login</th>
					<th>Admin</th>
				</tr>
			</thead>
			<tbody>
				{scouts.map(scout => <tr className={scout.login == selfScout.login ? 'table-primary' : ''} key={scout.name}>
					<td className='text-truncate'>{scout.name}</td>
					<td className='text-truncate'>{scout.login}</td>
					<td className='text-truncate'>
						<ControlledSwitch onChange={val => setAdmin(scout, val)} type='switch' checked={scout.admin} disabled={scout.login == selfScout.login} key={`${scout.login}-admin-switch`}/>
					</td>
					<td><Button size="sm" onClick={() => setUpdatingPassword(scout)} variant='outline-primary'>Update password</Button></td>
					<td><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.login == selfScout.login} /></td>
				</tr>)}
			</tbody>
		</Table>
	</>;
}
