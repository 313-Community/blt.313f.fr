import { defaultLanguage, supportedLanguages } from '$lib/translation';
import duration, { type SupportedLanguage } from 'humanize-duration';

export function lang(): string {
	if (typeof navigator !== 'undefined') {
		const _lang = navigator.language.split('-')[0] || defaultLanguage;
		if (!duration.getSupportedLanguages().includes(_lang as SupportedLanguage)
			|| !supportedLanguages.includes(_lang)) {
			return defaultLanguage;
		}
		return _lang;
	}
	return defaultLanguage
}
