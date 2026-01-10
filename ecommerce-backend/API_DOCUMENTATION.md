# E-Commerce Backend API Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- MongoDB running on `localhost:27017`
- All dependencies installed

### Installation
```bash
npm install
```

### Running the Server
```bash
node server.js
```

The server will start on `http://localhost:5000`

---

## 📋 API Endpoints

### 1. **Authentication Endpoints**

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "phone": "1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "fullname": "John Doe",
    "email": "john@example.com",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "success": true,
  "message": "User logged in successfully",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Admin Login
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin@123456"
}

Response:
{
  "success": true,
  "message": "Admin logged in successfully",
  "admin": {
    "email": "admin@ecommerce.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 2. **User Profile Endpoints** (Protected)

#### Get User Profile
```
GET /api/auth/user/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "user": {
    "_id": "...",
    "fullname": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": { ... },
    "wishlist": [...],
    "orders": [...],
    ...
  }
}
```

#### Update User Profile
```
PUT /api/auth/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "Jane Doe",
  "phone": "0987654321",
  "address": {
    "street": "456 Oak Ave",
    "city": "Boston",
    "state": "MA",
    "country": "USA",
    "zipCode": "02101"
  },
  "profileImage": "https://example.com/image.jpg"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

#### Change Password
```
PUT /api/auth/user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "SecurePassword123",
  "newPassword": "NewSecurePassword456"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 3. **Wishlist Endpoints** (Protected)

#### Get Wishlist
```
GET /api/auth/user/wishlist
Authorization: Bearer <token>

Response:
{
  "success": true,
  "wishlist": [
    {
      "_id": "...",
      "productId": "...",
      "addedAt": "2024-01-04T10:30:00.000Z"
    }
  ]
}
```

#### Add to Wishlist
```
POST /api/auth/user/wishlist
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "Product added to wishlist",
  "wishlist": [...]
}
```

#### Remove from Wishlist
```
DELETE /api/auth/user/wishlist/:productId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Product removed from wishlist",
  "wishlist": [...]
}
```

---

### 4. **Order Endpoints** (Protected)

#### Get User Orders
```
GET /api/auth/user/orders
Authorization: Bearer <token>

Response:
{
  "success": true,
  "orders": [
    {
      "_id": "...",
      "productId": "...",
      "quantity": 2,
      "status": "pending",
      "paymentMethod": "credit_card",
      "totalPrice": 199.99,
      "orderDate": "2024-01-04T10:30:00.000Z",
      "deliveryDate": null
    }
  ]
}
```

#### Add Order
```
POST /api/auth/user/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2,
  "paymentMethod": "credit_card",
  "totalPrice": 199.99
}

Payment Methods: 
  - credit_card
  - debit_card
  - upi
  - net_banking
  - cod

Response:
{
  "success": true,
  "message": "Order added successfully",
  "order": { ... }
}
```

---

### 5. **Admin Endpoints** (Protected)

#### Access Admin Dashboard
```
GET /api/auth/admin/dashboard
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "message": "Admin dashboard accessed successfully",
  "admin": {
    "email": "admin@ecommerce.com",
    "role": "admin"
  }
}
```

---

## 🔒 Security Features

### ✅ Implemented Security Measures:

1. **Helmet.js** - Sets various HTTP headers for security
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - Strict-Transport-Security

2. **JWT (JSON Web Tokens)**
   - Secure token-based authentication
   - Configurable expiration (default: 7 days)
   - Secret key from environment variables

3. **Bcrypt Password Hashing**
   - Industry-standard password hashing
   - Configurable salt rounds (default: 10)
   - One-way encryption - passwords cannot be decrypted

4. **CORS Protection**
   - Controlled access to API endpoints
   - Configurable origins

5. **Input Validation**
   - Email validation using regex
   - Password strength requirements
   - Field length validation

6. **Protected Routes**
   - User-only routes require user JWT token
   - Admin-only routes require admin JWT token
   - Token verification on every protected request

7. **Error Handling**
   - Secure error messages (no sensitive info leakage)
   - Global error handler
   - Proper HTTP status codes

---

## 🗂 Project Structure

```
ecommerce-backend/
├── .env                          # Environment variables
├── app.js                        # Express app setup & middleware
├── server.js                     # Server startup
├── package.json                  # Dependencies
├── model/
│   └── user.model.js            # User schema & model
├── routes/
│   └── auth.route.js            # Authentication routes
├── services/
│   └── auth.service.js          # Business logic & database operations
└── middleware/
    └── auth.middleware.js       # JWT verification middleware
```

---

## 🔑 User Model Fields

```javascript
{
  fullname: String,              // User's full name
  email: String,                 // Unique email (lowercase)
  password: String,              // Bcrypt hashed password
  phone: String,                 // Phone number (optional)
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  profileImage: String,          // URL to profile image
  wishlist: [{
    productId: ObjectId,         // Reference to Product
    addedAt: Date
  }],
  orders: [{
    orderId: ObjectId,           // Reference to Order
    productId: ObjectId,         // Reference to Product
    quantity: Number,
    status: String,              // pending, confirmed, shipped, delivered, cancelled
    paymentMethod: String,       // credit_card, debit_card, upi, net_banking, cod
    totalPrice: Number,
    orderDate: Date,
    deliveryDate: Date
  }],
  isActive: Boolean,             // Account active status
  role: String,                  // "user" or "admin"
  lastLogin: Date,               // Last login timestamp
  createdAt: Date,               // Account creation time
  updatedAt: Date                // Last update time
}
```

---

## 📝 Environment Variables (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=Admin@123456
NODE_ENV=development
```

---

## 🧪 Testing the API

### Using cURL

**Register a User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get User Profile (with token):**
```bash
curl -X GET http://localhost:5000/api/auth/user/profile \
  -H "Authorization: Bearer <token>"
```

---

## ⚠️ Important Security Notes

1. **Change JWT_SECRET in Production** - Use a strong, random key
2. **Change ADMIN_PASSWORD** - Use a strong password
3. **Update ADMIN_EMAIL** - Use your actual admin email
4. **Use HTTPS in Production** - Enable secure connections
5. **Database Credentials** - Secure your MongoDB connection string
6. **Rate Limiting** - Consider adding rate limiting for production
7. **CORS Configuration** - Update allowed origins for production
8. **Token Refresh** - Implement refresh tokens for better security

---

## 📞 API Health Check

```
GET /api/

Response:
{
  "success": true,
  "message": "E-Commerce Backend API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

---

## 🐛 Error Handling

All errors return in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 🎯 Next Steps

1. Connect MongoDB to your local machine
2. Update `.env` file with your configuration
3. Run `node server.js` to start the server
4. Test endpoints using Postman or cURL
5. Integrate with frontend (ecommerce-client)

---

**Created:** January 4, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
