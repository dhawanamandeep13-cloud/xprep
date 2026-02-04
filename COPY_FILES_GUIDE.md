# 📋 Files to Copy to Your Local VSCode for Netlify Deployment

## 🎯 Quick Solution: Just Copy These Key Files

### Method 1: Copy Only New/Modified Files to Your Existing xprep.in Project

Copy these files from Emergent to your local VSCode xprep project:

---

## 📁 New Files Created (Copy These):

### 1. Frontend Pages (in `src/pages/`)
```
src/pages/Home.js
src/pages/MockInterview.js
src/pages/ResumeBuilder.js
src/pages/JobHunter.js
src/pages/QuestionsBank.js
src/pages/Modules.js
```

### 2. Components (in `src/components/`)
```
src/components/Navbar.js
src/components/Footer.js
```

### 3. Services (NEW folder)
```
src/services/api.js
```

### 4. Mock Data
```
src/mockData.js
```

### 5. Configuration Files (in root of frontend/)
```
netlify.toml
.env.production
DEPLOY_README.md
```

### 6. Updated Files (Replace these)
```
src/App.js
src/App.css
```

---

## 🚀 Step-by-Step: Copy to Your Local VSCode

### Step 1: Open Both Projects
1. **Emergent** - Keep this browser tab open
2. **VSCode** - Open your local xprep.in project

### Step 2: Create Missing Folders
In your VSCode terminal:
```bash
cd xprep/frontend
mkdir -p src/pages src/services
```

### Step 3: Copy Files One by One

I'll display each file content for you to copy. Let me start with the most important ones:

---

## 📄 FILE 1: netlify.toml
**Location:** `frontend/netlify.toml`
**Action:** Create new file

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

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 📄 FILE 2: .env.production
**Location:** `frontend/.env.production`
**Action:** Create new file

```env
REACT_APP_BACKEND_URL=https://ai-xprep.preview.emergentagent.com
```

---

## 📄 FILE 3: .env (for local development)
**Location:** `frontend/.env`
**Action:** Create/Update

```env
REACT_APP_BACKEND_URL=https://ai-xprep.preview.emergentagent.com
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

---

## ✨ Easiest Alternative: Use Git Clone

If copying files is tedious, here's the fastest way:

### Option A: Download from Emergent as ZIP
1. In Emergent, look for a "Download" or "Export" option
2. Download the entire `/app/frontend` folder
3. Extract to your local machine
4. Replace your existing frontend folder

### Option B: Use Code Export Feature
1. If Emergent has a code export feature, use that
2. This will give you all files at once

---

## 🎯 Quick Checklist After Copying:

- [ ] Copied netlify.toml to frontend/
- [ ] Copied .env.production to frontend/
- [ ] Copied all src/pages/*.js files
- [ ] Copied src/components/Navbar.js and Footer.js
- [ ] Copied src/services/api.js
- [ ] Copied src/mockData.js
- [ ] Updated src/App.js
- [ ] Updated src/App.css

---

## 🏗️ Build and Deploy:

Once all files are copied to your local VSCode:

```bash
cd frontend
yarn install  # Install dependencies
yarn build    # Build for production
```

Then:
1. Go to https://app.netlify.com/sites/subtle-tiramisu-297839/deploys
2. Drag & drop the `build` folder
3. Done! ✨

---

## 🆘 Still Having Issues?

Let me know which specific file you need, and I'll provide its exact content for you to copy-paste!
