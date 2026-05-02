# Roar Space - Complete Setup Guide

## Prerequisites
- Node.js 16+
- Firebase Account
- Razorpay Account
- Git

## Local Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/prabhum1202-ops/web-test.git
cd web-test
\`\`\`

### 2. Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase credentials
npm run dev
\`\`\`

### 3. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Firebase & Razorpay credentials
npm run dev
\`\`\`

## Firebase Setup
1. Create project at console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Enable Storage
5. Download service account JSON
6. Add credentials to .env

## Razorpay Setup
1. Create account at razorpay.com
2. Get API keys from dashboard
3. Add to .env
4. Create webhook pointing to backend

## Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Admin: http://localhost:3000/admin
\`\`\`

---

## **STEP 3: Push to GitHub**

```bash
cd web-test

# Add all files
git add .

# Create initial commit
git commit -m "🚀 Initial commit: Complete Roar Space e-commerce platform

- Full-stack Next.js + Express application
- Firebase authentication & database
- Razorpay payment integration
- Premium dark luxury UI theme
- Admin dashboard with analytics
- Product & order management
- Fully responsive design
- CI/CD workflows configured
- Production-ready deployment setup

Features:
✅ User authentication & profiles
✅ Product browsing with filters
✅ Shopping cart system
✅ Secure checkout
✅ Payment processing
✅ Order tracking
✅ Admin panel
✅ Inventory management

Ready to deploy on Vercel & Render"

# Set upstream and push
git branch -M main
git remote add origin https://github.com/prabhum1202-ops/web-test.git
git push -u origin main