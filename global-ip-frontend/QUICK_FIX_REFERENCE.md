# 🚑 Quick Fix Reference - Citation Node Login Redirect

## 🔍 Quick Diagnosis

### Check in Browser Console:

```javascript
// Is user authenticated?
localStorage.getItem("jwt_token") ? "✅ Has token" : "❌ No token";
```

### Common Scenarios:

| Symptom              | Cause          | Fix                     |
| -------------------- | -------------- | ----------------------- |
| Immediate redirect   | No token       | Log in                  |
| Redirect after delay | Token expired  | Log in again            |
| 401 error in console | Token invalid  | Clear storage, log in   |
| CORS error           | Backend config | Fix SecurityConfig.java |

---

## ⚡ Quick Fixes

### Fix 1: Clear and Re-login

```javascript
// In browser console
localStorage.clear();
window.location.href = "/login";
```

### Fix 2: Check Token Manually

```javascript
// In browser console
const token = localStorage.getItem("jwt_token");
console.log("Token exists:", !!token);
console.log("Token preview:", token?.substring(0, 50));
```

### Fix 3: Test API Directly

```javascript
// In browser console
fetch("http://localhost:8080/api/patents/10006624", {
  headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
})
  .then((r) => (r.status === 200 ? "✅ Works" : `❌ Status: ${r.status}`))
  .then(console.log);
```

---

## 🎯 Files to Check

### 1. CustomPatentNode.tsx

```typescript
// Should have this check:
if (!isAuthenticated()) {
  navigate("/login");
  return;
}
```

### 2. api.ts

```typescript
// Should add token to requests:
config.headers.Authorization = `Bearer ${token}`;
```

### 3. SecurityConfig.java (Backend)

```java
// Should allow your frontend URL:
config.setAllowedOriginPatterns(List.of(
    "http://localhost:3000" // ← Your port
));
```

---

## 🐛 Debug Mode

### Add to App.tsx:

```typescript
import { AuthDebugPanel } from "./components/AuthDebugPanel";

// In component:
{
  process.env.NODE_ENV === "development" && <AuthDebugPanel />;
}
```

### Watch Console Logs:

- `🌐 API Request:` - Every API call
- `✅ Navigating to patent:` - Successful navigation
- `⚠️ User not authenticated` - Auth check failed
- `❌ Token expired` - Need to re-login

---

## ✅ Success Checklist

When clicking a citation node, you should see:

1. ✅ Console: `✅ Navigating to patent: {id}`
2. ✅ Console: `🌐 API Request: { hasToken: true }`
3. ✅ Network: Status 200
4. ✅ Network: Request has `Authorization: Bearer ...`
5. ✅ Page loads with patent details

---

## 🔧 Most Common Fix

**90% of issues are solved by:**

1. Log out
2. Clear localStorage: `localStorage.clear()`
3. Log back in
4. Test again

---

## 📞 Still Broken?

Check these in order:

1. [ ] Backend running? (`http://localhost:8080`)
2. [ ] Logged in? (Check localStorage for `jwt_token`)
3. [ ] Token valid? (Not expired)
4. [ ] CORS configured? (Check SecurityConfig.java)
5. [ ] Role correct? (USER, ANALYST, or ADMIN)

---

## 🎓 Understanding the Flow

```
Click Node → Check Auth → Navigate → API Call → Show Patent
            ↓
            If not auth → Alert → Login

            ↓
            API Call
            ↓
            If 401 → Clear Token → Login
```

---

**TL;DR:** Most issues = expired token. Solution = log in again. 🔐
