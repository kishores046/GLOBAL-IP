# Citation Node Navigation - Login Redirect Issue Fix

## 🐛 Problem

Clicking on a citation node in the graph redirects to the login page instead of showing the patent details.

## 🔍 Root Cause Analysis

The issue occurs because:

1. ✅ **Frontend navigation works** - `navigate(`/patent/${id}`)` is correct
2. ❌ **Backend API call fails** - When the new page loads, it calls `/api/patents/{id}` which requires authentication
3. ❌ **Token issues** - One of these is happening:
   - Token is missing from localStorage
   - Token has expired
   - Token is not being sent in the request header
   - CORS is blocking the Authorization header

## 🔧 Solutions

### Solution 1: Debug Token Issues (Most Common)

Add debugging to see what's happening:

**File: `src/services/api.ts`**

```typescript
// Request interceptor - ENHANCED with debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");

    // DEBUG: Log token status
    console.log("🔐 API Request Debug:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "NO TOKEN",
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No JWT token found in localStorage!");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

**Expected output when clicking a node:**

```
🔐 API Request Debug: {
  url: '/patents/10006624',
  method: 'get',
  hasToken: true,
  tokenPreview: 'eyJhbGciOiJIUzI1NiIs...'
}
```

**If you see `hasToken: false`:**

- User is not logged in
- Token was cleared
- User needs to log in again

---

### Solution 2: Check Token Expiration

Add token expiration checking:

**File: `src/utils/authUtils.ts`** (create if doesn't exist)

```typescript
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
  sub: string;
  roles: string[];
}

export function isTokenExpired(): boolean {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    console.log("No token found");
    return true;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("Token expired:", {
        expiredAt: new Date(decoded.exp * 1000),
        now: new Date(),
      });
      return true;
    }

    console.log("Token valid until:", new Date(decoded.exp * 1000));
    return false;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}

export function clearAuthData() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
}

export function getTokenInfo() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
```

**Then update the API interceptor:**

```typescript
import { isTokenExpired, clearAuthData } from "../utils/authUtils";

api.interceptors.request.use(
  (config) => {
    // Check if token is expired BEFORE making request
    if (isTokenExpired()) {
      console.warn("⚠️ Token expired, clearing and redirecting...");
      clearAuthData();
      window.location.href = "/login";
      return Promise.reject(new Error("Token expired"));
    }

    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

### Solution 3: Add Auth Check to Navigation

Prevent navigation if not authenticated:

**File: `src/components/citation/CustomPatentNode.tsx`**

```typescript
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../../utils/authUtils";

export function CustomPatentNode({
  data,
  id,
}: NodeProps<CustomPatentNodeData>) {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (data.isRoot) return;

    // CHECK AUTH BEFORE NAVIGATION
    if (isTokenExpired()) {
      alert("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }

    // Navigate to patent details
    navigate(`/patent/${id}`);
  };

  // ... rest of component
}
```

---

### Solution 4: Fix Backend CORS for Authorization Header

Your backend might not be allowing the Authorization header in CORS.

**File: `SecurityConfig.java` (Backend)**

Verify this configuration:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOriginPatterns(List.of(
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003"
    ));

    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

    // ✅ CRITICAL: Allow Authorization header
    config.setAllowedHeaders(List.of("*")); // This allows all headers including Authorization

    // ✅ CRITICAL: Expose Authorization header in response
    config.setExposedHeaders(List.of("Authorization", "Content-Type"));

    config.setAllowCredentials(true);
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

---

### Solution 5: Add Loading State to Prevent Multiple Requests

**File: `src/pages/PatentDetailPage.tsx`**

```typescript
export function PatentDetailPage() {
  const { patentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [patent, setPatent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPatent() {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching patent details for:", patentId);

        const response = await api.get(`/patents/${patentId}`);

        if (isMounted) {
          setPatent(response.data);
          console.log("✅ Patent loaded successfully");
        }
      } catch (err) {
        console.error("❌ Failed to fetch patent:", err);

        if (isMounted) {
          setError(err.message);

          // If 401, redirect to login
          if (err.response?.status === 401) {
            console.log("Unauthorized - redirecting to login");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (patentId) {
      fetchPatent();
    }

    return () => {
      isMounted = false;
    };
  }, [patentId]);

  if (isLoading) {
    return <div>Loading patent {patentId}...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {/* Patent details */}
      <EnhancedCitationGraph patentId={patentId} source="PATENTSVIEW" />
    </div>
  );
}
```

---

### Solution 6: Create Auth Context (Best Practice)

Create a global auth context to manage authentication state:

**File: `src/context/AuthContext.tsx`**

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  isTokenExpired,
  clearAuthData,
  getTokenInfo,
} from "../utils/authUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): boolean => {
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || isTokenExpired()) {
      clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      return false;
    }

    setToken(storedToken);
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setIsAuthenticated(true);
    return true;
  };

  const login = (newToken: string, newUser: any) => {
    localStorage.setItem("jwt_token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthData();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
```

**Then wrap your app:**

```typescript
// src/main.tsx or App.tsx
import { AuthProvider } from "./context/AuthContext";

<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>;
```

**Use in CustomPatentNode:**

```typescript
import { useAuth } from "../../context/AuthContext";

export function CustomPatentNode({
  data,
  id,
}: NodeProps<CustomPatentNodeData>) {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuth();

  const handleClick = () => {
    if (data.isRoot) return;

    if (!checkAuth()) {
      navigate("/login");
      return;
    }

    navigate(`/patent/${id}`);
  };

  // ...
}
```

---

## 🧪 Testing Steps

### 1. Check if token exists

```javascript
// In browser console
console.log("Token:", localStorage.getItem("jwt_token"));
console.log("User:", localStorage.getItem("user"));
```

### 2. Test API call manually

```javascript
// In browser console
fetch("http://localhost:8080/api/patents/10006624", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  },
})
  .then((r) => r.json())
  .then((data) => console.log("✅ Success:", data))
  .catch((err) => console.error("❌ Error:", err));
```

### 3. Check network tab

1. Open DevTools → Network tab
2. Click on a citation node
3. Look for the `/api/patents/{id}` request
4. Check:
   - ✅ Status: Should be 200
   - ✅ Request Headers: Should have `Authorization: Bearer ...`
   - ❌ Status 401: Token missing or invalid
   - ❌ Status 403: User doesn't have permission

### 4. Check backend logs

Look for these in your Spring Boot logs:

```
Fetching citation network for patent: 10006624
Patent details retrieved: 10006624
```

If you see:

```
401 Unauthorized
Access Denied
```

Then authentication is failing.

---

## 🎯 Quick Fix Summary

**Most likely issue:** Token expired or missing

**Quick fix:**

1. Log out and log back in
2. Add console.log to see if token exists:
   ```typescript
   console.log("Token:", localStorage.getItem("jwt_token"));
   ```
3. If no token → user not logged in
4. If token exists → might be expired

**Permanent fix:**

- Implement token refresh mechanism
- Add token expiration checking before navigation
- Use AuthContext for global auth state management

---

## 📞 Still Not Working?

If the issue persists, check:

1. ✅ Backend is running on `http://localhost:8080`
2. ✅ Frontend is on `http://localhost:3000` (or 3001/3002/3003)
3. ✅ CORS is configured correctly
4. ✅ User has role `USER`, `ANALYST`, or `ADMIN`
5. ✅ JWT token is not expired
6. ✅ No browser console errors

**Share these debug outputs:**

```typescript
// In CustomPatentNode handleClick
console.log("Node clicked:", { id, data, isRoot: data.isRoot });
console.log("Token exists:", !!localStorage.getItem("jwt_token"));
console.log("Navigating to:", `/patent/${id}`);
```

---

## 🔐 Security Best Practices

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Auth Context**: Use React Context for global auth state
3. **Protected Routes**: Wrap routes with authentication checks
4. **Error Boundaries**: Catch auth errors gracefully
5. **Logout on 401**: Always clear tokens and redirect on unauthorized

---

**Need more help?** Share:

- Browser console logs
- Network tab screenshot
- Backend logs
- Token existence check result
