import { CLIENT_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import { cookieName, verifToken } from '$lib/auth/wargaming';

export const load: PageServerLoad = async ({ cookies, fetch }: ServerLoadEvent) => {
  const { realm: _realm, access_token, account_id } = verifToken(cookies.get(cookieName) || '') || { realm: 'eu' };
  const realm = _realm.toLowerCase() === 'na' ? 'com' : _realm;
  if ( !access_token || !account_id ) {
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
