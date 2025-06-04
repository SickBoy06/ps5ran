# PS5 Reseller Dashboard – **Windows Setup**

*This mini-guide is for Windows 10 / 11 PowerShell users who hit the `ENOENT: package.json not found` error.*

---

## 1  Install prerequisites

| Tool | Minimum | Check with |
|------|---------|------------|
| **Node .js** | v18+ | `node -v` |
| **npm**      | v9+  | `npm -v`  |
| **Git**      | v2+  | `git --version` |

> If a command is “not recognized”, download & install the missing tool first.

---

## 2  Clone the repository

```powershell
# open the folder where you want the project
PS> cd C:\Users\<you>\Desktop

# clone
PS> git clone https://github.com/SickBoy06/ps5ran.git
```

A new folder **ps5ran** now exists and already contains **package.json**.

---

## 3  Enter the folder **before** running npm

```powershell
PS> cd ps5ran          # 🔑 most common mistake → forget this!
PS ps5ran> dir package.json
```

You should see the file listed.  
If **dir** shows *File Not Found* you are still in the wrong directory → `cd ps5ran`.

---

## 4  Install dependencies

```powershell
PS ps5ran> npm install
```

• First run takes ~1 min (creates **node_modules\\**).  
• **No red** errors should appear.

---

## 5  Start the development server

```powershell
PS ps5ran> npm run dev
```

Expected console output:

```
VITE v4.x  ready in xxx ms
➜  Local:   http://localhost:3000/
```

A browser tab may **not** open automatically – copy the URL into Chrome/Edge if needed.

---

## 6  View the dashboard

Open `http://localhost:3000` in your browser.

1. Click **Add New PS5** to launch the 4-step modal.  
2. Fill **required** fields in Steps 1–2.  
3. Enjoy real-time updates in the left “Live Card”.

Stop the server anytime with **Ctrl + C** inside PowerShell.

---

## 7  Common mistakes & fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `ENOENT: package.json not found` after `npm install` | You ran npm in the parent directory | `cd ps5ran` **first** |
| PowerShell says “npm : The term 'npm' is not recognized” | Node/npm not installed or PATH not updated | Re-install Node from <https://nodejs.org> and reopen PowerShell |
| Port 3000 already in use | Another program uses it | `npm run dev -- --port 3001` |
| Windows firewall popup on first run | Vite dev-server listening | Click **Allow access** |
| Strange PostCSS “module is not defined” error | Using Node <18 or edited `postcss.config.js` incorrectly | Upgrade Node & keep `postcss.config.js` with `export default {}` syntax |

---

## 8  Building for production

```powershell
PS ps5ran> npm run build      # outputs static site to dist\
PS ps5ran> npm run preview    # test build at http://localhost:4173
```

Upload **dist\\** to Netlify, Vercel, GitHub Pages or any static host.

---

That’s it – happy selling!
