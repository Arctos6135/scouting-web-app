import Num from './Number';
import Picker from './Picker';
import Text from './Text';
declare type Component = Num | Picker | Text;
export declare class Row {
    readonly type: string;
    components: Group[];
}
export declare class Group {
    readonly type: string;
    label: string;
    component: Component;
    description?: string;
}
export declare class Section {
    readonly type: string;
    header?: string;
    groups: (Group | Row)[];
}
export default class FormClass {
    sections: Section[];
    ownerOrg: string;
    id: string;
    name: string;
}
export {};
