# Markdown Preview App

A modern markdown editor and previewer built with React, TypeScript, and Vite.

## Features

- **Live Preview** - Real-time markdown rendering with split, editor, and preview modes
- **Cloud Sync** - Save/load documents with automatic API fallback
- **Auto-Save** - Local storage persistence every 2 seconds
- **File Operations** - Upload markdown files and download as `.md`
- **Dark Mode** - Theme toggle with system preference detection
- **Responsive Design** - Works on all devices

## Tech Stack

React 19 • TypeScript • Vite • Marked • DOMPurify • Lucide React

## Quick Start

```bash
npm install
npm run dev
```

Server runs at `http://localhost:5173`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/    # React components
├── pages/        # Page routes
├── hooks/        # Custom hooks
├── lib/          # Utilities
└── contexts/     # Theme context
```

## Key Features

**Editor Modes**: Toggle between editor-only, split-view, and preview-only layouts.

**Cloud Storage**: Save documents with title and tags. Auto-fallback to JSONPlaceholder if primary API fails.

**Auto-Save**: Content saves to localStorage automatically while you work.

**File Management**: Upload `.md` files and download your work.

## Browser Support

Chrome, Firefox, Safari, and mobile browsers (latest versions).

## Security

- HTML sanitized with DOMPurify
- Safe markdown parsing
- XSS attack prevention

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Content not saving | Enable localStorage in DevTools |
| Preview not updating | Refresh page or clear cache |
| Cloud sync failing | Check internet connection |
| Dark mode issues | Clear cache and refresh |

## License

Educational purposes only.

---

**Built by Esther Bawo Tsotso for Altschool Africa**