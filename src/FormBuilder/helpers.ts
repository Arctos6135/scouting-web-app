import Num from '../../formSchema/Number';
import Picker from '../../formSchema/Picker';
import Text from '../../formSchema/Text';
import FormComponent from '../../formSchema/FormComponent';
import { atom } from 'recoil';
import FormClass from '../../formSchema/Form';

export const editingForm = atom<FormClass>({
	key: 'editingForm',
	default: {} as FormClass,
	dangerouslyAllowMutability: true,
});

export type Component = Num | Picker | Text;

export const options = ['num', 'text', 'picker'];

export const createComponent = (
	component: FormComponent,
	newType: 'num' | 'text' | 'picker'
): Component => {
	const newComponent = { type: newType, valueID: component.valueID };
	switch (newComponent.type) {
	case 'num':
		return { min: 0, max: 10, ...newComponent } as Component;
	case 'text':
		return { ...newComponent } as Component;
	case 'picker':
		return { options: [], ...newComponent } as Component;
	default:
		break;
	}
};
