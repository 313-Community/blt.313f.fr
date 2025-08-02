import { CLIENT_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import { defaultLanguage } from '$lib/translation';

export const load: PageServerLoad = async ({ cookies, fetch, params }: ServerLoadEvent) => {
	const lang = params.lang || defaultLanguage;
	const access_token = cookies.get('access_token');
	const account_id = cookies.get('account_id');
	if (!access_token || !account_id) {
		throw redirect(302, `/${lang}/login`);
	}
	const url = new URL('https://api.worldofwarships.eu/wows/account/info/');
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('account_id', account_id);
	url.searchParams.set('access_token', access_token);
	url.searchParams.set('language', lang);
	url.searchParams.set('fields', 'private.battle_life_time,created_at');
	const res = await fetch(url);
	const { data } = await res.json();
	return data[account_id];
};
