import { Response } from './dataClasses/Response';
import { Form, Section } from './dataClasses/Form';
import { Scout } from './dataClasses/Scout';

const alertTypes = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

export type AlertType = { page: string, message: string, type: typeof alertTypes[number], body?: string }

export interface ServerToClientEvents {
    'alert': (alert: AlertType) => void;
    'register:error': (message: string) => void;
    'admin:error': (message: string) => void;
    'register': (status: boolean) => void;

    'team': () => void;
    'team:get scouts': (scouts: Scout[]) => void;
    'team:get forms': (forms: Form[]) => void;
    'team:update password': (status: boolean) => void;
    'team:create scout': (status: boolean) => void;
    'team:delete scout': (status: boolean) => void;
    'team:update form': (status: boolean) => void;
    'team:delete form': () => void;
    'team:get url': (url: string) => void;
	'team:assign': (status: boolean) => void;

	'data:get responses': (responses: Response[]) => void;

    'status': (data: { scout: Scout | undefined }) => void;
}

export interface ClientToServerEvents {
    'team': () => void;
	'team:set admin': (data: {scout: Scout, admin: boolean}) => void;
    'team:get scouts': () => void;
    'team:get forms': () => void;
    'team:update password': (data: {
        login: string;
        newPassword: string;
    }) => void;
    'team:create scout': (data: {
        login: string;
        name: string;
    }) => void;
    'team:delete scout': (login: string) => void;
    'team:update form': (data: {
        id: string;
        name: string;
        sections: Section[];
    }) => void;
    'team:delete form': (data: {id: string}) => void;
    'team:get url': () => void;

	'data:respond': (response: Response) => void;
	'data:get responses': () => void;

    'login': (data: {
        login: string;
        password: string;
        team?: string;
    }) => void;
    'register': (data: {
        email: string;
        password: string;
        name: string;
    }) => void;
    'status': () => void;
    'logout': () => void;
}
