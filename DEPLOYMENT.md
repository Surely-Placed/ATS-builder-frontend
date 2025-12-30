# Firebase Deployment Guide

## Prerequisites
- Firebase CLI is installed ✅
- Firebase configuration files created ✅
- Project built successfully ✅

## Deployment Steps

### 1. Login to Firebase
Open your terminal and run:
```bash
firebase login
```
This will open a browser window for you to authenticate with your Google account.

### 2. Verify Project
Make sure you're using the correct Firebase project:
```bash
firebase use airesumebuilder-60f9e
```

### 3. Deploy to Firebase Hosting
Once logged in, deploy your project:
```bash
firebase deploy --only hosting
```

### 4. View Your Deployed Site
After deployment, Firebase will provide you with a URL like:
```
https://airesumebuilder-60f9e.web.app
```
or
```
https://airesumebuilder-60f9e.firebaseapp.com
```

## Configuration Files Created

### firebase.json
- Configured to serve from `dist` directory
- Set up SPA routing (all routes redirect to index.html)
- Added cache headers for optimal performance

### .firebaserc
- Project ID: `airesumebuilder-60f9e`

## Environment Variables

Make sure your production environment variables are set in Firebase Hosting:
1. Go to Firebase Console → Hosting → Environment Variables
2. Add your environment variables:
   - `VITE_API_URL` - Your backend API URL
   - Firebase config variables (if using environment-based config)

## Troubleshooting

### If deployment fails:
1. Check that you're logged in: `firebase login:list`
2. Verify project: `firebase projects:list`
3. Check build output: Ensure `dist` folder exists and has content
4. Review Firebase Console for any errors

### Build Optimization
The build shows a warning about large chunks. Consider:
- Code splitting with dynamic imports
- Lazy loading routes
- Tree shaking unused code

## Continuous Deployment

To set up automatic deployments:
1. Connect your GitHub repository to Firebase
2. Enable GitHub Actions or use Firebase CI/CD
3. Configure automatic deployments on push to main branch


