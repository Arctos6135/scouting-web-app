import FormClass, { Group, Row, Section } from '../../shared/dataClasses/FormClass';

export type FormBuilderProps = {
	form: FormClass;
	onChange: (param: FormClass) => void;
};
type BuilderProps = {
	index: number;
	onChange: (param: OnChangeParams) => void;
	className?: string;
}
export type SectionBuilderProps = {
	section: Section;
} & BuilderProps;

export type GroupBuilderProps = {
	sectionIndex: number;
	rowIndex?: number;
	group: Group;
} & BuilderProps;

export type RowBuilderProps = {
	sectionIndex: number;
	row: Row;
} & BuilderProps;

export type ChangeProps = {
	label: string;
	onChange: (value: string) => void;
	className?: string;
};

export type TextChangeProps = {
	text: string;
} & ChangeProps;

export type NumberChangeProps = {
	number: number;
} & ChangeProps;

export type TextWithButtonChangeProps = {
	buttonText: string;
} & ChangeProps;

export type SelectChangeProps = {
	options: { value: string; selected: boolean }[];
	buttonText: string;
} & ChangeProps;

export type ToggleChangeProps = {
	checked: boolean;
	onChange: () => void;
} & ChangeProps;

export type SectionParams = {
	indices: { index: number; };
	type: 'section';
	update: Section
}

export type RowParams = {
	indices: { index: number; sectionIndex: number; };
	type: 'row';
	update: Row;
};

export type GroupParams = {
	indices: { index: number; sectionIndex: number; rowIndex?: number };
	type: 'group';
	update: Group;
};

export type OnChangeParams = SectionParams | RowParams | GroupParams;
