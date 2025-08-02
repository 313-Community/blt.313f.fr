import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handlers as authHandlers } from '$lib/auth';
import { defaultLanguage } from '$lib/translation';
import { authFields } from '$lib/auth/wargaming';

const handleLanguage: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', event.params.lang || defaultLanguage)
	});
};

const handleRedirect: Handle = async ({ event, resolve }) => {
	const lang = event.params.lang || defaultLanguage;

	if (event.url.pathname === '/') {
		throw redirect(302, `/${lang}`);
	}

	if (!event.url.pathname.includes('login')) {
		for (const param of authFields) {
			if (!event.cookies.get(param)) {
				throw redirect(302, `/${lang}/login`);
			}
		}
	}
	return resolve(event);
};

export const handle: Handle = sequence(handleLanguage, ...authHandlers, handleRedirect);
