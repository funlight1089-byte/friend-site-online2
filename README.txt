This version is for a real online counter on Netlify.

Files:
- index.html
- style.css
- netlify/functions/presence.mjs
- package.json
- netlify.toml

Recommended deploy method:
1. Put this folder in a GitHub repo.
2. In Netlify choose "Import from Git".
3. Select this repo and deploy.

Why not the old drag-and-drop static folder:
- a true online counter needs Netlify Functions + Blobs.
- the simple static site alone cannot count real live visitors.
