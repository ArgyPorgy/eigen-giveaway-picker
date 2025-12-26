# Privy Authentication Setup

## Fixing redirect_uri_mismatch Error

The `Error 400: redirect_uri_mismatch` occurs when the redirect URI configured in Privy doesn't match your application's URL.

## Steps to Fix

### 1. Get Your Privy App ID
- Go to https://dashboard.privy.io
- Sign in or create an account
- Create a new app or select your existing app
- Copy the **App ID** (starts with `cl...`)

### 2. Configure Redirect URIs in Privy Dashboard

In your Privy dashboard, navigate to your app settings and add these redirect URIs:

#### For Local Development:
```
http://localhost:8080
http://localhost:8080/auth/callback
http://localhost:5173
http://localhost:5173/auth/callback
```

#### For Production (if deployed):
```
https://your-domain.com
https://your-domain.com/auth/callback
```

### 3. Update Your .env File

Add your Privy App ID:
```bash
VITE_PRIVY_APP_ID=clxxxxxxxxxxxxx
```

### 4. Configure OAuth Providers

In Privy Dashboard → Authentication → OAuth:

1. **Enable Google OAuth:**
   - Click "Configure" next to Google
   - Follow the OAuth setup instructions
   - Make sure the redirect URI in Google Cloud Console matches Privy's callback URL

2. **Google Cloud Console Setup:**
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials → Create OAuth 2.0 Client ID
   - Authorized redirect URIs should include:
     ```
     https://auth.privy.io/api/v1/oauth/google/callback
     ```

### 5. Quick Fix for Development

If you just want to test locally without Google OAuth:

1. In `src/providers.tsx`, you can temporarily remove Google from login methods:
   ```typescript
   loginMethods: ['email', 'wallet'], // Remove 'google'
   ```

2. Or test with email/wallet login first, then add Google OAuth later

### 6. Verify Configuration

After updating:
1. Restart your dev server: `npm run dev`
2. Clear browser cache/cookies for localhost
3. Try signing in again

## Common Issues

### Issue: Still getting redirect_uri_mismatch
- **Solution**: Check that your current URL (from browser address bar) exactly matches one of the redirect URIs in Privy dashboard
- Make sure there's no trailing slash mismatch
- Check if you're using `http://` vs `https://`

### Issue: Google OAuth not appearing
- **Solution**: Verify Google OAuth is enabled in Privy dashboard
- Check that `VITE_PRIVY_APP_ID` is set correctly
- Ensure Google Cloud Console credentials are configured

### Issue: Works locally but not in production
- **Solution**: Add your production domain to Privy redirect URIs
- Update Google Cloud Console with production callback URL

## Testing Without Google OAuth

For quick development, you can use:
- **Email/Password**: No additional setup needed
- **Wallet**: Works with MetaMask, WalletConnect, etc.

To use only these methods, update `src/providers.tsx`:
```typescript
loginMethods: ['email', 'wallet'],
```

