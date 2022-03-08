import { prop, Ref } from '@typegoose/typegoose';
import { Scout } from '../../backend/db/models/Scouting';
import GameClass from './GameClass';

export default class AssignmentClass {
	@prop() game: Ref<GameClass>;
	@prop() scout: Ref<Scout>;
}