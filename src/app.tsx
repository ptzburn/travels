import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./app.css";
import DefaultLayout from "./client/layouts/default.tsx";

export default function App() {
  return (
    <Router
      root={DefaultLayout}
    >
      <FileRoutes />
    </Router>
  );
}
