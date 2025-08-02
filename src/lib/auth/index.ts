import type { Handle } from '@sveltejs/kit';

export type Provider = {
	id: string;
	name: string;
	icon: string;
	issuer: string;
	color: string;
};

export const providers: Provider[] = [];
export const handlers: Handle[] = [];
export const signOuts = [];
