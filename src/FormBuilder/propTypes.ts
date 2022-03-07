import FormClass from '../../formSchema/Form';

export type FormBuilderProps = {
	form: FormClass;
	onChange: (param: FormClass) => void;
}

export type SectionBuilderProps = {
	index: number;
	onChange: (param: FormClass) => void;
	className?: string;
}

export type GroupBuilderProps = {
	sectionIndex: number;
	rowIndex?: number;
} & SectionBuilderProps

export type RowBuilderProps = {
	sectionIndex: number;
} & SectionBuilderProps

export type ChangeProps = {
	label: string;
	onChange: (value: string) => void;
	className?: string;
}

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