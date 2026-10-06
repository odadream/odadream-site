import { analyticsConfigFrom } from '../lib/analytics-contract';
export const analyticsConfig = analyticsConfigFrom(import.meta.env ?? {});
