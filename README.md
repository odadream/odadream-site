# oda.dream | Neural Art Interface

Interactive immersive platform for the creative duo oda.dream.
**Version:** 4.0.3

## 🔄 1. WORKFLOW: Updating from Archive (AI Export)

This is the primary workflow when you receive a new project version as a ZIP archive.

### Step 1: Download & Unzip

Download the ZIP file and extract it to a temporary location (e.g., `Downloads/oda-v5`).

### Step 2: Sync with Local Repository

Use the included script to safely update your Git repository. This script removes old files, copies new ones, but preserves critical system files (`.git`, `node_modules`, `.env`).

Open your terminal and run:

```bash
# Syntax: node <PATH_TO_SCRIPT> <SOURCE_FOLDER> <TARGET_REPO>
# Example:
node scripts/update-repo.js "C:/Downloads/oda-v5" "D:/Projects/oda-dream"
```

_The script will automatically perform `git add .` and `git commit`._

### Step 3: Install Dependencies (If needed)

If `package.json` was changed in the update, run:

```bash
npm install
```

### Step 4: Local Test (Optional)

To verify everything works before pushing:

```bash
npm run dev
```

### Step 5: Push to GitHub

Since the script already committed the changes, you just need to push:

```bash
git push origin main
```

---

## 🚀 2. DEPLOYMENT (GitHub Pages)

Deployment is **fully automated**. You do not need to build the site manually for production.

### What happens when you `git push`?

1.  **Trigger**: GitHub detects a push to the `main` branch.
2.  **Action**: It starts the workflow defined in `.github/workflows/deploy.yml`.
3.  **Server-Side Build**:
    - It installs dependencies (`npm install`).
    - It executes `npm run build`.
    - **Crucial**: Inside `npm run build`, it runs `npm run assets:generate`. This ensures all procedural SVG backgrounds are generated fresh on the server.
    - It compiles the React code using Vite.
4.  **Deploy**: The resulting `dist` folder is uploaded to GitHub Pages.

_Process takes approximately 1-2 minutes._

---

## 🛠 3. LOCAL DEVELOPMENT

If you are manually editing code or content without downloading a new archive.

### Setup

```bash
npm install
```

### Generate Assets

The project uses procedural code to create the abstract backgrounds for nodes. If images are missing:

```bash
npm run assets:generate
```

### Start Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view.

---

## 📚 4. CONTENT MANAGEMENT (CMS)

To add new pages or edit text, you modify two files:

### A. `src/content.ts` (The Text)

Contains the Markdown text for English and Russian.

```typescript
export const my_new_page_md = txt(
  `## EN Title\nContent...`,
  `## RU Title\nКонтент...`,
);
```

### B. `src/constants.ts` (The Graph)

Defines where the node appears in the Lotus Grid.

```typescript
createNode(
  "unique-id", // ID used in URL
  "Title EN",
  "Title RU",
  Content.my_new_page_md, // Link to text content
  "content", // Type: 'hub' | 'content' | 'media' | 'action'
  [], // Children (if it's a hub)
  true, // Visible?
);
```

### Media Syntax in Markdown

To display images/video inside the text panel that also show up in the grid:

- **Video**: `![[https://site.com/video.mp4]]`
- **Image**: `![[https://site.com/image.jpg]]`

---

## 📂 PROJECT STRUCTURE

```
.
├── .github/workflows/   # CI/CD Configuration
├── components/          # React UI Components
│   ├── LotusGrid.tsx    # 3x3 Grid Logic
│   ├── TextPanel.tsx    # Markdown Renderer
│   └── ...
├── scripts/             # Automation Scripts
│   ├── generate-assets.js # Creates SVGs in public/images
│   └── update-repo.js     # Syncs ZIP archives to Git repo
├── src/
│   ├── constants.ts     # Site Structure Configuration
│   ├── content.ts       # Text Content
│   ├── index.css        # Global Styles (Tailwind imports)
│   └── ...
├── public/              # Static Assets
├── index.html           # Entry HTML
├── package.json         # Dependencies & Scripts
├── tailwind.config.js   # Style Configuration
└── vite.config.ts       # Build Configuration
```

## 🎨 TECH STACK

- **Vite**: Build Tool
- **React 18**: Core Framework
- **TypeScript**: Logic
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
