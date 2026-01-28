
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

2. **Generate Assets:**
   The project uses procedural SVG generation for node backgrounds to ensure unique visuals without heavy downloads. Run this command to generate them locally:
   ```bash
   npm run assets:generate
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📚 Content Management (CMS)

The site content is managed primarily via two files:
1. `src/content.ts` (Text content & Markdown)
2. `src/constants.ts` (Site structure, Navigation tree, Node configuration)

### 1. Adding a New Page/Section
**Step 1: Add Text**
Open `src/content.ts` and add a new export variable:
```typescript
export const my_new_page_md = txt(
  `## EN Title\nContent...`, 
  `## RU Title\nКонтент...`
);
```

**Step 2: Add to Grid**
Open `src/constants.ts`, find the parent hub (e.g., `works`), and add a `createNode` call to its children array:
```typescript
createNode(
    'unique-id',           // ID
    'Title EN',            // Title EN
    'Title RU',            // Title RU
    Content.my_new_page_md,// Reference to text
    'content',             // Type: 'content' | 'hub' | 'media' | 'action'
    [],                    // Children (if hub)
    true                   // Visible
)
```

### 2. Temporarily Disabling a Page
In `src/constants.ts`, change the 7th argument of `createNode` from `true` to `false`.
```typescript
createNode(..., [], false) // Hidden from grid
```

### 3. Deleting a Page
Remove or comment out the `createNode(...)` line in `src/constants.ts`. You can optionally remove the text from `src/content.ts` to keep things clean.

### 4. Adding Media to Text Panel
In `src/content.ts`, use the custom wiki-link syntax within your markdown string. These assets will automatically appear in the Lotus Grid as "Data" nodes (previews).
```markdown
Check out this video:
![[https://site.com/video.mp4]]

Or this local image:
![[/images/content/photo.jpg]]
```

### 5. Customizing Grid Cell Media
To set a specific cover image or video loop for a node in the grid (instead of the default generated abstract SVG), use the 11th argument in `createNode` in `src/constants.ts`.

```typescript
createNode(
    'id', 'En', 'Ru', Content.text, 'content', [], true, 
    undefined, undefined, [], // Skip optional args 8, 9, 10
    '/images/cover.jpg'       // 11. Custom Media URL (Relative to public folder or absolute URL)
)
```

## 📂 Project Structure

```
.
├── public/              # Static assets
│   └── images/          # Generated via npm run assets:generate
├── components/          # React UI components
│   ├── LotusGrid.tsx    # The 3x3 interactive grid (Right/Bottom panel)
│   ├── TextPanel.tsx    # The text content viewer (Left/Top panel)
│   ├── HeaderTabs.tsx   # Top navigation bar
│   └── ...
├── utils/               # Helper functions (Parsing, Pathfinding, Media)
├── styles/              # Theme definitions (Tailwind config wrappers)
├── scripts/             # Build & Maintenance scripts
├── constants.ts         # Data structure & Content Configuration
├── content.ts           # Markdown textual content
├── types.ts             # TypeScript interfaces
└── App.tsx              # Main Entry Point & Layout Orchestrator
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
