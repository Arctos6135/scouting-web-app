import * as React from 'react';
import {useState} from 'react';
import { Button, CloseButton, Table } from 'react-bootstrap';
import { Scout } from 'shared/dataClasses/Scout';
import DeleteModal from 'app/components/DeleteModal';
import { UpdatePasswordModal } from './UpdatePasswordModal';
import { ControlledSwitch } from 'app/components/ControlledSwitch';
import { useSelector } from 'app/hooks';
//import { updateAdmin, deleteScout, updatePassword } from 'app/store/reducers/admin';
import _ from 'lodash';
import { socket } from '../../store';

export function ScoutsTable() {
	const selfScout = useSelector(state => state.user.scout, _.isEqual);
	const scouts = useSelector(state => state.admin.scouts, _.isEqual);
	const [updatingPassword, setUpdatingPassword] = useState<Scout | null>(null);
	const [deletingScout, setDeletingScout] = useState<Scout | null>(null);

	return <>
		<DeleteModal bodyText={`All information related to this scout will be deleted. Username: ${deletingScout?.name}`} show={!!deletingScout} onClose={(del) => {
			if (del && deletingScout)
				//dispatch(deleteScout(deletingScout.login));
				socket.emit('team:delete scout', deletingScout.login);
			setDeletingScout(null);
		}} />

		<UpdatePasswordModal show={!!updatingPassword} onClose={(result) => {
			if (result.update && updatingPassword?.login)
				socket.emit('team:update password', { login: updatingPassword.login, newPassword: result.newPassword });
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
				{scouts.map(scout => <tr className={scout.login == selfScout?.login ? 'table-primary' : ''} key={scout.name}>
					<td className='text-truncate'>{scout.name}</td>
					<td className='text-truncate'>{scout.login}</td>
					<td className='text-truncate'>
						<ControlledSwitch onChange={val => socket.emit('team:set admin', {scout: scout, admin: val})} type='switch' value={scout.admin} disabled={scout.login == selfScout?.login} key={`${scout.login}-admin-switch`}/>
					</td>
					<td><Button size="sm" onClick={() => setUpdatingPassword(scout)} variant='outline-primary'>Update password</Button></td>
					<td><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.login == selfScout?.login} /></td>
				</tr>)}
			</tbody>
		</Table>
	</>;
}
