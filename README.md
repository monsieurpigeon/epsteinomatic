# epstein-ô-matic

Web app that **detects people** in a photo, shows a **clickable frame** around each, lets you **hide or show** them on click, then **download the image**. 100% offline (TensorFlow.js + COCO-SSD). No data is sent to any server.

**Live:** [epsteinomatic.com](https://epsteinomatic.com) · **Source:** [github.com/monsieurpigeon/epsteinomatic](https://github.com/monsieurpigeon/epsteinomatic)

## Stack

- **React 18** + **Vite** + **TypeScript**
- **React Router**: 2 routes — `/` (Home), `/workspace` (Workspace)
- **COCO-SSD** (person detection) via `@tensorflow-models/coco-ssd`
- **Tailwind CSS** for styling

## Getting started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open **http://localhost:5173** (or the URL shown by Vite).

## Production build

```bash
npm run build
npm run preview
```

Output is in `dist/`. To deploy, serve the contents of `dist/` over HTTPS (required for the Service Worker).

## Routes

| Route        | Page                                             |
| ------------ | ------------------------------------------------ |
| `/`          | Landing (presentation)                           |
| `/workspace` | Workspace (upload, detection, masking, download) |

## How to use

1. **Landing** (`/`): Home page describing the tool.
2. **Workspace** (`/workspace`):
   - Drop a photo or click to choose one.
   - Click **Detect people** (the model loads on first use).
   - Frames appear around each person; click to hide or show them. Download the image.

Downloaded images include a watermark in the bottom-right corner (epsteinomatic.com).

## Technical notes

- **Detection**: [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) (class « person »); clickable frames and toggle masking on click.
- **Offline**: Service Worker (`public/sw.js`) caches the app shell so it works offline after the first load.

## License

Open source — see [repository](https://github.com/monsieurpigeon/epsteinomatic).
