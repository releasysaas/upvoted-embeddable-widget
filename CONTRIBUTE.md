# Upvoted Embeddable Widget by Releasy CORP

This widget lets you inlcude the Upvoted feature requests in any website. [Upvoted](https://upvoted.io).

## ✨ Features

- 🛡️ **Fully Isolated** - Shadow DOM encapsulation prevents style conflicts
- 🚀 **Modern Stack** - Built with React 19, TypeScript, and Vite
- 🔌 **Simple Integration** - Single line of code to embed
- 🛠️ **Developer Experience** - Hot reload, TypeScript, and modern tooling

## Getting Started

To get started, follow these steps:

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install` or `pnpm install` depending on your preferred package manager.
3. Run the development server by running `npm run dev` or `pnpm dev`.
4. Open your browser and navigate to `http://localhost:5173` to see the widget in action.

### Structure

The project is structured as follows:

```
.
├── dist/               # Output directory for the widget
├── public/             # Public assets for the widget
├── src/                # Source code for the widget
│   ├── App.css         # CSS file for the development Vite app
│   ├── App.tsx         # Entry point for the development Vite app
│   ├── widget/         # Source code for the widget
│   │   ├── components/ # Components for the widget
│   │   ├── lib/        # Utility functions for the widget
│   │   ├── index.tsx   # Entry point for the widget
│   │   └── styles/     # CSS styles for the widget
```

1. **Widget code**: The source code for the widget is located in the `src/widget` directory.
2. **Development app code**: The source code for the development app is located in the `src` directory. Useful for development and testing your widget in a Vite app.
3. **Widget distribution**: The widget is bundled into the `dist` directory.
4. **Public assets**: Public assets like images, fonts, and CSS files are located in the `public` directory.

### Cloning the Repository

To clone the repository, you can use the following command:

```bash
git clone https://github.com/releasysaas/upvoted-embeddable-widget.git
```

### Installing Dependencies

To install the dependencies, you can use the following commands:

```bash
npm install
```

or

```bash
pnpm install
```

### Running the Development Server

To run the development server, you can use the following command:

```bash
npm run dev
```

or

```bash
pnpm dev
```

### Opening the Widget in Your Browser

Once the development server is running, you can open your browser and navigate to `http://localhost:5173` to see the widget in action.

## Bundling the Widget

To bundle the widget, you can use the following command:

```bash
npm run build:widget
```

or

```bash
pnpm build:widget
```

This will create a `dist` directory with the bundled widget files.

For running the widget in production mode, you can use the following command:

```bash
npm run build:widget:production
```

or

```bash
pnpm build:widget:production
```

Production mode will use the environment variables from the `.env.production` file.

## Testing the bundled widget

To test the bundled widget, you can use the following command:

```bash
npm run serve
```

or

```bash
pnpm serve
```

This will start a local server and serve the widget at `http://localhost:33333/index.html`.

Then in an other shell run:

```bash
npm run serve:widget
```

or

```bash
pnpm serve:widget
```

## Board embed — local testing

Use `test/index.html` to run the board locally with the built bundle from `dist/` (served on http://127.0.0.1:3334).

Example setup:

```html
<div id="upvoted-board-here" style="height: 700px;"></div>
<script
  src="http://127.0.0.1:3334/widget.js"
  defer
  data-mode="board"
  data-embed-target="#upvoted-board-here"
  data-height="700px"
  data-client-key="YOUR_API_TOKEN"
  data-class-name="dark"
  data-statuses="pending,in_progress,done"
></script>
```

- `data-mode`: `board` to enable board embed. Default is `widget`.
- `data-embed-target`: CSS selector to mount inline. If omitted, widget appends to `body`.
- `data-height`: height to apply if the target has no explicit height (default `800px`).
- `data-client-key`: API token, sent as `Authorization: Bearer <token>` to `/api/boards/*` routes.
- `data-class-name`: optional wrapper class, e.g. `dark`.
- `data-statuses`: optional comma-separated status names to include (lowercased). If empty or omitted, loads all statuses.
- `data-allow-feature-request` (optional): when `true`, also renders the standard request widget below the board while preserving board height.
- `data-allow-feature-comment` (optional): when `true`, enables a comment form inside the feature modal (name, email, and comment are required).

Behavior in board mode (local):

- Loads statuses: `GET /api/boards/statuses` to create columns (ordered by `order`).
- Loads 5 features per status: `GET /api/boards/features?status=<status>&page=1&per_page=5` with per-column "Load more".
- Cards show title, votes/comments, image and a 2-line description preview derived from HTML.
- Clicking a card opens an in-widget modal that fetches `GET /api/boards/features/:id` and renders sanitized HTML description and HTML comments.

## How to deploy an updated version

1. update the version in the readme

2. update the version in `.env.production`

3. build the widget

```
npm run build:widget:production
```

4. commit locally and push:

5. create a new tag:

```
git tag 2.0.0
```

6. push all

```
git push origin --tags
```

## Contributing

We welcome contributions to this project. If you find a bug or have a suggestion for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## About Releasy CORP, the SaaS company

[Releasy CORP](https://www.releasy.xyz), We Build SaaS and Productivity Tools!
