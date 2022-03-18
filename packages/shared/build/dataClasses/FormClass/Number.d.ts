import FormComponent from './FormComponent';
declare class Num extends FormComponent {
    readonly type = "num";
    min: number;
    max: number;
    default?: string;
}
export default Num;
