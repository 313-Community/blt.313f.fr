import { ORIGIN, CLIENT_ID, SECRET } from '$env/static/private';
import { handlers, type Provider, providers } from '$lib/auth';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import * as crypto from 'node:crypto';

export type WGToken = {
	access_token: string;
	expires_at: number;
	account_id: number;
	nickname: string;
	timer?: ReturnType<typeof setTimeout>;
};

export function hashData(data: object): string {
	return crypto.createHmac('sha256', SECRET).update(JSON.stringify(data)).digest('hex');
}

export function verifHash(data: object, hash: string): boolean {
	if (!hash) return false;
	return hashData(data) === hash;
}

export function genToken(payload: Record<string, string>): string {
	return jwt.sign({ payload, hash: hashData(payload) }, SECRET, { expiresIn: '1d' });
}

// Vérifie que les informations d'un JWT sont correctes
export function verifToken(token: string): Record<string, string> | null {
	try {
		const { payload, hash } = jwt.verify(token, SECRET) as { payload: Record<string, string>; hash: string };
		if (!verifHash(payload, hash)) return null;
		return payload;
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

function timer(token: WGToken, realm: string) {
	// Refresh le token avant son expiration
	return setTimeout(
		(): ReturnType<typeof refreshToken> => refreshToken(token, realm),
		token.expires_at - Date.now() - 60000 // 60 secondes avant l'expiration
	);
}

export async function refreshToken(token: WGToken, realm: string): Promise<WGToken> {
	const url = new URL(`https://api.worldoftanks.${realm}/wot/auth/prolongate/`);
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('access_token', token.access_token);
	const res = await fetch(url);
	const data = await res.json();
	const _token = { ...token, ...data };
	return { ..._token, timer: timer(_token, realm) };
}

export async function revokeToken(token: WGToken, realm: string): Promise<boolean> {
	const url = new URL(`https://api.worldoftanks.${realm}/wot/auth/logout/`);
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
			const realm = event.url.searchParams.get('realm') || 'eu';
			console.log('realm', realm);
			throw redirect(302, issuer.toString().replace('_realm_', realm));
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
