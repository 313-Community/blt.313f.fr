import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handlers as authHandlers } from '$lib/auth';
import { authFields } from '$lib/auth/wargaming';
import duration, { type SupportedLanguage } from 'humanize-duration';
import { defaultLanguage } from '$lib/translation';

const handleLanguage: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || defaultLanguage;
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};

const handleRedirect: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || defaultLanguage;
	if (!duration.getSupportedLanguages().includes(lang as SupportedLanguage)) {
		throw redirect(302, '/');
	}

	if (!event.url.pathname.includes('login')) {
		for (const param of authFields) {
			if (!event.cookies.get(param)) {
				throw redirect(302, '/login');
			}
		}
	}
	return resolve(event);
};

export const handle: Handle = sequence(handleLanguage, ...authHandlers, handleRedirect);
