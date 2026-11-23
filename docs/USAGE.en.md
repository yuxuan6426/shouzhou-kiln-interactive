# User guide

[简体中文](USAGE.md) · [Project home](../README.en.md) · [Development guide](DEVELOPMENT.en.md)

## Explore the gallery

Open the [live gallery](https://shouzhou-kiln-interactive.yuxuan.wiki/). The wide layout places the image and exhibit label side by side, with the artifact strip below. The compact layout starts with the image, name and view controls, followed by a swipeable thumbnail strip and a vertically scrollable exhibit label. In both layouts, use the Left and Right Arrow keys to change artifacts or the strip's arrow buttons to browse thumbnails.

“数字资产” displays the processed artifact image; “档案视图” displays the scanned archive. There are 76 artifacts with processed images and 2 that open directly in archive view. Select an archive image to read it in fullscreen and scroll through the page.

Select “查看文物资料” to read dimensions, excavation, collection and technical features. In the compact layout, this button is below the exhibit label and opens a scrollable single-column panel. Press `Esc` or use the close button to exit the record panel or fullscreen reader. Use `Tab` and `Shift+Tab` to cycle focus within either dialog.

## Run locally

Install Node.js 22 and npm:

```sh
git clone https://github.com/yuxuan6426/shouzhou-kiln-interactive.git
cd shouzhou-kiln-interactive
npm ci
npm run dev -- --host 127.0.0.1
```

The default development address is `http://127.0.0.1:3000/`; use the address printed by the terminal. Initial installation requires access to the npm registry. Running and building require Node.js; Python is used for optional thumbnail generation.

## Build and use offline

```sh
npm run check
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/`. Preview serves `dist/`; rebuild after editing source files. Serve `dist/` with an HTTP static server for a website, local machine or intranet. For offline use, install dependencies and build first, then run a local HTTP server. Images are local and fonts use the system font stack.

Browser requirements are Chrome 111+, Safari 16.4+ and Firefox 128+. The wide layout appears when the viewport is at least 1024 CSS pixels wide and wider than it is tall. Other sizes use the compact layout. An embedded gallery uses its iframe's viewport. Resizing or rotating preserves the selected artifact, view and open dialog.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Port already in use | Stop the conflicting process or pass a different `--port` to dev/preview |
| Preview shows old content | Run `npm run build` again and refresh |
| An image fails to load | Check image paths, deployment subpath and network; select the retry button after restoring access |
| Opening HTML directly fails | Access `dist/` through an HTTP server |
| Material validation fails | Compare the source manifest, actual file and hash as described in the [development guide](DEVELOPMENT.en.md) |

Materials are available for learning, exchange and noncommercial distribution; see [material terms](../ASSET_LICENSE.en.md).
