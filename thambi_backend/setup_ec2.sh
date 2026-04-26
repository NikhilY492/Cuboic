#!/bin/bash

# Update and Install Dependencies
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common nginx certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/thambi
sudo ln -s /etc/nginx/sites-available/thambi /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo "--------------------------------------------------------"
echo "Setup Complete!"
echo "Next Steps:"
echo "1. Run 'sudo certbot --nginx -d thambi.in -d api.thambi.in' to enable SSL."
echo "2. Run 'sudo docker-compose up -d --build' to start the backend."
echo "--------------------------------------------------------"
