import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'dev.lovable.wellcharged6553273cf8984999',
  appName: 'The Well-Charged',
  webDir: 'dist',
  server: {
    url: 'https://6553273c-f898-4999-8828-954e9ccdbbb6.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    // We'll add plugin configurations here as needed
  }
};

export default config;