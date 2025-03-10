'use client';

import { ReactNode } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

interface RTLProviderProps {
  children: ReactNode;
}

// יצירת cache RTL להזרקת CSS עם תמיכה בכיוון מימין לשמאל
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function RTLProvider({ children }: RTLProviderProps) {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}