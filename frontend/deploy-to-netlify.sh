#!/bin/bash

# Xprep.in - Quick Netlify Deployment Script
# This script helps you deploy the enhanced Xprep.in to Netlify

echo "🚀 Xprep.in Netlify Deployment Helper"
echo "======================================"
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the frontend directory"
    exit 1
fi

echo "📦 Step 1: Building production version..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"
echo ""

echo "📋 Next Steps:"
echo ""
echo "OPTION 1 - Manual Deployment (Easiest):"
echo "  1. Go to: https://app.netlify.com/sites/subtle-tiramisu-297839/deploys"
echo "  2. Drag and drop the 'build' folder"
echo "  3. Done! ✨"
echo ""

echo "OPTION 2 - Netlify CLI (Recommended):"
echo "  1. Install CLI: npm install -g netlify-cli"
echo "  2. Login: netlify login"
echo "  3. Link site: netlify link (choose 'subtle-tiramisu-297839')"
echo "  4. Deploy: netlify deploy --prod"
echo ""

echo "OPTION 3 - Git Integration:"
echo "  1. Push code to GitHub"
echo "  2. Connect Netlify to your GitHub repo"
echo "  3. Auto-deploy on every push"
echo ""

echo "⚙️  Don't forget to set environment variable in Netlify:"
echo "  REACT_APP_BACKEND_URL = https://ai-xprep.preview.emergentagent.com"
echo ""

echo "📍 Your build is ready at: ./build/"
echo "📖 Full guide available in: ../NETLIFY_DEPLOYMENT_GUIDE.md"
echo ""

read -p "Would you like to open the build folder? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open build/
    elif command -v xdg-open &> /dev/null; then
        xdg-open build/
    else
        echo "📂 Build folder location: $(pwd)/build"
    fi
fi

echo ""
echo "🎉 Ready to deploy! Choose one of the options above."
