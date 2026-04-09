#!/bin/bash

# ---------------------------------------------------------------------------
# Ally Waste POC - GCP Load Balancer Setup Script
# ---------------------------------------------------------------------------
# This script configures:
# 1. GCS Bucket for Static Frontend (with SPA refresh fix)
# 2. Global Static IP
# 3. Google-Managed SSL Certificate
# 4. Serverless NEG for Cloud Run Backend
# 5. Global HTTP(S) Load Balancer with URL Map routing
# 6. HTTP -> HTTPS redirect (port 80 -> 443)
# ---------------------------------------------------------------------------

# -----------------------------
# VARIABLES
# -----------------------------
PROJECT_ID="personal-mcp-485500"
REGION="us-central1"
RUN_SERVICE="ally-waste-api"
DOMAIN="ally-admin.p3solutionsgroup.com"

# Resource names
FRONTEND_BUCKET="ally-waste-admin-assets-${PROJECT_ID}"
NEG_NAME="ally-waste-api-neg"
BACKEND_SERVICE="ally-waste-api-backend"
BACKEND_BUCKET_NAME="ally-waste-admin-backend-bucket"
URL_MAP="ally-waste-url-map"
CERT_NAME="ally-waste-managed-cert"
HTTPS_PROXY="ally-waste-https-proxy"
HTTP_PROXY="ally-waste-http-proxy"
HTTP_REDIRECT_URL_MAP="ally-waste-http-redirect"
IP_NAME="ally-waste-global-ip"
HTTPS_FWD_RULE="ally-waste-https-rule"
HTTP_FWD_RULE="ally-waste-http-rule"

echo "🚀 Starting GCP Infrastructure Setup for ${DOMAIN}..."

# Ensure we are in the correct project
gcloud config set project "${PROJECT_ID}"

# 1. FRONTEND ASSET BUCKET
echo "📦 Creating GCS Bucket for frontend..."
gcloud storage buckets create "gs://${FRONTEND_BUCKET}" --location=${REGION}

# SPA FIX: Set BOTH main and error page to index.html to handle React Router refreshes
gcloud storage buckets update "gs://${FRONTEND_BUCKET}" \
  --web-main-page-suffix=index.html \
  --web-error-page=index.html

# Make objects public for static hosting
gcloud storage buckets add-iam-policy-binding "gs://${FRONTEND_BUCKET}" \
  --member="allUsers" \
  --role="roles/storage.objectViewer"

# 2. BUILD AND UPLOAD FRONTEND
echo "🔨 Building admin-web..."
npm run build -w @ally-waste/admin-web

echo "📤 Uploading assets to gs://${FRONTEND_BUCKET}..."
gcloud storage cp -r apps/admin-web/dist/* "gs://${FRONTEND_BUCKET}"

# 3. NETWORKING & SECURITY
echo "🌐 Reserving Global Static IP..."
gcloud compute addresses create "${IP_NAME}" --global

# Display the IP for DNS configuration
RESERVED_IP=$(gcloud compute addresses describe "${IP_NAME}" --global --format="get(address)")
echo "✅ IP Reserved: ${RESERVED_IP}"
echo "⚠️ ACTION REQUIRED: Update Namecheap A record for 'ally-admin' to point to ${RESERVED_IP}"
echo "🔐 Creating Managed SSL Certificate..."
gcloud compute ssl-certificates create "${CERT_NAME}" \
  --domains="${DOMAIN}" \
  --global

echo "🔗 Creating Serverless NEG for Cloud Run..."
gcloud compute network-endpoint-groups create "${NEG_NAME}" \
  --region="${REGION}" \
  --network-endpoint-type=SERVERLESS \
  --cloud-run-service="${RUN_SERVICE}"

# 3. LOAD BALANCER COMPONENTS
echo "🏗️ Setting up Load Balancer components..."

# API Backend Service
gcloud compute backend-services create "${BACKEND_SERVICE}" \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED

gcloud compute backend-services add-backend "${BACKEND_SERVICE}" \
  --global \
  --network-endpoint-group="${NEG_NAME}" \
  --network-endpoint-group-region="${REGION}"

# Frontend Backend Bucket
gcloud compute backend-buckets create "${BACKEND_BUCKET_NAME}" \
  --gcs-bucket-name="${FRONTEND_BUCKET}" \
  --enable-cdn

# 4. URL MAP (Routing Logic)
echo "🗺️ Configuring URL Map (Routing)..."
gcloud compute url-maps create "${URL_MAP}" \
  --default-backend-bucket="${BACKEND_BUCKET_NAME}"

# Route /api/* to the NestJS Backend, everything else to Frontend Bucket
gcloud compute url-maps add-path-matcher "${URL_MAP}" \
  --path-matcher-name="api-matcher" \
  --default-backend-bucket="${BACKEND_BUCKET_NAME}" \
  --path-rules="/api/*=${BACKEND_SERVICE}"


# 5. TARGET PROXY & FORWARDING RULE
echo "📡 Creating HTTPS Proxy and Forwarding Rule..."
gcloud compute target-https-proxies create "${HTTPS_PROXY}" \
  --url-map="${URL_MAP}" \
  --ssl-certificates="${CERT_NAME}"

gcloud compute forwarding-rules create "${HTTPS_FWD_RULE}" \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --address="${IP_NAME}" \
  --target-https-proxy="${HTTPS_PROXY}" \
  --ports=443

# 6. HTTP -> HTTPS REDIRECT
echo "🔁 Creating HTTP -> HTTPS redirect..."

# Redirect URL map (no backends, just a 301 to HTTPS)
gcloud compute url-maps import "${HTTP_REDIRECT_URL_MAP}" --global --source=/dev/stdin <<EOF
kind: compute#urlMap
name: ${HTTP_REDIRECT_URL_MAP}
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
  stripQuery: false
EOF

# HTTP target proxy pointing at the redirect URL map
gcloud compute target-http-proxies create "${HTTP_PROXY}" \
  --url-map="${HTTP_REDIRECT_URL_MAP}"

# HTTP forwarding rule on port 80 using the same static IP
gcloud compute forwarding-rules create "${HTTP_FWD_RULE}" \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --address="${IP_NAME}" \
  --target-http-proxy="${HTTP_PROXY}" \
  --ports=80

echo "✨ Setup complete!"
echo "-----------------------------------------------------------------------"
echo "Next Steps:"
echo "1. Point your DNS A records to: ${RESERVED_IP}"
echo "2. Wait 30-60 mins for SSL propagation."
echo "3. Verify site at https://${DOMAIN}"
echo "4. After verified, run: gcloud run services update ${RUN_SERVICE} --region=${REGION} --ingress=internal-and-cloud-load-balancing"
echo "-----------------------------------------------------------------------"
