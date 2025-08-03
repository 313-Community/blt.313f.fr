export type Language = {
	blt: { time_played: string; as_hour: string; created_at: string; percentage: string };
	layout: { github: string };
	login: { title: string; description: string; connect: string };
};

export const languages: Record<string, Language> = {
	en: {
		blt: {
			time_played: 'You played %battle_life_time% in total.',
			as_hour: 'Expressed in hours, this is %as_hour%.',
			created_at: 'Your account was created on %created_at%.',
			percentage: 'This means you spent %percentage%% of your time playing World of Warships.' },
		layout: { github: 'Help For Translation' },
		login: {
			title: '',
			description: 'Sign in with your account to see your total playtime.',
			connect: 'Sign in with'
		}
	},
	fr: {
		blt: {
			time_played: 'Vous avez joué %battle_life_time% au total.',
			as_hour: 'Exprimé en heures, cela fait %as_hour%.',
			created_at: 'Votre compte a été créé le %created_at%.',
			percentage: 'Vous avez donc passé %percentage%% de votre temps à jouer à World of Warships.'
		},
		layout: { github: 'Aidez à la traduction' },
		login: {
			title: '',
			description: 'Connectez-vous avec votre compte pour voir votre temps de jeu total.',
			connect: 'Se connecter avec'
		}
	}
};

export const supportedLanguages = Object.keys(languages);
export const defaultLanguage = 'en';
