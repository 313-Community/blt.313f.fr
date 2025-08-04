import { CLIENT_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import { authFields, cookieName, genToken, verifToken, type WGToken } from '$lib/auth/wargaming';

function getUrl(token: WGToken): URL {
	const url = new URL(`https://api.worldofwarships.${token.realm}/wows/account/info/`);
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('account_id', token.account_id);
	url.searchParams.set('access_token', token.access_token);
	url.searchParams.set('fields', 'private.battle_life_time,created_at,nickname');
	return url;
}

export const load: PageServerLoad = async ({ cookies, fetch }: ServerLoadEvent) => {
	const token = (verifToken(cookies.get(cookieName) || '') || {}) as unknown as WGToken;
	for (const param of authFields) {
		if (!Object.keys(token).includes(param)) {
			throw redirect(302, '/login');
		}
	}
	const url = getUrl(token);
	try {
		const res = await fetch(url);
		const { data } = await res.json();
		return {
			...data[token.account_id],
			realm: token.realm.toLowerCase() === 'com' ? 'na' : token.realm
		};
	} catch {
		for (const realm of ['eu', 'com', 'asia']) {
			const url = getUrl({ ...token, realm });
			try {
				const res = await fetch(url);
				if (res.ok) {
					const { data } = await res.json();
					cookies.set(cookieName, genToken(token as unknown as Record<string, string>), {
						path: '/',
						httpOnly: true,
						maxAge: 120,
						secure: true
					});
					return {
						...data[token.account_id],
						realm: token.realm.toLowerCase() === 'com' ? 'na' : token.realm
					};
				}
			} catch {
				cookies.delete(cookieName, { path: '/' });
				throw redirect(302, '/login');
			}
		}
		cookies.delete(cookieName, { path: '/' });
		throw redirect(302, '/login');
	}
};
