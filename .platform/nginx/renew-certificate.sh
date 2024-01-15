#!/bin/bash

# Check for existing certificate
if [ -f /etc/letsencrypt/live/api.homoeopatha.com/fullchain.pem ]; then
    cert_expiry=$(openssl x509 -checkend 86400 -noout -in /etc/letsencrypt/live/api.homoeopatha.com/fullchain.pem)
    if [[ $cert_expiry != "Certificate will expire"* ]]; then
        # Certificate exists and not expiring, reinstall it
        sudo /opt/certbot/bin/certbot --nginx --non-interactive --agree-tos -m krishankant.1172@gmail.com -d api.homoeopatha.com
    else
        # Certificate exists and expiring soon, renew it
        sudo /opt/certbot/bin/certbot --renew-by-default --nginx --non-interactive --agree-tos -m krishankant.1172@gmail.com -d api.homoeopatha.com
    fi
else
    # Certificate doesn't exist, renew it
    sudo /opt/certbot/bin/certbot --nginx --non-interactive --agree-tos -m krishankant.1172@gmail.com -d api.homoeopatha.com
fi
