import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['translation'],
  defaultNS: 'translation',
  resources: {
    en: {
      translation: {
        'nav.home': 'Home',
        'nav.search': 'Search',
        'nav.matchTool': 'Match Tool',
        'nav.profile': 'My Profile',
        'nav.subscription': 'Subscription',
        'nav.login': 'Login',
        'nav.register': 'Register',
        'nav.logout': 'Logout',
        'nav.admin': 'Admin',
        'profile.match': 'Match',
        'home.heroTitle': 'Find Your Perfect Match',
        'home.heroSubtitle': 'Sri Lanka\'s trusted matrimonial platform',
        'common.loading': 'Loading...',
        'common.error': 'Something went wrong',
        'common.retry': 'Try Again',
        'error.boundary.title': 'Something went wrong',
        'error.boundary.message': 'An unexpected error occurred. Please try again.',
        'error.boundary.retry': 'Try Again',
        'error.boundary.home': 'Go Home',
      },
    },
  },
  interpolation: { escapeValue: false },
});

export default i18n;
