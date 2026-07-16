import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import AnalyticsConsentBanner from './analytics/AnalyticsConsent';
import { initAnalytics } from './analytics/analytics';

void initAnalytics();

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
      <AnalyticsConsentBanner />
    </React.StrictMode>
  );
}
