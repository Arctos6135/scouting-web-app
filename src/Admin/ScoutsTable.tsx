import * as React from 'react';
import {useState} from 'react';
import { Button, CloseButton, Form, Table } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import ScoutClass from '../../shared/dataClasses/ScoutClass';
import * as conn from '../connection';
import { DeleteModal } from './DeleteModal';
import { UpdatePasswordModal } from './UpdatePasswordModal';

export function ScoutsTable() {
	const selfScout = useRecoilValue(conn.scout);
	const scouts = useRecoilValue(conn.scouts);
	const [updatingPassword, setUpdatingPassword] = useState<ScoutClass>(null);
	const [deletingScout, setDeletingScout] = useState<ScoutClass>(null);

	const setAdmin = (scout: ScoutClass, admin: boolean) => {
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
					<th className='text-truncate'>Connections</th>
					<th>Admin</th>
				</tr>
			</thead>
			<tbody>
				{scouts.map(scout => <tr className={scout.login == selfScout.login ? 'table-primary' : ''} key={scout.name}>
					<td className='text-truncate'>{scout.name}</td>
					<td className='text-truncate'>{scout.login}</td>
					<td className='text-truncate'>{scout.connections}</td>
					<td className='text-truncate'><Form.Check onClick={() => setAdmin(scout, !scout.admin)} type='switch' defaultChecked={scout.admin} disabled={scout.login == selfScout.login} /></td>
					<td><Button size="sm" onClick={() => setUpdatingPassword(scout)} variant='outline-primary'>Update password</Button></td>
					<td><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.login == selfScout.login} /></td>
				</tr>)}
			</tbody>
		</Table>
	</>;
}
