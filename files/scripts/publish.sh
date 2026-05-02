#!/bin/bash

echo "🚀 Publishing Roar Space to GitHub..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.."

# Initialize git if needed
if [ ! -d .git ]; then
  git init
  git remote add origin https://github.com/prabhum1202-ops/web-test.git
fi

# Add all files
git add .

# Commit with descriptive message
git commit -m "🚀 Full-stack e-commerce platform: Roar Space Mens Collection

Features:
- Premium UI with dark/gold luxury theme
- Complete authentication system
- Product catalog with filters
- Shopping cart with persistent storage
- Razorpay + COD payment integration
- Admin dashboard with analytics
- Order management system
- Firebase backend
- Fully responsive design
- Production-ready deployment configs

Ready to deploy to Vercel (frontend) and Render (backend)"

# Push to GitHub
git push -u origin main

echo "✅ Successfully published to GitHub!"
echo "Repository: https://github.com/prabhum1202-ops/web-test"