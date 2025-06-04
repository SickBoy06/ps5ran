# PS5 Reseller Dashboard

Manage your PlayStation 5 inventory with a modern, dark-blue UI and a slick 4-step **MultistepInventoryModal** wizard.

---

## 🖥️ Quick Start (Windows 10/11 PowerShell)

```powershell
# 1) Clone the repo **including** sub-folders
PS> git clone https://github.com/SickBoy06/ps5ran.git
PS> cd ps5ran               # enter the project folder

# 2) Verify prerequisites
PS> node -v                 # should print v18.x  or newer
PS> npm -v                  # should print 9.x   or newer
PS> git --version           # should print 2.x  or newer

# 3) Install dependencies  (creates node_modules\ )
PS> npm install

# 4) Start the dev-server  (runs on http://localhost:3000)
PS> npm run dev
```

> The first run may trigger a Windows Firewall pop-up for **Vite** – click *Allow access*.

---

## 📝 What You’ll See

1. PowerShell prints:
   ```
   VITE v4.x  ready in 200 ms
   ➜  Local:   http://localhost:3000/
   ```
2. A browser tab opens the **PS5 Dashboard**.
3. Click **“Add New PS5”** to open the animated 4-step modal.
4. Required fields (Steps 1–2) must be filled before *Next* activates.
5. The live card on the left updates instantly as you type.

---

## ⚙️ Detailed Setup Guide

| Step | Command (PowerShell) | Explanation |
|------|----------------------|-------------|
| Clone repo | `git clone https://github.com/SickBoy06/ps5ran.git` | Downloads all source files |
| Enter dir | `cd ps5ran` | Move into project root (contains `package.json`) |
| Install deps | `npm install` | Fetches **React**, **Vite**, **Tailwind**, etc. |
| Run dev | `npm run dev` | Starts Vite hot-reload server |
| Build prod | `npm run build` | Outputs static files to `dist\` |
| Preview build | `npm run preview` | Serves the bundle on `http://localhost:4173` |

---

## ❓ Troubleshooting

| Symptom | Fix |
|---------|-----|
| **ENOENT: package.json not found** | Make sure you ran `cd ps5ran` **inside the cloned folder** before `npm install`. |
| **Port 3000 already in use** | `npm run dev -- --port 3001` |
| **PostCSS / “module is not defined”** | You’re on Node < 18 or renamed `postcss.config.js`. Upgrade Node or keep file as **ESM** (`export default {}` syntax). |
| **Tailwind classes missing** | Stop dev server, then `npm run dev` again after editing `tailwind.config.js`. |
| **Firewall prompt** | Allow access – Vite needs local network permission to serve HMR files. |

---

## 📦 Production Deploy

```powershell
# build optimized bundle
PS> npm run build    # → dist\

# preview locally (optional)
PS> npm run preview  # http://localhost:4173
```

Upload the contents of **dist\\** to any static host (Vercel, Netlify, GitHub Pages, S3, …).

---

## 🧩 Customising

| Want to… | File |
|----------|------|
| Change profit formula | `src/components/MultistepInventoryModal.tsx → calculateEstimatedProfit()` |
| Tweak colours | `tailwind.config.js` (`extend.colors`) |
| Add fields to wizard | Edit step components inside `MultistepInventoryModal.tsx` |
| Replace icons | Use any `lucide-react` icon, e.g. `import { Gamepad } from "lucide-react"` |

---

## ✔️ Checklist Before You Ask for Help

1. ✅ Ran **git clone** successfully  
2. ✅ `cd` into the cloned folder (you can see `package.json`)  
3. ✅ **Node 18+** and **npm 9+** installed (`node -v`, `npm -v`)  
4. ✅ `npm install` completed without errors  
5. ✅ `npm run dev` shows the Vite banner and a local URL  

If all five are true, the dashboard should be live at <http://localhost:3000>. Happy reselling!
