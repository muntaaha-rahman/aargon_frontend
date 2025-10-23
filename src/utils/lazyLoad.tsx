import { lazy } from 'react';

export const lazyLoad = (path: string) => lazy(() => import(`../pages/${path}.tsx`));