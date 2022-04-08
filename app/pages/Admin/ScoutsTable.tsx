import * as React from 'react';
import {useState} from 'react';
import { Button, CloseButton, Table } from 'react-bootstrap';
import ScoutClass from 'shared/dataClasses/ScoutClass';
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
	const [updatingPassword, setUpdatingPassword] = useState<ScoutClass>(null);
	const [deletingScout, setDeletingScout] = useState<ScoutClass>(null);

	return <>
		<DeleteModal bodyText={`All information related to this scout will be deleted. Username: ${deletingScout?.name}`} show={!!deletingScout} onClose={(del) => {
			if (del)
				//dispatch(deleteScout(deletingScout.login));
				socket.emit('organization:delete scout', deletingScout.login);
			setDeletingScout(null);
		}} />

		<UpdatePasswordModal show={!!updatingPassword} onClose={(result) => {
			if (result.update)
				socket.emit('organization:update password', { login: updatingPassword.login, newPassword: result.newPassword });
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
						<ControlledSwitch onChange={val => socket.emit('organization:set admin', {scout: scout, admin: val})} type='switch' checked={scout.admin} disabled={scout.login == selfScout.login} key={`${scout.login}-admin-switch`}/>
					</td>
					<td><Button size="sm" onClick={() => setUpdatingPassword(scout)} variant='outline-primary'>Update password</Button></td>
					<td><CloseButton onClick={() => setDeletingScout(scout)} disabled={scout.login == selfScout.login} /></td>
				</tr>)}
			</tbody>
		</Table>
	</>;
}
