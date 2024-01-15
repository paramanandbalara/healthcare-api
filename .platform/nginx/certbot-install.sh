#!/bin/bash

# Install Certbot if not installed
if [ ! -x /opt/certbot/bin/certbot ]; then
    sudo /opt/certbot/bin/pip install --upgrade pip
    sudo /opt/certbot/bin/pip install certbot certbot-nginx
fi
