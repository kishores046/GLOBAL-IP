# 🐛 Citation Node Navigation Issue - Complete Fix

## Problem Summary

When clicking on a citation node in the graph, users are redirected to the login page instead of viewing the patent details.

## Root Cause

The backend requires authentication for the `/api/patents/{id}` endpoint, but one of these issues is occurring:

1. JWT token is missing from localStorage
2. JWT token has expired
3. Token is not being sent in API requests
4. CORS is blocking the Authorization header

## 🎯 Solutions Implemented

### 1. Created Auth Utility Functions ✅

**File:** `src/utils/authUtils.ts`

**Features:**

- ✅ Token expiration checking
- ✅ JWT decoding (client-side only)
- ✅ Authentication status checking
- ✅ Auth data management (save/clear)
- ✅ Role checking
- ✅ Safe token logging (hides sensitive data)

**Usage:**

```typescript
import {
  isAuthenticated,
  isTokenExpired,
  clearAuthData,
} from "./utils/authUtils";

// Check if user is authenticated
if (!isAuthenticated()) {
  // Redirect to login
}

// Check if token is expired
if (isTokenExpired()) {
  clearAuthData();
  // Refresh token or redirect
}
```

---

### 2. Enhanced API Service with Debugging ✅

**File:** `src/services/api.ts`

**Changes:**

- ✅ Added token expiration check BEFORE making requests
- ✅ Console logging for every API request
- ✅ Better error messages
- ✅ Auto-clear expired tokens
- ✅ Safe token preview in logs

**What you'll see in console:**

```javascript
🌐 API Request: {
  method: 'GET',
  url: '/patents/10006624',
  hasToken: true,
  tokenPreview: 'eyJhbGciOi...iOiJIUzI1'
}
```

**If token is expired:**

```javascript
❌ Token expired, clearing auth data
🔐 Token expired: {
  expiredAt: '1/6/2026, 10:30:00 AM',
  now: '1/6/2026, 11:45:00 AM'
}
```

---

### 3. Fixed CustomPatentNode Navigation ✅

**File:** `src/components/citation/CustomPatentNode.tsx`

**Changes:**

- ✅ Added authentication check before navigation
- ✅ User-friendly alert for expired sessions
- ✅ Console logging for debugging
- ✅ Prevents navigation if not authenticated

**Behavior:**

```typescript
// When clicking a node:
1. Check if root node → do nothing
2. Check authentication status
3. If not authenticated → alert + redirect to login
4. If authenticated → navigate to patent detail page
```

---

### 4. Created Auth Debug Panel ✅

**File:** `src/components/AuthDebugPanel.tsx`

**Features:**

- ✅ Real-time auth status display
- ✅ Token expiration countdown
- ✅ User role display
- ✅ Manual refresh button
- ✅ Clear auth button for testing

**Usage:**

```tsx
// Add to your app temporarily (REMOVE IN PRODUCTION!)
import { AuthDebugPanel } from "./components/AuthDebugPanel";

function App() {
  return (
    <>
      {/* Your app */}
      <AuthDebugPanel /> {/* Add this */}
    </>
  );
}
```

**What it shows:**

```
🔐 Auth Debug Panel
━━━━━━━━━━━━━━━━━━━━━━━━
Status: ✅ Authenticated
Has Token: ✅ Yes
Token: eyJhbGciOi...iOiJIUzI1
Expires: 1/6/2026, 2:30:00 PM
Time Left: 45 minutes
Roles: USER, ANALYST
User: john.doe@example.com

[🔄 Refresh] [🗑️ Clear Auth]
```

---

## 🧪 Testing Instructions

### Step 1: Add Debug Panel (Temporary)

**File:** `src/App.tsx` or your main component

```tsx
import { AuthDebugPanel } from "./components/AuthDebugPanel";

export default function App() {
  return (
    <div>
      {/* Your existing app code */}

      {/* Add this temporarily */}
      {process.env.NODE_ENV === "development" && <AuthDebugPanel />}
    </div>
  );
}
```

### Step 2: Open Your App

1. Start your frontend: `npm run dev`
2. Navigate to a patent detail page with citation graph
3. Look at the **bottom-right corner** for the debug panel

### Step 3: Check Auth Status

Debug panel should show:

- ✅ **Status: Authenticated** - Good to go!
- ❌ **Status: Not Authenticated** - Need to log in
- ⚠️ **Time Left: < 5 minutes** - Token expiring soon

### Step 4: Test Citation Node Click

1. Click on any citation node in the graph
2. Check browser console for logs:

**Expected (Success):**

```
✅ Navigating to patent: 10006624
🌐 API Request: {
  method: 'GET',
  url: '/patents/10006624',
  hasToken: true
}
```

**Expected (Failure - No Auth):**

```
⚠️ User not authenticated, redirecting to login
```

**Expected (Failure - Expired Token):**

```
❌ Token expired, clearing auth data
🔐 Token expired: { ... }
```

### Step 5: Verify Network Tab

1. Open DevTools → Network tab
2. Click a citation node
3. Find the `/api/patents/{id}` request
4. Check:

   - ✅ **Status: 200** - Success
   - ❌ **Status: 401** - No token or invalid
   - ❌ **Status: 403** - No permission

5. Check Request Headers:
   - Should have: `Authorization: Bearer eyJ...`

---

## 🔧 Troubleshooting Guide

### Issue: "No JWT token found"

**Symptoms:**

- Debug panel shows: "Has Token: ❌ No"
- Console: "⚠️ No JWT token found"

**Solution:**

1. User needs to log in
2. Check if login is saving token:
   ```typescript
   // In your login handler
   localStorage.setItem("jwt_token", response.data.token);
   ```

---

### Issue: "Token expired"

**Symptoms:**

- Debug panel shows: "Time Left: 0 minutes"
- Console: "❌ Token expired"

**Solution:**

1. Log out and log back in
2. Implement token refresh (see below)

---

### Issue: "Still redirecting even with valid token"

**Symptoms:**

- Debug panel shows authenticated
- Still goes to login on click

**Possible causes:**

1. **Backend CORS issue** - Check SecurityConfig.java
2. **Token not being sent** - Check Network tab
3. **Backend expects different format** - Check token format

**Debug:**

```typescript
// In browser console
const token = localStorage.getItem("jwt_token");
console.log("Token:", token);

// Try manual API call
fetch("http://localhost:8080/api/patents/10006624", {
  headers: { Authorization: `Bearer ${token}` },
})
  .then((r) => r.json())
  .then((d) => console.log("Success:", d))
  .catch((e) => console.error("Error:", e));
```

---

### Issue: "CORS error"

**Symptoms:**

- Console: "CORS policy: No 'Access-Control-Allow-Origin'"
- Network tab: Request failed

**Solution:**
Check your backend `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    // ✅ Make sure your frontend URL is here
    config.setAllowedOriginPatterns(List.of(
        "http://localhost:3000",
        "http://localhost:3001"  // ← Your port
    ));

    // ✅ Must allow Authorization header
    config.setAllowedHeaders(List.of("*"));

    // ✅ Must be true
    config.setAllowCredentials(true);

    return source;
}
```

---

## 🚀 Advanced: Token Refresh Implementation

To prevent token expiration issues, implement automatic token refresh:

**File:** `src/services/api.ts`

```typescript
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for refresh to complete
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call your refresh token endpoint
        const response = await api.post("/auth/refresh");
        const newToken = response.data.token;

        localStorage.setItem("jwt_token", newToken);

        // Retry all queued requests with new token
        refreshSubscribers.forEach((cb) => cb(newToken));
        refreshSubscribers = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        clearAuthData();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
```

---

## ✅ Testing Checklist

Before removing the debug panel:

- [ ] Can log in successfully
- [ ] Token appears in localStorage
- [ ] Debug panel shows "Authenticated"
- [ ] Can navigate to patent detail page normally
- [ ] Can click citation nodes and navigate
- [ ] Network tab shows 200 responses
- [ ] Authorization header present in requests
- [ ] No CORS errors
- [ ] Token expiration handled gracefully
- [ ] Logout clears token properly

---

## 📝 Files Modified

1. ✅ `src/utils/authUtils.ts` - Created
2. ✅ `src/services/api.ts` - Enhanced
3. ✅ `src/components/citation/CustomPatentNode.tsx` - Fixed
4. ✅ `src/components/AuthDebugPanel.tsx` - Created
5. ✅ `CITATION_NODE_NAVIGATION_FIX.md` - Documentation

---

## 🎯 Final Steps

1. **Add debug panel** to your app (temporarily)
2. **Test citation node clicks** and watch console logs
3. **Verify authentication** status in debug panel
4. **Check network tab** for API requests
5. **Fix any issues** based on logs
6. **Remove debug panel** when everything works

---

## 📞 Need Help?

**Share these debug outputs:**

```typescript
// In browser console
console.log("=== AUTH DEBUG ===");
console.log("Token:", localStorage.getItem("jwt_token"));
console.log("User:", localStorage.getItem("user"));
console.log("Authenticated:", isAuthenticated());
console.log("Token Info:", getTokenInfo());
```

**And screenshot:**

- Debug panel
- Browser console
- Network tab (showing failed request)
- Backend logs

---

**Status:** ✅ **Ready to test!**

All fixes are in place. Add the AuthDebugPanel to your app and start testing!
