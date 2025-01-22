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

## How to install the widget in your web app

1. Load the widget on your page:

   ```html
   <script
     src="https://unpkg.com/upvoted-embeddable-widget@latest"
     defer
     data-client-key="019483fc-b33e-7456-a5df-5bfa9ede6429"
   ></script>
   ```

2. replace the `data-client-key` value with the API token generated from the Upvoted backoffice.

## Contributing

We welcome contributions to this project. If you find a bug or have a suggestion for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## About Releasy CORP, the SaaS company

[Releasy CORP](https://www.releasy.xyz), We Build SaaS and Productivity Tools!
