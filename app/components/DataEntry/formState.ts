import * as React from 'react';
import { atomFamily, selectorFamily } from 'recoil';

// Context that stores the id of a form
// Inputs for that form use this to know where to store their values
export const FormIDContext = React.createContext('');
// Contains all the forms' data in an object. Used to sync with database

export let forms = {};
if (localStorage.getItem('formData'))
	forms = JSON.parse(localStorage.getItem('formData'));
// Atom family that stores values for every form input
const formDataAtom = atomFamily({
	key: 'formDataAtom',
	default: (id: string) => forms[id.split('/')[0]]?.[id.split('/')[1]],
});
export const formData = selectorFamily<string | number, string>({
	key: 'formData',
	get: (id) => ({ get }) => {
		const atom = get(formDataAtom(id));
		return atom;
	},
	set: (id) => ({ set }, value) => {
		set(formDataAtom(id), value);
		const [formName, propName] = id.split('/');
		if (!forms[formName])
			forms[formName] = {};
		forms[formName][propName] = value;
		// Don't save to local storage if form name is blank
		if (formName != '')
			localStorage.setItem('formData', JSON.stringify(forms));
	}
});
