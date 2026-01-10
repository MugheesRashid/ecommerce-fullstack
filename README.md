# 🛍️ E-Commerce Platform

> A modern, full-stack e-commerce application with complete user authentication, product management, shopping cart, and order processing.

[![Node.js](https://img.shields.io/badge/Node.js-v14+-green?style=flat-square)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2.1-blue?style=flat-square)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 🚀 Quick Start

```bash
# Backend Setup
cd ecommerce-backend
npm install
npm start

# Frontend Setup (in new terminal)
cd ecommerce-client
npm install
npm run dev
```

Backend: `http://localhost:5000` | Frontend: `http://localhost:5173`

---

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Backend API](#backend-api)
- [Frontend Pages](#frontend-pages)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Routes Overview](#api-routes-overview)

---

## 📁 Project Structure

```
ecommerce/
├── ecommerce-backend/          # Express.js Backend Server
│   ├── routes/                 # API Route definitions
│   │   ├── auth.route.js       # Authentication routes
│   │   ├── product.route.js    # Product CRUD operations
│   │   ├── cart.route.js       # Shopping cart management
│   │   └── order.route.js      # Order processing
│   ├── services/               # Business logic layer
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   ├── cart.service.js
│   │   └── order.service.js
│   ├── model/                  # MongoDB Data Models
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── cart.model.js
│   │   └── order.model.js
│   ├── middleware/             # Express Middleware
│   │   └── auth.middleware.js  # JWT authentication
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   ├── package.json
│   └── API_DOCUMENTATION.md    # Detailed API docs
│
├── ecommerce-client/           # React + Vite Frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx     # Homepage
│   │   │   ├── ProductListing.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ShoppingCart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── AuthPage.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── admin.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── middleware/         # React middleware/guards
│   │   │   ├── AuthMiddleware.jsx
│   │   │   └── AdminAuthMiddleware.jsx
│   │   ├── services/           # API service files
│   │   │   ├── authAPI.js      # Auth API calls
│   │   │   ├── productAPI.js   # Product API calls
│   │   │   ├── cartAPI.js      # Cart API calls
│   │   │   ├── orderAPI.js     # Order API calls
│   │   │   └── wishlistAPI.js  # Wishlist API calls
│   │   ├── assets/             # Images and assets
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
│
└── .gitignore                  # Git ignore file
```

---

## ✨ Features

### User Features
- **User Authentication**: Register and login with email/password
- **User Profile**: View and update profile information
- **Password Management**: Secure password change functionality
- **Product Browsing**: View all products with pagination
- **Product Details**: Detailed product pages with descriptions
- **Shopping Cart**: Add, update, and remove items from cart
- **Wishlist**: Save favorite products
- **Checkout**: Complete purchase orders
- **Order Tracking**: Track order status by order number
- **Order History**: View all past orders with details
- **Order Cancellation**: Cancel pending orders

### Admin Features
- **Admin Login**: Separate admin authentication
- **Product Management**: Create, update, and delete products
- **Inventory Management**: Manage product stock levels
- **Order Management**: View all orders with filters
- **Order Status Updates**: Update order status and tracking info
- **Statistics Dashboard**: View order statistics and metrics

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5.2.1
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: 
  - bcrypt for password hashing
  - Helmet.js for HTTP headers security
- **API Documentation**: Custom endpoints

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7.2
- **Routing**: React Router v7.11
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS v4.1
- **UI Icons**: Lucide React
- **Linting**: ESLint

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection string)
- npm or yarn

### Backend Setup

```bash
cd ecommerce-backend

# Install dependencies
npm install

# Create .env file
# Add your MongoDB URI and JWT secret
echo "MONGODB_URI=mongodb://localhost:27017/ecommerce" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start the server
npm start
# or
node server.js
```

### Frontend Setup

```bash
cd ecommerce-client

# Install dependencies
npm install

# Create .env.local file
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔌 Backend API

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

---

## 🔐 Authentication Routes

### Register User
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
```

### User Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

### Admin Login
```
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@ecommerce.com",
  "password": "Admin@123456"
}
```

### Get User Profile (Protected)
```
GET /api/auth/user/profile
Headers: Authorization: Bearer <token>
```

### Update User Profile (Protected)
```
PUT /api/auth/user/profile
Headers: Authorization: Bearer <token>

{
  "fullname": "Jane Doe",
  "phone": "9876543210",
  "address": { ... }
}
```

### Change Password (Protected)
```
PUT /api/auth/user/change-password
Headers: Authorization: Bearer <token>

{
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

### Get Wishlist (Protected)
```
GET /api/auth/user/wishlist
Headers: Authorization: Bearer <token>
```

### Add to Wishlist (Protected)
```
POST /api/auth/user/wishlist
Headers: Authorization: Bearer <token>

{
  "productId": "product_id"
}
```

### Remove from Wishlist (Protected)
```
DELETE /api/auth/user/wishlist/:productId
Headers: Authorization: Bearer <token>
```

---

## 📦 Product Routes

### Get All Products (Public - Paginated)
```
GET /api/products?page=1&limit=10
```

### Get Product by ID (Public)
```
GET /api/products/:id
```

### Get Products by Category (Public)
```
GET /api/products/category/:category?page=1&limit=10
```

### Create Product (Admin Only)
```
POST /api/products/admin/create
Headers: Authorization: Bearer <admin_token>

{
  "name": "Product Name",
  "price": 99.99,
  "discountedPrice": 79.99,
  "image": "image_url",
  "description": "Product description",
  "category": "Electronics",
  "stock": 50
}
```

### Update Product (Admin Only)
```
PUT /api/products/admin/update/:id
Headers: Authorization: Bearer <admin_token>

{
  "name": "Updated Name",
  "price": 89.99,
  ...
}
```

### Delete Product (Admin Only)
```
DELETE /api/products/admin/delete/:id
Headers: Authorization: Bearer <admin_token>
```

---

## 🛒 Cart Routes (All Protected)

### Get Cart
```
GET /api/cart
Headers: Authorization: Bearer <token>
```

### Add to Cart
```
POST /api/cart/add
Headers: Authorization: Bearer <token>

{
  "productId": "product_id",
  "quantity": 2
}
```

### Update Cart Item
```
PUT /api/cart/update/:productId
Headers: Authorization: Bearer <token>

{
  "quantity": 3
}
```

### Remove from Cart
```
DELETE /api/cart/remove/:productId
Headers: Authorization: Bearer <token>
```

### Clear Cart
```
DELETE /api/cart/clear
Headers: Authorization: Bearer <token>
```

---

## 📋 Order Routes

### Create Order (Protected)
```
POST /api/orders
Headers: Authorization: Bearer <token>

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "paymentMethod": "credit_card",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ]
}
```

### Get User Orders (Protected - Paginated)
```
GET /api/orders/user?page=1&limit=10
Headers: Authorization: Bearer <token>
```

### Get Order by ID (Protected)
```
GET /api/orders/:orderId
Headers: Authorization: Bearer <token>
```

### Track Order by Order Number (Protected)
```
GET /api/orders/track/:orderNumber
Headers: Authorization: Bearer <token>
```

### Cancel Order (Protected)
```
PUT /api/orders/:orderId/cancel
Headers: Authorization: Bearer <token>
```

### Get All Orders (Admin Only - Paginated with Filters)
```
GET /api/orders/admin/all?page=1&limit=10&status=pending&paymentMethod=credit_card&startDate=2024-01-01&endDate=2024-12-31
Headers: Authorization: Bearer <admin_token>
```

### Get Order by ID (Admin Only)
```
GET /api/orders/admin/:orderId
Headers: Authorization: Bearer <admin_token>
```

### Update Order Status (Admin Only)
```
PUT /api/orders/admin/:orderId/status
Headers: Authorization: Bearer <admin_token>

{
  "status": "shipped"
}
```

### Update Order Tracking (Admin Only)
```
PUT /api/orders/admin/:orderId/tracking
Headers: Authorization: Bearer <admin_token>

{
  "trackingNumber": "TRK123456789",
  "carrier": "UPS"
}
```

### Get Order Statistics (Admin Only)
```
GET /api/orders/admin/statistics
Headers: Authorization: Bearer <admin_token>
```

---

## 🎨 Frontend Pages

### Public Pages
- **Landing Page** (`/`) - Homepage with featured products
- **Product Listing** (`/products`) - Browse all products with filters
- **Product Detail** (`/products/:id`) - Detailed product view
- **Shopping Cart** (`/cart`) - Review and manage cart items
- **Checkout** (`/checkout`) - Complete purchase process

### Authentication Pages
- **Auth Page** (`/auth`) - User login/register
- **Admin Login** (`/admin/login`) - Admin authentication

### Protected Pages (User)
- **User Profile** (`/user/profile`) - View/edit user profile
- **Order History** (`/orders`) - View user orders

### Protected Pages (Admin)
- **Admin Dashboard** (`/admin`) - Admin control panel
- **Order Management** - View and manage all orders

---

## 🔒 Middleware

### Authentication Middleware
- **authenticateUser**: Verifies JWT token for regular users
- **authenticateAdmin**: Verifies JWT token and admin role

---

## 🌍 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Start Backend
```bash
cd ecommerce-backend
npm install
npm start
# Server runs on http://localhost:5000
```

### Start Frontend (in a new terminal)
```bash
cd ecommerce-client
npm install
npm run dev
# App runs on http://localhost:5173
```

### Production Build
```bash
# Frontend
cd ecommerce-client
npm run build
npm run preview

# Backend
cd ecommerce-backend
npm start
```

---

## 📚 API Route Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Auth** |
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | User login |
| POST | `/api/auth/admin/login` | Public | Admin login |
| GET | `/api/auth/user/profile` | User | Get profile |
| PUT | `/api/auth/user/profile` | User | Update profile |
| PUT | `/api/auth/user/change-password` | User | Change password |
| **Products** |
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get product by ID |
| POST | `/api/products/admin/create` | Admin | Create product |
| PUT | `/api/products/admin/update/:id` | Admin | Update product |
| DELETE | `/api/products/admin/delete/:id` | Admin | Delete product |
| **Cart** |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart/add` | User | Add to cart |
| PUT | `/api/cart/update/:productId` | User | Update cart item |
| DELETE | `/api/cart/remove/:productId` | User | Remove from cart |
| DELETE | `/api/cart/clear` | User | Clear cart |
| **Orders** |
| POST | `/api/orders` | User | Create order |
| GET | `/api/orders/user` | User | Get user orders |
| GET | `/api/orders/:orderId` | User | Get order details |
| GET | `/api/orders/track/:orderNumber` | User | Track order |
| PUT | `/api/orders/:orderId/cancel` | User | Cancel order |
| GET | `/api/orders/admin/all` | Admin | Get all orders |
| PUT | `/api/orders/admin/:orderId/status` | Admin | Update status |

---

## 📝 Important Notes

- ✅ All protected routes require a valid JWT token in the `Authorization` header as `Bearer <token>`
- 🔒 Passwords are hashed using bcrypt before storage
- 🔐 JWT tokens are used for stateless authentication
- 🌐 CORS is enabled for cross-origin requests
- 💾 MongoDB connection required for backend operation
- ⏰ All timestamps are in ISO 8601 format

---

## 🎯 Key Features Breakdown

### Authentication & Security
- JWT-based authentication
- Role-based access control (User/Admin)
- Password encryption with bcrypt
- Protected API endpoints

### Product Management
- Full CRUD operations (Admin only)
- Pagination support
- Category filtering
- Inventory tracking

### Shopping Experience
- Add/remove items from cart
- Wishlist functionality
- Order creation and tracking
- Order cancellation

### Admin Dashboard
- Order management with filters
- Status and tracking updates
- Statistics and analytics
- User management

---

## 🛠️ Technologies Used

**Backend Stack:**
- Express.js - Web framework
- MongoDB - NoSQL database
- Mongoose - ODM
- JWT - Authentication
- Bcrypt - Password hashing
- Helmet - Security headers

**Frontend Stack:**
- React 19 - UI library
- Vite - Build tool
- React Router - Navigation
- Axios - HTTP client
- Tailwind CSS - Styling
- Lucide React - Icons

---

## 📊 Project Statistics

- **Routes**: 25+ API endpoints
- **Models**: 4 database schemas
- **Pages**: 9+ frontend pages
- **Components**: Reusable React components
- **Services**: API abstraction layer

---

**Built with ❤️ | Fully Open Source**
