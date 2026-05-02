# Roar Space - Deployment Guide

## Prerequisites
- Node.js 16+ installed
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- Firebase project
- Razorpay account

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository
\`\`\`bash
git clone https://github.com/prabhum1202-ops/web-test.git
cd web-test/frontend
\`\`\`

### Step 2: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 3: Set Environment Variables
Create `.env.local`:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
NEXT_PUBLIC_API_URL=https://roar-space-api.onrender.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
\`\`\`

### Step 4: Deploy to Vercel
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## Backend Deployment (Render)

### Step 1: Navigate to Backend
\`\`\`bash
cd web-test/backend
\`\`\`

### Step 2: Set Environment Variables
Create `.env`:
\`\`\`
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@roarspace.com
NODE_ENV=production
\`\`\`

### Step 3: Connect to Render
1. Go to render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: \`npm install\`
5. Set start command: \`node server.js\`

## Verify Deployment

### Frontend
\`\`\`bash
curl https://web-test.vercel.app
\`\`\`

### Backend
\`\`\`bash
curl https://roar-space-api.onrender.com/api/health
\`\`\`

## Go Live Checklist
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Firebase project configured
- [ ] Razorpay integration tested
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Database backups enabled
- [ ] Monitoring alerts set up
- [ ] Admin account created
- [ ] Test transaction completed
\`\`\`

### **4. Setup Instructions**

```markdown name=SETUP.md
# Roar Space - Setup Instructions

## Local Development Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- Git
- Firebase account
- Razorpay account

### Step 1: Clone Repository
\`\`\`bash
git clone https://github.com/prabhum1202-ops/web-test.git
cd web-test
\`\`\`

### Step 2: Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your Firebase credentials:
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
\`\`\`

### Step 3: Backend Setup
\`\`\`bash
cd ../backend
npm install
cp .env.example .env
\`\`\`

Edit `.env` with your credentials:
\`\`\`
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=admin@roarspace.com
\`\`\`

### Step 4: Run Development Server
\`\`\`bash
# From root directory
npm run dev

# Or separately:
# Terminal 1: Frontend
cd frontend && npm run dev

# Terminal 2: Backend
cd backend && npm run dev
\`\`\`

### Step 5: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Admin Panel: http://localhost:3000/admin

## Firebase Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name: "roar-space-production"
4. Enable Google Analytics (optional)
5. Create project

### Enable Authentication
1. Firebase Console → Authentication → Sign-in method
2. Enable Email/Password
3. Disable Anonymous (if desired)

### Create Firestore Database
1. Firebase Console → Firestore Database
2. Select Production mode
3. Choose nearest location (asia-south1 for India)
4. Create database

### Enable Storage
1. Firebase Console → Storage
2. Create bucket with name: roar-space-production
3. Choose location

### Get Credentials
1. Project Settings → Service Accounts
2. Generate new private key (JSON)
3. Copy credentials to .env file

## Razorpay Setup

### Create Account
1. Go to https://razorpay.com
2. Sign up and verify email
3. Complete KYC verification

### Get API Keys
1. Dashboard → Settings → API Keys
2. Copy Key ID and Key Secret
3. Add to environment variables

### Setup Webhook
1. Settings → Webhooks
2. Add webhook URL: \`{backend_url}/api/razorpay/webhook\`
3. Select events: payment.authorized, payment.failed

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (Backend)
lsof -ti:3001 | xargs kill -9
\`\`\`

### Firebase Connection Issues
- Verify credentials in .env
- Check firestore.rules file
- Ensure Firebase project is active

### Payment Not Processing
- Check Razorpay API keys
- Verify webhook URL
- Test with Razorpay test keys first
\`\`\`

### **5. API Documentation**

```markdown name=docs/API.md
# Roar Space API Documentation

## Base URL
\`https://roar-space-api.onrender.com\`

## Endpoints

### Health Check
\`\`\`
GET /api/health
\`\`\`
Response:
\`\`\`json
{
  "status": "OK",
  "timestamp": "2026-05-02T10:30:00Z",
  "environment": "production"
}
\`\`\`

### Orders

#### Get Order
\`\`\`
GET /api/orders/:orderId
\`\`\`

#### Update Order Status
\`\`\`
POST /api/orders/:orderId/status
Content-Type: application/json

{
  "status": "shipped"
}
\`\`\`

#### Get All Orders (Admin)
\`\`\`
GET /api/admin/orders
\`\`\`

### Products

#### Create Product (Admin)
\`\`\`
POST /api/admin/products
Content-Type: application/json

{
  "name": "Product Name",
  "price": 999,
  "description": "Product description",
  "category": "T-Shirts",
  "sizes": ["S", "M", "L", "XL"],
  "stock": 50,
  "images": ["url1", "url2"]
}
\`\`\`

#### Update Product (Admin)
\`\`\`
PUT /api/admin/products/:productId
Content-Type: application/json

{
  "price": 1099,
  "stock": 45
}
\`\`\`

#### Delete Product (Admin)
\`\`\`
DELETE /api/admin/products/:productId
\`\`\`

### Payments

#### Verify Payment
\`\`\`
POST /api/razorpay/verify
Content-Type: application/json

{
  "paymentId": "pay_xxxxx",
  "orderId": "order_xxxxx",
  "signature": "signature_hash"
}
\`\`\`

## Error Responses

\`\`\`json
{
  "success": false,
  "error": "Error message"
}
\`\`\`
\`\`\`

### **6. Vercel Configuration**

```json name=vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "@firebase_storage_bucket",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@firebase_sender_id",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "@firebase_app_id",
    "NEXT_PUBLIC_RAZORPAY_KEY_ID": "@razorpay_key",
    "NEXT_PUBLIC_API_URL": "@api_url",
    "NEXT_PUBLIC_WHATSAPP_NUMBER": "@whatsapp_number"
  }
}