import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.lunoratelier.app",
  appName: "Lunor Atelier",
  webDir: "out",
  server: {
    url: "https://your-domain.com",
    cleartext: false,
  },
};

export default config;
