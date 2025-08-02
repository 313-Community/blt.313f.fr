import type { PageServerLoad } from './$types';
import { providers } from '$lib/auth';

export const load: PageServerLoad = async () => {
	return { providers };
};
