# Netlify Deployment Guide for Xprep.in

## 🎯 Overview
This guide will help you deploy the enhanced Xprep.in React frontend to Netlify while keeping the FastAPI backend on Emergent.

## 📋 Prerequisites
- Netlify account (you already have: subtle-tiramisu-297839)
- Netlify CLI installed or use Netlify Dashboard
- Access to your local VSCode project

---

## 🚀 Method 1: Deploy via Netlify Dashboard (Easiest)

### Step 1: Build the Frontend on Emergent

Run these commands on Emergent:

```bash
cd /app/frontend
yarn build
```

This creates a `build` folder with optimized production files.

### Step 2: Download Build Folder

Download the entire `/app/frontend/build` folder from Emergent to your local machine.

### Step 3: Deploy to Netlify

1. Go to https://app.netlify.com/sites/subtle-tiramisu-297839/overview
2. Click on **"Deploys"** tab
3. Drag and drop the `build` folder into the deploy area
4. Wait for deployment to complete

### Step 4: Configure Environment Variables

1. Go to **Site settings** → **Environment variables**
2. Add: `REACT_APP_BACKEND_URL` = `https://ai-xprep.preview.emergentagent.com`
3. Click **Save**
4. Trigger a new deploy

---

## 🚀 Method 2: Deploy via Netlify CLI (Recommended)

### Step 1: Install Netlify CLI (if not installed)

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Link Your Site

```bash
cd /path/to/your/xprep/frontend
netlify link
# Select: "Use existing site"
# Choose: "subtle-tiramisu-297839"
```

### Step 4: Create netlify.toml Configuration

Create `/app/frontend/netlify.toml`:

```toml
[build]
  command = "yarn build"
  publish = "build"
  
[build.environment]
  NODE_VERSION = "18"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Step 5: Configure Environment Variable

Create/Update `/app/frontend/.env.production`:

```env
REACT_APP_BACKEND_URL=https://ai-xprep.preview.emergentagent.com
```

### Step 6: Deploy

```bash
cd /app/frontend
netlify deploy --prod
```

---

## 🚀 Method 3: Deploy from Git Repository (Best for Continuous Deployment)

### Step 1: Push Code to GitHub/GitLab

```bash
cd /path/to/your/xprep
git init
git add .
git commit -m "Enhanced Xprep with AI features"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Connect Netlify to GitHub

1. Go to Netlify Dashboard
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `yarn build`
   - **Publish directory**: `frontend/build`
5. Add environment variable: `REACT_APP_BACKEND_URL`
6. Click **Deploy site**

---

## ⚙️ Important Configuration Files

### netlify.toml (already provided above)

### .env.production
```env
REACT_APP_BACKEND_URL=https://ai-xprep.preview.emergentagent.com
```

### package.json (should have these scripts)
```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

---

## 🔧 Netlify Environment Variables Setup

1. Go to: **Site settings** → **Environment variables**
2. Add these variables:

| Key | Value |
|-----|-------|
| `REACT_APP_BACKEND_URL` | `https://ai-xprep.preview.emergentagent.com` |
| `NODE_VERSION` | `18` |

---

## 🌐 Custom Domain Configuration

Since your site is xprep.in:

1. Go to **Domain settings**
2. Add custom domain: `www.xprep.in` and `xprep.in`
3. Update DNS records:
   - For `xprep.in`: Add A record pointing to Netlify's IP
   - For `www.xprep.in`: Add CNAME record pointing to `subtle-tiramisu-297839.netlify.app`

---

## 🧪 Testing After Deployment

1. Visit: https://subtle-tiramisu-297839.netlify.app or https://xprep.in
2. Test features:
   - Homepage loads correctly
   - Navigate to Mock Interview
   - Check if backend API calls work
   - Test Resume Builder, Job Hunter, etc.

---

## ⚠️ Backend Considerations

Your backend is currently hosted on Emergent at:
`https://ai-xprep.preview.emergentagent.com`

**This is fine for now**, but consider:

### Option A: Keep Backend on Emergent
- ✅ Already working
- ✅ No additional setup needed
- ⚠️ May have rate limits on preview environment

### Option B: Move Backend to Production Service
Consider these platforms for FastAPI + MongoDB:
1. **Render.com** (Recommended)
   - Free tier available
   - Easy FastAPI deployment
   - MongoDB connection support

2. **Railway.app**
   - Simple deployment
   - Good for Python apps

3. **Heroku**
   - Well-established
   - Easy MongoDB integration

4. **MongoDB Atlas** (for database)
   - Free tier: 512MB storage
   - Good for production

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed to Netlify
- [ ] Custom domain configured (xprep.in)
- [ ] Environment variables set correctly
- [ ] Backend API calls working from Netlify
- [ ] All pages loading correctly
- [ ] AI Mock Interview feature tested
- [ ] HTTPS enabled (automatic on Netlify)
- [ ] Mobile responsive design verified

---

## 🆘 Troubleshooting

### Issue: "Failed to load backend API"
**Solution**: Check that `REACT_APP_BACKEND_URL` is set in Netlify environment variables and rebuild the site.

### Issue: "404 on page refresh"
**Solution**: Ensure `netlify.toml` has the redirect rule (see Step 4 in Method 2).

### Issue: "Build fails"
**Solution**: 
1. Check Node version is set to 18
2. Ensure all dependencies are in package.json
3. Check build logs in Netlify dashboard

### Issue: "CORS Error"
**Solution**: Backend needs to allow your Netlify domain in CORS settings. Update backend CORS to include: `https://xprep.in`, `https://www.xprep.in`

---

## 🎉 Success!

Once deployed, your enhanced Xprep.in will be live at:
- **Netlify URL**: https://subtle-tiramisu-297839.netlify.app
- **Custom Domain**: https://xprep.in

With all the new AI features:
- ✅ AI Mock Interview with GPT-4
- ✅ AI Resume Builder
- ✅ AI Job Hunter
- ✅ Interview Questions Bank
- ✅ Career Preparation Modules

---

## 📞 Need Help?

If you encounter issues:
1. Check Netlify build logs
2. Verify environment variables
3. Test backend API directly
4. Check browser console for errors
