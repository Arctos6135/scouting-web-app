import FormComponent from './FormComponent';
declare class Text extends FormComponent {
    readonly type = "text";
    minlength?: number;
    maxlength?: number;
    password?: boolean;
    charset?: string;
}
export default Text;
