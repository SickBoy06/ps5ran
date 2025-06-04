# PS5 Reseller Dashboard

A modern, elegant inventory management web app for PlayStation 5 resellers.  
It ships with a **MultistepInventoryModal** that lets you add new consoles through a slick four-step wizard and see a live, always-visible summary card in real time.

![Hero](./docs/screens/hero-dark.png)

---

## ✨ Features
| Area | Highlights |
|------|------------|
| Multistep wizard | 4 steps (Basic Info → Device Details → Condition → Accessories & Notes) with validation & animated transitions |
| Live-Card | Real-time summary panel (+ progress bar, profit estimation) – always visible |
| Design system | Tailwind CSS + shadcn/ui + Lucide icons, dark-blue “PS5” theme |
| Animations | Framer-Motion page/element transitions, accessory pulse effect |
| State management | React Hooks, type-safe with TypeScript |
| Build | Vite for ultra-fast dev & prod builds |

---

## 🛠 Technology Stack
- **React 18** + **TypeScript**
- **Vite** (dev-server & bundler)
- **Tailwind CSS** (+ tailwindcss-animate)
- **shadcn/ui** (Radix UI primitives)
- **Framer Motion** (animations)
- **Lucide-react** (icon set)
- **date-fns** (date utils)

---

## ⚡ Prerequisites
| Requirement | Version |
|-------------|---------|
| Node.js | ≥ 18 |
| npm (or pnpm / yarn) | ≥ 9 |
| Git | for cloning |

> 💡 Check your versions with `node -v` and `npm -v`.

---

## 🚀 Installation & Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/ps5-dashboard.git
cd ps5-dashboard

# 2. Install dependencies
npm install        # or pnpm install / yarn

# 3. Start the dev server
npm run dev
```

Vite will compile in a few hundred ms and print a local URL (default `http://localhost:3000`). Open it in your browser:

```
➜  Local:   http://localhost:3000/
```

---

## 📦 Production Build

```bash
# generate an optimized production bundle
npm run build

# (optional) preview the build locally
npm run preview
```

The static site is output to `dist/`. Deploy it to any static host (Netlify, Vercel, GitHub Pages, S3, …).

---

## 🗂 Project Structure

```
ps5-dashboard/
├─ public/              # static assets (favicon, svg)
├─ src/
│  ├─ assets/           # images, icons
│  ├─ components/
│  │  ├─ ui/            # shadcn/ui wrappers (Button, Dialog…)
│  │  └─ MultistepInventoryModal.tsx
│  ├─ lib/              # utility helpers (cn.ts, class helpers)
│  ├─ styles/           # global Tailwind styles
│  ├─ hooks/            # custom hooks (future)
│  ├─ App.tsx           # demo dashboard page
│  └─ main.tsx          # Vite entry point
├─ tailwind.config.js   # theme + plugin config
├─ vite.config.ts       # Vite build config
└─ README.md
```

---

## 🖼 Screenshots / UI Tour

| Step | Preview |
|------|---------|
| Dashboard with empty state | `docs/screens/dashboard-empty.png` |
| Multistep modal – Basic Info | `docs/screens/modal-step1.png` |
| Live-Card summary | `docs/screens/livecard.png` |
| Accessories pulse-select | `docs/screens/accessories.gif` |

<sub>_Add screenshots to `docs/screens` to see them here._</sub>

---

## 🎯 Using the MultistepInventoryModal

1. Open `App.tsx` (demo) or import the component into your own page:

   ```tsx
   import MultistepInventoryModal from "@/components/MultistepInventoryModal";
   ```

2. Control it via the `open` prop and callback handlers:

   ```tsx
   const [open, setOpen] = useState(false);

   <MultistepInventoryModal
     open={open}
     onOpenChange={setOpen}
     onSave={(item) => /* persist item */}
     onSaveAsDraft={(item) => /* persist draft */}
   />
   ```

3. Clicking **“Add New PS5”** opens the modal.  
   Fill required fields (steps 1–2), optional fields (3–4) and either:
   - **Save as draft** (keeps it as incomplete)
   - **Add Inventory Item** (adds to list if required data complete)

---

## 🧩 Customization

| What | Where |
|------|-------|
| Theme colors | `tailwind.config.js` (`extend.colors`) |
| Profit algorithm | `MultistepInventoryModal.tsx → calculateEstimatedProfit()` |
| Additional form fields | Extend step components inside the modal |
| Global styles | `src/styles/globals.css` |

---

## 🛠 Troubleshooting

| Issue | Fix |
|-------|-----|
| `ERR ESM: module is not defined` (PostCSS) | Ensure `postcss.config.js` uses `export default {}` syntax |
| Port 3000 already in use | `npm run dev -- --port=3001` |
| Tailwind classes not applied | Restart dev-server after editing `tailwind.config.js`; purge paths must include new folders |
| Icons missing | Verify `lucide-react` installed & import names correct |
| Browser doesn’t open automatically | Vite default is to print URL; open manually |

---

## 📄 License
MIT © 2025 Your Name / Company
