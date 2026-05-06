# MongoDB Authentication Troubleshooting

## Current Issue
❌ MongoDB connection failing with: `bad auth : authentication failed`

The password provided does not match the one in MongoDB Atlas.

---

## Solution Steps

### Step 1: Reset MongoDB User Password

1. Go to **MongoDB Atlas** → **Database Access**
2. Find user: `vineethvarma999_db_user`
3. Click the **Edit** button (pencil icon)
4. Click **Edit Password**
5. **Copy the auto-generated password** (click the copy icon)
6. Update it in Railway:

```bash
railway variables set MONGODB_URI="mongodb+srv://vineethvarma999_db_user:YOUR_NEW_PASSWORD@finance-tracker.ycsjrfw.mongodb.net/?appName=finance-tracker"
```

Replace `YOUR_NEW_PASSWORD` with the actual password from MongoDB Atlas.

---

### Step 2: Verify Network Access

1. Go to **MongoDB Atlas** → **Network Access**
2. Check if `0.0.0.0/0` (Allow from anywhere) is enabled
3. If not, click **Add IP Address** → **Allow Access from Anywhere**
4. Click **Confirm**

*Note: For production, restrict to Railway's specific IP. For now, "anywhere" allows testing.*

---

### Step 3: Check Database User Permissions

1. In **Database Access**, find user `vineethvarma999_db_user`
2. Scroll down to **Database User Privileges**
3. Ensure it has at least **Read and write to any database**
4. If permissions are limited, update them

---

### Step 4: Test Connection After Changes

After updating the password, wait 1-2 minutes for MongoDB Atlas to propagate changes, then run:

```bash
cd backend
node test-connection.js
```

If successful, you'll see: ✅ MongoDB connected successfully

---

### Step 5: Redeploy Backend

Once connection works locally, Railway will auto-redeploy. Check status:

```bash
railway logs
```

Look for: `✅ MongoDB connected`

---

## Quick Reference

**Current Connection String Format:**
```
mongodb+srv://vineethvarma999_db_user:PASSWORD@finance-tracker.ycsjrfw.mongodb.net/?appName=finance-tracker
```

**What to verify:**
- [ ] Username: `vineethvarma999_db_user` ✅
- [ ] Host: `finance-tracker.ycsjrfw.mongodb.net` ✅  
- [ ] Database: `finance-tracker` (created automatically)
- [ ] Password: **NEEDS UPDATE** ❌
- [ ] Network Access: `0.0.0.0/0` enabled
- [ ] User Permissions: Read/Write enabled

---

## If Password Contains Special Characters

If the new password contains special characters (%, @, &, etc.), URL-encode them:
- `%` → `%25`
- `@` → `%40`
- `&` → `%26`
- `:` → `%3A`

Example: Password `test@123` becomes `test%40123`

---

## Still Not Working?

If the connection still fails after these steps:

1. **Double-check the password** - Copy it directly from MongoDB Atlas without typos
2. **Check database name** - Should be `finance-tracker` 
3. **Wait 2-3 minutes** - MongoDB Atlas changes can take time to propagate
4. **Try deleting and recreating the user** with a new password

---

## Testing Endpoint

Once MongoDB connects, test with:
```bash
curl -X POST https://agile-sparkle-production-a245.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123456","passwordConfirm":"Test123456"}'
```

Should return: `{"status":"success",...}` instead of 502 error

---

**Last updated**: 2026-05-06
**Status**: Waiting for password reset in MongoDB Atlas
