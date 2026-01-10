# UserProfile API Integration Documentation

## Overview
This document describes the full API integration for the UserProfile component with the backend authentication routes.

## Files Modified/Created

### 1. **API Service** (`src/services/authAPI.js`)
- Central service for all authentication and user-related API calls
- Uses Axios with interceptors for token management
- Automatic JWT token injection in requests
- Automatic token refresh and logout on 401 errors

#### Available Methods:

```javascript
// Get user profile
AuthAPIService.getUserProfile()

// Update user profile
AuthAPIService.updateUserProfile(userData)

// Change password
AuthAPIService.changePassword(oldPassword, newPassword)

// Get wishlist
AuthAPIService.getWishlist()

// Add to wishlist
AuthAPIService.addToWishlist(productId)

// Remove from wishlist
AuthAPIService.removeFromWishlist(productId)

// Get user orders
AuthAPIService.getUserOrders()

// Add order
AuthAPIService.addOrder(orderData)
```

### 2. **Environment Configuration** (`.env.local`)
```
VITE_API_URL=https://ecommerce-fullstack.up.railway.app/api/auth
```
- Configure this to match your backend API URL
- Uses Vite's environment variable system

### 3. **UserProfile Component** (`src/pages/UserProfile.jsx`)
Updated with full API integration:

#### Features:
- **Profile Management**: Fetch and update user profile
- **Order History**: Load and display user orders with status
- **Wishlist**: Load, add, and remove items from wishlist
- **Security**: Change password functionality
- **Loading States**: Proper loading indicators during API calls
- **Error Handling**: User-friendly error messages
- **Auto-fetch**: Loads data on component mount

## API Routes Used

All routes require authentication with JWT token in Authorization header.

### Profile Routes
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile

### Order Routes
- `GET /user/orders` - Get all user orders
- `POST /user/orders` - Create new order

### Wishlist Routes
- `GET /user/wishlist` - Get wishlist items
- `POST /user/wishlist` - Add to wishlist
- `DELETE /user/wishlist/:productId` - Remove from wishlist

### Security Routes
- `PUT /user/change-password` - Change password

## Backend Implementation Required

Your backend needs to properly implement these endpoints. Example implementations:

### Update user.model.js
Ensure these fields exist:
```javascript
{
  fullname: String,
  email: String,
  password: String,
  phone: String,
  address: Object,
  orders: Array,
  wishlist: Array,
  createdAt: Date
}
```

### Update auth.service.js
The service methods should return proper responses:

```javascript
{
  success: true,
  message: "Operation successful",
  user: { /* user object */ },
  orders: [ /* order objects */ ],
  wishlist: [ /* wishlist items */ ]
}
```

## Usage Examples

### In Component
```jsx
import AuthAPIService from "../services/authAPI";

// Fetch profile
const fetchProfile = async () => {
  try {
    const response = await AuthAPIService.getUserProfile();
    setUser(response.user);
  } catch (error) {
    console.error(error);
  }
};

// Update profile
const updateProfile = async (data) => {
  try {
    const response = await AuthAPIService.updateUserProfile(data);
    setUser(response.user);
  } catch (error) {
    console.error(error);
  }
};
```

## State Management

The UserProfile component manages:
- `user`: Current user data
- `orders`: User's orders
- `wishlist`: User's wishlist items
- `loading`: Loading states for different sections

## Error Handling

- API service throws errors with messages
- Component catches and displays user-friendly messages
- 401 errors automatically trigger logout

## Testing

1. Start your backend server:
```bash
cd ecommerce-backend
npm install
npm start
```

2. Update `.env.local` with correct API URL if different

3. Start the client:
```bash
cd ecommerce-client
npm run dev
```

4. Navigate to user profile to test all functionality

## Token Management

- Token is stored in `localStorage` as `token`
- Token is automatically sent in Authorization header
- Token is removed on 401 response (expired/invalid)
- User is redirected to auth page if token is invalid

## Success Indicators

✅ Profile data loads and updates
✅ Orders display with status
✅ Wishlist items load and can be added/removed
✅ Password can be changed
✅ Logout works properly
✅ Loading states display correctly
✅ Error messages show when API fails
