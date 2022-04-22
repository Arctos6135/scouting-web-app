import { Group, Row, Section, Component, formTypeMap } from 'shared/dataClasses/Form';
import { Num } from 'shared/dataClasses/Form/Number';
import { Picker } from 'shared/dataClasses/Form/Picker';
import { Text } from 'shared/dataClasses/Form/Text';
import { Toggle } from 'shared/dataClasses/Form/Toggle';
import { Timer } from 'shared/dataClasses/Form/Timer';
import { SectionBuilderProps, RowBuilderProps, GroupBuilderProps } from './types';

export const createComponent = (
	component: { valueID: string, type: keyof typeof formTypeMap },
	newType: keyof typeof formTypeMap
): Component => {
	const newComponent = { type: newType, valueID: component.valueID };
	switch (newComponent.type) {
	case 'num':
		return Num.parse({ min: 0, max: 10, ...newComponent });
	case 'text':
		return Text.parse({ ...newComponent });
	case 'picker':
		return Picker.parse({ options: [], ...newComponent });
	case 'timer':
		return Timer.parse({ ...newComponent });
	case 'toggle':
		return Toggle.parse({ ...newComponent, falseLabel: 'No', trueLabel: 'Yes' });
	default:
		break;
	}
	return {...newComponent} as Component;
};

function objectEqual<T extends object>(prevObject: T, nextObject: T, predicate: (key: string) => boolean) {
	for (const key in prevObject) {
		if (predicate(key)) {
			continue;
		}
		if (prevObject[key] !== nextObject[key]) {
			return false;
		}
	}
	return true;
}

const groupsAreEqual = (prevGroup: Group, nextGroup: Group) => {

	if (!objectEqual<typeof prevGroup>(prevGroup, nextGroup, (key) => key === 'component')) {
		return false;
	}
	if (!objectEqual<typeof prevGroup.component>(prevGroup.component, nextGroup.component, () => false)) {
		return false;
	}
	return true;
};

export const groupsPropsAreEqual = (prevProps: Readonly<GroupBuilderProps>, nextProps: Readonly<GroupBuilderProps>) => {
	if (!objectEqual<GroupBuilderProps>(prevProps, nextProps, (key) => key === 'group')) {
		return false;
	}
	if (!groupsAreEqual(prevProps.group, nextProps.group)) {
		return false;
	}
	return true;
};

const rowsAreEqual = (prevRow: Row, nextRow: Row) => {

	for (let index = 0; index < prevRow.components.length; index++) {
		if (!(index < nextRow.components.length)) {
			continue;
		}
		if (!(groupsAreEqual(prevRow.components[index], nextRow.components[index]))) {
			return false;
		}

	}
	return true;
};

export const rowsPropsAreEqual = (prevProps: Readonly<RowBuilderProps>, nextProps: Readonly<RowBuilderProps>) => {
	if (!objectEqual<RowBuilderProps>(prevProps, nextProps, (key) => key === 'row')) {
		return false;
	}
	if (!rowsAreEqual(prevProps.row, nextProps.row)) {
		return false;
	}
	return true;
};



export const sectionsPropsAreEqual = (prevProps: Readonly<SectionBuilderProps>, nextProps: Readonly<SectionBuilderProps>) => {
	if (!objectEqual<SectionBuilderProps>(prevProps, nextProps, (key) => key === 'section')) {
		return false;
	}
	if (!objectEqual<Section>(prevProps.section, nextProps.section, (key) => key === 'groups')) {
		return false;
	}
	for (let index = 0; index < prevProps.section.groups.length; index++) {
		if (!(index < nextProps.section.groups.length)) {
			continue;
		}
		if (prevProps.section.groups[index].type !== nextProps.section.groups[index].type) {
			return false;
		}
		if (prevProps.section.groups[index].type === 'group') {
			if (!groupsAreEqual(prevProps.section.groups[index] as Group, nextProps.section.groups[index] as Group)) {
				return false;
			}
		}
		if (prevProps.section.groups[index].type === 'row') {
			if (!rowsAreEqual(prevProps.section.groups[index] as Row, nextProps.section.groups[index] as Row)) {
				return false;
			}
		}

	}
	return true;
};
