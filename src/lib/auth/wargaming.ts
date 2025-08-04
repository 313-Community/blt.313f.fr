import { CLIENT_ID, ORIGIN, SECRET } from '$env/static/private';
import { handlers, type Provider, providers } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export type WGToken = {
	access_token: string;
	account_id: string;
	expires_at: number;
	realm: string;
};

export function genToken(payload: Record<string, string>): string {
	return jwt.sign(payload, SECRET, { expiresIn: '1d' });
}

// Vérifie que les informations d'un JWT sont correctes
export function verifToken(token: string): Record<string, string> | null {
	try {
		return jwt.verify(token, SECRET) as Record<string, string>;
	} catch {
		return null;
	}
}

export const cookieName = 'blt.token';

const callback = '/auth/callback/wargaming';

const params = new URLSearchParams({
	application_id: CLIENT_ID,
	redirect_uri: ORIGIN + callback
}).toString();
const issuer = new URL('https://api.worldoftanks._realm_/wot/auth/login/');
issuer.search = params;

export function timer(token: WGToken) {
	// Refresh le token avant son expiration
	return setTimeout(
		(): ReturnType<typeof refreshToken> => refreshToken(token),
		token.expires_at - Date.now() - 60000 // 60 secondes avant l'expiration
	);
}

export async function refreshToken(token: WGToken): Promise<WGToken> {
	const url = new URL(`https://api.worldoftanks.${token.realm}/wot/auth/prolongate/`);
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('access_token', token.access_token);
	const res = await fetch(url);
	const { access_token, expires_at, account_id } = await res.json();
	return { access_token, account_id, expires_at, realm: token.realm };
}

export async function revokeToken(token: WGToken): Promise<boolean> {
	if (token) {
		const url = new URL(`https://api.worldoftanks.${token.realm}/wot/auth/logout/`);
		url.searchParams.set('application_id', CLIENT_ID);
		url.searchParams.set('access_token', token.access_token);
		const res = await fetch(url);
		return res.ok;
	}
	return false;
}

const wg: Provider = {
	id: 'wargaming',
	name: 'Wargaming',
	icon: '/icon/wargaming.svg',
	issuer: issuer.toString(),
	color: '#ffffff',
	selects: [
		{
			key: 'realm',
			values: [
				{ show: 'EU', actual: 'eu' },
				{ show: 'NA', actual: 'com' },
				{ show: 'ASIA', actual: 'asia' }
			]
		}
	]
};

export const authFields = ['access_token', 'account_id'];

if (!providers.some((provider: Provider) => provider.id === wg.id)) {
	handlers.push(async ({ event, resolve }) => {
		if (event.url.pathname === '/api' + callback) {
			const realm = event.url.searchParams.get('realm') || 'eu';
			throw redirect(302, issuer.toString().replace('_realm_', realm));
		} else if (event.url.pathname === '/auth/logout') {
			const token = verifToken(event.cookies.get(cookieName) || '') || {};
			event.cookies.delete(cookieName, { path: '/' });
			await revokeToken(token as unknown as WGToken);
			throw redirect(302, '/login');
		} else if (event.url.pathname === callback) {
			const { realm } = verifToken(event.cookies.get(cookieName) || '') || { realm: 'eu' };
			const expires_in = Math.floor(
				Number(event.url.searchParams.get('expires_at')) - Date.now() / 1000
			);
			const payload: Record<string, string> = { realm };
			for (const param of authFields) {
				payload[param] = event.url.searchParams.get(param) || '';
			}
			event.cookies.set(cookieName, genToken(payload), {
				path: '/',
				httpOnly: true,
				maxAge: expires_in,
				secure: true
			});
			throw redirect(302, '/');
		}
		return resolve(event);
	});

	providers.push(wg);
}
