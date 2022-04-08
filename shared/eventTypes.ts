import ResponseClass from './dataClasses/ResponseClass';
import FormClass, { Section } from './dataClasses/FormClass';
import ScoutClass from './dataClasses/ScoutClass';

const alertTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

export type AlertType = { page: string, message: string, type: typeof alertTypes[number] }

export interface ServerToClientEvents {
    'alert': (alert: AlertType) => void;
    'register:error': (message: string) => void;
    'admin:error': (message: string) => void;
    'register': (status: boolean) => void;

    'organization': () => void;
    'organization:get scouts': (scouts: ScoutClass[]) => void;
    'organization:get forms': (forms: FormClass[]) => void;
    'organization:update password': (status: boolean) => void;
    'organization:create scout': (status: boolean) => void;
    'organization:delete scout': (status: boolean) => void;
    'organization:update form': (status: boolean) => void;
    'organization:delete form': () => void;
    'organization:get url': (url: string) => void;
	'organization:assign': (status: boolean) => void;

	'data:get responses': (responses: ResponseClass[]) => void;

    'status': (data: { scout: ScoutClass }) => void;
}

export interface ClientToServerEvents {
    'organization': () => void;
	'organization:set admin': (data: {scout: ScoutClass, admin: boolean}) => void;
    'organization:get scouts': () => void;
    'organization:get forms': () => void;
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

	'data:respond': (response: ResponseClass) => void;
	'data:get responses': () => void;

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
