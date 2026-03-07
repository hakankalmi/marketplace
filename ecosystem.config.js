/**
 * PM2 Ecosystem Config — Her marka ayrı process
 * Port: 3010'dan başlayıp marka sırasına göre artar
 */
const brands = [
  { code: 'hali_sepeti', domain: 'haliyikamasepeti.com', port: 3010 },
  // Yeni marka eklemek için:
  // { code: 'koltuk_yikat', domain: 'koltukyikat.com', port: 3011 },
  // { code: 'ucuz_yikama', domain: 'ucuzyikama.com', port: 3012 },
];

module.exports = {
  apps: brands.map((b) => ({
    name: `mp-${b.code}`,
    cwd: `/opt/marketplace/builds/${b.code}`,
    script: 'server.js',
    max_memory_restart: '400M',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_BRAND_CODE: b.code,
      NEXT_PUBLIC_DOMAIN: b.domain,
      NEXT_PUBLIC_API_URL: 'https://api.protakip.com',
      PORT: b.port,
    },
  })),
};
