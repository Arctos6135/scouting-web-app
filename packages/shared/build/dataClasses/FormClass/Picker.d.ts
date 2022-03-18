import FormComponent from './FormComponent';
declare class Picker extends FormComponent {
    readonly type = "picker";
    options: string[];
    default?: string;
}
export default Picker;
