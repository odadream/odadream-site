# ODA.dream | Wellness Art Tech

![Version](https://img.shields.io/badge/version-1.1.0-emerald)
![Status](https://img.shields.io/badge/status-production-blue)
![Engine](https://img.shields.io/badge/engine-react_19-cyan)

**The Interface for the Digital Subconscious.**

ODA.dream is an immersive portfolio and interactive art installation built for the web. It explores the synthesis of biological wetware and digital hardware through a unique "Blossoming Lotus" spatial navigation system.

---

## 📚 Table of Contents

1.  [Quick Start](#-quick-start)
2.  [Content Management (CMS)](#-content-management-cms)
    - [Creating Nodes](#creating-nodes)
    - [Media Syntax](#media-syntax)
    - [Project Structure](#project-structure)
3.  [Theming System](#-theming-system)
    - [Architecture](#architecture)
    - [How to Add a Theme](#how-to-add-a-theme)
4.  [Scripts & Utilities](#-scripts--utilities)
5.  [Deployment](#-deployment)

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/oda-dream.git

# 2. Install dependencies
npm install

# 3. Generate procedural assets (Critical step!)
# Creates SVG backgrounds for nodes to prevent visual glitches
npm run assets:generate

# 4. Start Development Server
npm run dev
```

---

## 📝 Content Management (CMS)

The site uses a **File-Based CMS**. The database consists of Markdown files located in `src/content/`.
The logic automatically builds a directed graph (The Lotus) based on the Frontmatter headers in these files.

### Creating Nodes

To create a new page or hub, create a `.md` file in `src/content/` (e.g., `my-new-page.md`).

**Frontmatter Schema:**

```yaml
---
id: my-page-id          # Unique ID (Required). Used in URLs (?id=my-page-id)
parent: home            # ID of the parent node. 'home' is the root.
title_en: My Page       # English Title
title_ru: Моя Страница  # Russian Title
type: content           # 'hub' (folder), 'content' (article), 'action' (link), 'media'
tags: [art, code]       # Keywords displayed in the footer
date: 2024.03.20        # Last modified date
order: 1                # (Optional) Sort order in the grid (0-8)
---

## CONTENT BODY (ENGLISH)
Write your content here using Markdown.

---RU---

## ТЕЛО КОНТЕНТА (РУССКИЙ)
Текст на русском языке пишется после разделителя.
```

### Node Types

- **`hub`**: A navigation folder. Displays its children in the Lotus Grid. Icon: Layers.
- **`content`**: A leaf node. Displays text in the reading panel. Icon: FileText.
- **`media`**: Opens a full-screen Lightbox immediately. Icon: Film/Image.
- **`action`**: A node that executes a script or opens an external link.

### Media Syntax

We support standard Markdown images and a custom "Wiki-Link" syntax for advanced media embedding (Video, Audio, YouTube).

| Type              | Syntax                              | Description                              |
| :---------------- | :---------------------------------- | :--------------------------------------- |
| **Standard**      | `![Alt Text](/path/to/image.jpg)`   | Standard image embedding.                |
| **Wiki (Simple)** | `![[ https://site.com/video.mp4 ]]` | Embeds video/audio player automatically. |
| **Wiki (Poster)** | `![[ url \| title \| poster_url ]]` | Embeds video with a custom cover image.  |

**Example:**

```markdown
![[https://my-bucket.com/video.mp4 | My Art Piece | /images/covers/cover.jpg]]
```

---

## 🎨 Theming System

The interface uses a CSS Variables approach for theming, controlled by `src/index.css` and React Context.

### Architecture

Themes are defined as data attributes on the `<html>` tag (e.g., `data-theme="dark"`).
The colors are semantic variables (e.g., `--color-canvas`, `--color-hud`).

### How to Add a Theme

1.  **Define Colors**: Open `src/index.css` and add a new block:

    ```css
    [data-theme="my-new-theme"] {
      --color-canvas: 20 20 20; /* Background RGB */
      --color-surface: 30 30 30; /* Grid Cell RGB */
      --color-hud: 255 255 255; /* Primary Text RGB */
      --color-accent: 255 0 128; /* Highlight/Laser RGB */
      /* ... copy other vars from existing themes ... */
    }
    ```

2.  **Register Type**: Open `src/types.ts` and add the name to the `Theme` type:

    ```typescript
    export type Theme = "dark" | "light" | "ocean" | "matrix" | "my-new-theme";
    ```

3.  **Update Logic**: Open `src/context/NavigationContext.tsx` and add it to the cycle array:

    ```typescript
    const sequence: Theme[] = [
      "dark",
      "light",
      "ocean",
      "matrix",
      "my-new-theme",
    ];
    ```

4.  **Enable Switcher**: Ensure the toggle button is visible in `src/constants.ts`:
    ```typescript
    export const ENABLE_THEME_SWITCHER = true;
    ```

---

## 🛠 Scripts & Utilities

Automation tools located in `scripts/`.

### `npm run assets:generate`

- **Purpose**: Procedurally generates SVG backgrounds for all nodes defined in `src/content`.
- **Why**: Ensures every node has a unique, high-fidelity cover image even if you haven't designed one manually.
- **Style**: Uses the "Vibrant Art Engine" (Noise, gradients, geometric primitives).

### `npm run assets:clean`

- **Purpose**: Deletes all generated assets. Use this if you want to regenerate the visual style from scratch.

### `npm run assets:map`

- **Purpose**: Generates a `CONTENT_TREE.md` file in the `scripts/` folder.
- **Why**: Provides a visual tree of your site structure and a manifest of all used media files. Useful for debugging "Orphaned" nodes (nodes with invalid parents).

---

## 🚢 Deployment

The project is configured for static hosting (GitHub Pages, Vercel, Netlify).

### Build for Production

```bash
npm run build
```

This command:

1.  Generates assets.
2.  Compiles TypeScript.
3.  Builds the Vite bundle to the `dist/` folder.

### GitHub Pages (Automated)

A workflow is included in `.github/workflows/deploy.yml`.

1.  Push code to the `main` branch.
2.  GitHub Actions will automatically build and deploy to your Pages URL.

### Manual Deployment

Upload the contents of the `dist/` folder to any static file server.

- **Note**: Ensure your server handles `index.html` fallback for SPA routing if you use deep links (though this app relies primarily on query params `?id=`, which works universally).

---

**© 2018 - 2026 ODA.dream** | _Wellness Art Tech_
