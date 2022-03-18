import AssignmentClass from './dataClasses/AssignmentClass';
import AssignmentResponseClass from './dataClasses/AssignmentResponseClass';
import FormClass, { Section } from './dataClasses/FormClass';
import ScoutClass from './dataClasses/ScoutClass';

export interface ServerToClientEvents {
    'login:failed': () => void;
    'login:unverified': () => void;
    'register:email taken': () => void;
    'register:failed': () => void;
    'register': (status: boolean) => void;

    'organization': () => void;
    'organization:get scouts': (scouts: ScoutClass[]) => void;
    'organization:get forms': (forms: FormClass[]) => void;
    'organization:get assignments': (assignments: AssignmentClass[]) => void;
    'organization:update password': (status: boolean) => void;
    'organization:create scout': (status: boolean) => void;
    'organization:delete scout': (status: boolean) => void;
    'organization:update form': (status: boolean) => void;
    'organization:delete form': () => void;
    'organization:get url': (url: string) => void;
	'organization:assign': (status: boolean) => void;

	'assignment:get responses': (responses: AssignmentResponseClass[]) => void;

    'status': (data: { scout: ScoutClass }) => void;
}

export interface ClientToServerEvents {
    'organization': () => void;
    'organization:get scouts': () => void;
    'organization:get forms': () => void;
    'organization:get assignments': () => void;
    'organization:update password': (data: {
        login: string;
        newPassword: string;
    }) => void;
    'organization:create scout': (data: {
        login: string;
        name: string;
    }) => void;
    'organization:delete scout': (login: string) => void;
    'organization:update form': (data: {
        id: string;
        name: string;
        sections: Section[];
    }) => void;
    'organization:delete form': (data: {id: string}) => void;
    'organization:get url': () => void;
    'organization:assign': (data: AssignmentClass) => void;
    'organization:delete assignment': (id: string) => void;

	'assignment:respond': (response: AssignmentResponseClass) => void;
	'assignment:get responses': () => void;

    'login': (data: {
        login: string;
        password: string;
        org: string;
    }) => void;
    'register': (data: {
        email: string;
        password: string;
        name: string;
    }) => void;
    'status': () => void;
    'logout': () => void;
}
