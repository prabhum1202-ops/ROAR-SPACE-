const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');

dotenv.config();

// Initialize Firebase
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://web-test.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ],
  credentials: true,
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Razorpay Webhook
app.post('/api/razorpay/verify', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    const crypto = require('crypto');

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === signature) {
      await db.collection('orders').doc(orderId).update({
        paymentStatus: 'completed',
        paymentId,
      });
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Order Routes
app.post('/api/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    await db.collection('orders').doc(orderId).update({
      orderStatus: status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const doc = await db.collection('orders').doc(req.params.orderId).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/orders', async (req, res) => {
  try {
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Product Routes
app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, price, description, category, sizes, stock, images } = req.body;

    const docRef = await db.collection('products').add({
      name,
      price,
      description,
      category,
      sizes,
      stock,
      images,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, data: { id: docRef.id, ...req.body } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await db.collection('products').doc(productId).update(req.body);
    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    await db.collection('products').doc(productId).delete();
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});