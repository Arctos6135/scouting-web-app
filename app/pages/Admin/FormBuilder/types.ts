import FormClass, { Group, Row, Section } from 'shared/dataClasses/FormClass';

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

export type InputProps = {
	label: string;
	onChange: (value: string) => void;
	className?: string;
};

export type TextProps = {
	text: string;
} & InputProps;

export type NumberProps = {
	number: number;
} & InputProps;

export type TextWithConfirmProps = {
	buttonText: string;
} & InputProps;

export type SelectProps = {
	options: { value: string; selected: boolean }[];
	buttonText: string;
} & InputProps;

export type EditSelectionProps = {
	onChange: (value: string, edit: string) => void;
} & Omit<SelectProps, 'onChange'>;

export type ToggleProps = {
	checked: boolean;
	onChange: () => void;
} & Omit<InputProps, 'onChange'>;

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
