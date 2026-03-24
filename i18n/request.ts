import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Read locale from cookie, headers, or use default
  const store = await cookies();
  let locale = store.get('locale')?.value || 'es';

  // Validate locale
  const validLocales = ['es', 'en'];
  if (!validLocales.includes(locale)) {
    locale = 'es';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

