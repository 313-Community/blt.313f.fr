import { ORIGIN, CLIENT_ID } from '$env/static/private';
import { handlers, type Provider, providers } from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export type WGToken = {
	access_token: string;
	expires_at: number;
	account_id: number;
	nickname: string;
	timer?: ReturnType<typeof setTimeout>;
};

const callback = '/auth/callback/wargaming';

const params = new URLSearchParams({
	application_id: CLIENT_ID,
	redirect_uri: ORIGIN + callback
}).toString();
const issuer = new URL('https://api.worldoftanks.eu/wot/auth/login/');
issuer.search = params;

function timer(token: WGToken) {
	// Refresh le token avant son expiration
	return setTimeout(
		(): ReturnType<typeof refreshToken> => refreshToken(token),
		token.expires_at - Date.now() - 60000 // 60 secondes avant l'expiration
	);
}

export async function refreshToken(token: WGToken): Promise<WGToken> {
	const url = new URL('https://api.worldoftanks.eu/wot/auth/prolongate/');
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('access_token', token.access_token);
	const res = await fetch(url);
	const data = await res.json();
	const _token = { ...token, ...data };
	return { ..._token, timer: timer(_token) };
}

export async function revokeToken(token: WGToken): Promise<boolean> {
	const url = new URL('https://api.worldoftanks.eu/wot/auth/logout/');
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('access_token', token.access_token);
	const res = await fetch(url);
	if (res.ok) {
		clearTimeout(token.timer);
	}
	return res.ok;
}

const wg = {
	id: 'wargaming',
	name: 'Wargaming',
	icon: '/icon/wargaming.svg',
	issuer: issuer.toString(),
	color: '#ffffff'
};

export const authFields = ['access_token', 'account_id'];

if (!providers.some((provider: Provider) => provider.id === wg.id)) {
	handlers.push(async ({ event, resolve }) => {
		if (event.url.pathname === '/api' + callback) {
			throw redirect(302, issuer);
		} else if (event.url.pathname === callback) {
			const expires_in = Math.floor(Number(event.url.searchParams.get('expires_at')) - Date.now() / 1000);
			for (const param of authFields) {
				event.cookies.set(param, event.url.searchParams.get(param) || '', {
					path: '/',
					httpOnly: true,
					maxAge: expires_in,
					secure: true
				});
			}
			throw redirect(302, '/');
		}
		return resolve(event);
	});

	providers.push(wg);
}
