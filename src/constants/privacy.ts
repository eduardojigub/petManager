import { Locale } from '../i18n/translations';

/**
 * Hosted privacy policy (GitHub Pages, branch `main`, folder `/docs`).
 * `docs/privacy/index.html` is this URL. English is `en.html` beside it.
 * The URL stays empty until Pages is enabled after the files reach `main`.
 */
export const PRIVACY_POLICY_URL = 'https://eduardojigub.github.io/petManager/privacy/';

export function privacyPolicyUrlForLocale(locale: Locale): string {
  return locale === 'en' ? `${PRIVACY_POLICY_URL}en.html` : PRIVACY_POLICY_URL;
}
