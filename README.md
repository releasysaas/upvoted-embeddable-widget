# Upvoted Embeddable Widget by Releasy CORP

This widget lets you inlcude the Upvoted feature requests in any website. [Upvoted](https://upvoted.io).

## ✨ Features

- 🛡️ **Fully Isolated** - Shadow DOM encapsulation prevents style conflicts
- 🚀 **Modern Stack** - Built with React 19, TypeScript, and Vite
- 🔌 **Simple Integration** - Single line of code to embed
- 🛠️ **Developer Experience** - Hot reload, TypeScript, and modern tooling

## How to install the widget in your web app

1. Load the widget on your page:

   ```html
   <script
     src="https://cdn.jsdelivr.net/gh/releasysaas/upvoted-embeddable-widget@1.5.1/dist/widget.js"
     defer
     data-client-key="019483fc-b33e-7456-a5df-5bfa9ede6429"
     data-class-name="dark"
   ></script>
   ```

2. Replace the `data-client-key` value with the API token generated from the Upvoted backoffice.

3. Set the `data-class-name` value with `dark` to load the widget in dark mode, otherwise leave it blank.

### Embed the full board (new)

You can also embed the full board using the same script by switching the mode to `board`. This renders an inline Kanban similar to `UpvotedWeb.PublicOrgDashboardLive` using only the API Token endpoints (`/api/boards/*`).

Minimal example (inserts after the script tag):

```html
<script
  src="https://cdn.jsdelivr.net/gh/releasysaas/upvoted-embeddable-widget@1.5.1/dist/widget.js"
  defer
  data-mode="board"
  data-client-key="YOUR_API_TOKEN"
  data-class-name="dark"
></script>
```

Mount into a specific element:

```html
<div id="upvoted-board-here"></div>
<script
  src="https://cdn.jsdelivr.net/gh/releasysaas/upvoted-embeddable-widget@1.5.1/dist/widget.js"
  defer
  data-mode="board"
  data-embed-target="#upvoted-board-here"
  data-client-key="YOUR_API_TOKEN"
  data-class-name="dark"
></script>
```

Supported attributes in board mode:

- `data-mode`: `board` to enable board embed. Default is `widget`.
- `data-embed-target` (optional): CSS selector where the board should mount. If omitted, the board is appended to `document.body` after the script tag.
- `data-client-key`: your API token (required), used as `Authorization: Bearer <token>`.
- `data-class-name` (optional): wrapper class, e.g. `dark`.

What it does:

- Calls `GET https://upvoted.io/api/boards/statuses` to build columns.
- For each status, calls `GET https://upvoted.io/api/boards/features?status=<status>&page=1&per_page=50` and renders cards with title, counts, and optional image linking to the feature URL.
- Columns are ordered by the `order` field from statuses.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## About Releasy CORP, the SaaS company

[Releasy CORP](https://www.releasy.xyz), We Build SaaS and Productivity Tools!
