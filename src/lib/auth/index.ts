import type { Handle } from '@sveltejs/kit';

export type Provider = {
	id: string;
	name: string;
	icon: string;
	issuer: string;
	color: string;
	selects: { key: string; values: { show: string; actual: string }[] }[];
};

export const providers: Provider[] = [];
export const handlers: Handle[] = [];
export const signOuts = [];
