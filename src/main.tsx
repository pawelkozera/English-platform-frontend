import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/theme/theme-provider";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { MainPageUnLogged } from './components/pages/unLoggedUser/main.tsx';
import { MainPageLogged } from './components/pages/loggedUser/main.tsx';
import { Repetitions } from './components/pages/loggedUser/student/repetitions/repetitions.tsx';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPageUnLogged />
  },
  {
    path: "/home",
    element: <MainPageLogged />
  },
  {
    path: "/repetitions",
    element: <Repetitions />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
