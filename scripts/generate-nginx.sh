#!/bin/bash
# Generates Nginx config for a marketplace brand
# Usage: ./generate-nginx.sh <brand_code> <domain> <port>

BRAND_CODE=$1
DOMAIN=$2
PORT=$3

if [ -z "$BRAND_CODE" ] || [ -z "$DOMAIN" ] || [ -z "$PORT" ]; then
  echo "Usage: $0 <brand_code> <domain> <port>"
  echo "Example: $0 hali_sepeti haliyikamasepeti.com 3010"
  exit 1
fi

cat > "/etc/nginx/sites-available/mp-${BRAND_CODE}" <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${DOMAIN} www.${DOMAIN};

    ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml image/svg+xml;
    gzip_min_length 1000;

    # Static assets cache
    location /_next/static/ {
        proxy_pass http://127.0.0.1:${PORT};
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /brands/ {
        proxy_pass http://127.0.0.1:${PORT};
        expires 30d;
        add_header Cache-Control "public";
    }

    # Proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX

# Enable site
ln -sf "/etc/nginx/sites-available/mp-${BRAND_CODE}" "/etc/nginx/sites-enabled/mp-${BRAND_CODE}"

echo "Nginx config generated for ${DOMAIN} -> port ${PORT}"
echo "Run: nginx -t && systemctl reload nginx"
echo "SSL: certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
