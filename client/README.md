# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Additional Setup

This project uses [react-toastify](https://fkhadra.github.io/react-toastify/) for notifications. If not already installed, run:

```
npm install react-toastify
```

Import the ToastContainer and styles in your main entry point (e.g., App.jsx or main.jsx):

```
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
```

And include <ToastContainer /> once in your app, typically near the root.
