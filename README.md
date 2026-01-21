# oda.dream | Digital Art Interface

Interactive immersive platform for the creative duo oda.dream, utilizing the Blossoming Lotus methodology for navigation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Important:** Download local assets (images).
   The project is configured to use local images located in `public/images`. This command scrapes the placeholder images used in the prototype and saves them locally.
   ```bash
   npm run assets:download
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Project Structure

Currently, the source files are located in the root. A recommended optimization for the future is to move source code into `src/` to separate config from logic.

```
.
├── public/              # Static assets (images, fonts)
│   └── images/          # Created by npm run assets:download
├── components/          # React UI components
│   ├── LotusGrid.tsx    # The 3x3 interactive grid
│   ├── TextPanel.tsx    # The text content viewer
│   └── ...
├── utils/               # Helper functions
├── styles/              # Theme definitions (Tailwind config wrappers)
├── scripts/             # Maintenance scripts
│   └── download-assets.js # Fetches placeholder images
├── constants.ts         # Data structure & Configuration
├── content.ts           # Markdown content
├── types.ts             # TypeScript interfaces
└── App.tsx              # Main entry point
```

## 🎨 Design System

The project uses a custom Tailwind configuration injected via `index.html` (for portability) and `styles/theme.ts` for centralized class strings.

- **Font**: JetBrains Mono
- **Primary Color**: Emerald Green (`#10b981`)
- **Background**: Zinc 950 (`#09090b`)

## 🛠 Tech Stack

- **Vite**: Build tool
- **React**: UI Library
- **TypeScript**: Type safety
- **Framer Motion**: Animations
- **Lucide React**: Icons