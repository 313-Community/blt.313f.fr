import { CLIENT_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { redirect, type ServerLoadEvent } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies, fetch }: ServerLoadEvent) => {
	const realm = cookies.get('realm') || 'eu';
	const access_token = cookies.get('access_token');
	const account_id = cookies.get('account_id');
	if (!access_token || !account_id) {
		throw redirect(302, '/login');
	}
	const url = new URL(`https://api.worldofwarships.${realm}/wows/account/info/`);
	url.searchParams.set('application_id', CLIENT_ID);
	url.searchParams.set('account_id', account_id);
	url.searchParams.set('access_token', access_token);
	url.searchParams.set('fields', 'private.battle_life_time,created_at');
	const res = await fetch(url);
	try {
		const { data } = await res.json();
		return data[account_id];
	} catch {
		return { private: { battle_life_time: 0 }, created_at: Date.now() / 1000 };
	}
};
