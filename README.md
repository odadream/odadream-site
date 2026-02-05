
# oda.dream | Neural Art Interface

![Version](https://img.shields.io/badge/version-1.0.0-emerald)
![Status](https://img.shields.io/badge/status-production-blue)
![Security](https://img.shields.io/badge/security-hardened-purple)

**The Interface for the Digital Subconscious.**

oda.dream is an immersive portfolio and interactive art installation built for the web. It explores the synthesis of biological wetware and digital hardware through a unique "Blossoming Lotus" spatial navigation system.

---

## 🌌 Core Philosophy

The interface rejects traditional linear scrolling in favor of a **spatial graph**. 
- **The Grid**: A 3x3 matrix where context blossoms from the center.
- **The Journey**: Non-linear exploration of artifacts, research, and games.
- **The Esthetics**: A fusion of Cyberpunk, Neuroaesthetics, and Brutalism.

## 🛡️ Security & Stability

This project adheres to strict production standards:

*   **Runtime Safety**: Wrapped in a custom `ErrorBoundary` to catch React render failures and display a thematic fallback UI instead of crashing.
*   **Sanitization**: 
    *   Custom Markdown parser strips dangerous protocols (`javascript:`) from links.
    *   Frontmatter parser blocks prototype pollution attacks (`__proto__`).
*   **Recursion Protection**: Graph traversal algorithms include cycle detection to prevent Stack Overflow errors in complex navigation trees.
*   **Cross-Browser**: Safe navigation checks for older browsers and iOS-specific video handling (`playsInline`).

## 🛠 Technical Architecture

### Stack
*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS + Custom Design Tokens
*   **Motion**: Framer Motion (Orchestration & transitions)
*   **Icons**: Lucide React

### Content-as-Code (CMS)
The site creates its structure dynamically at build time:
1.  **Source**: Markdown files in `src/content/` serve as the database.
2.  **Parsing**: YAML Frontmatter defines the node topology (Parent/Child relationships).
3.  **Graph**: The app builds a unified directed graph from these files.
4.  **Assets**: `scripts/generate-assets.js` procedurally generates SVG backgrounds for any missing media, ensuring the site never looks broken.

## 🚀 Deployment

### Prerequisites
*   Node.js v18+
*   npm or yarn

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Generate procedural assets (Crucial for first run)
npm run assets:generate

# 3. Start the neural interface
npm run dev
```

### Production Build
```bash
npm run build
# Output located in /dist
```

## 📂 Project Structure

*   `src/content/` - **The Brain**. All text, logic, and structure definition resides here.
*   `src/components/` - **The Body**. React components (LotusGrid, Lightbox, TextPanel).
*   `src/styles/` - **The Skin**. Tailwind theme configuration and animation constants.
*   `src/utils/` - **The Nervous System**. Parsers, graph algorithms, and security helpers.

---

**© 2024 oda.dream** | *Silicon & Synapse*
