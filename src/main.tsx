import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from "@/components/theme/theme-provider";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from './components/utils/UserContext.tsx';
import { MainPageUnLogged } from './components/pages/unLoggedUser/main.tsx';
import { MainPageLogged } from './components/pages/loggedUser/main.tsx';
import { Repetitions } from './components/pages/loggedUser/student/repetitions/repetitions.tsx';
import { Groups } from './components/pages/loggedUser/student/groups/groups.tsx';
import { LanguageGames } from './components/pages/loggedUser/student/languageGames/languageGames.tsx';
import { Lessons } from './components/pages/loggedUser/student/lessons/lessons.tsx';
import { Profile } from './components/pages/loggedUser/student/profile/profile.tsx';
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
  {
    path: "/groups",
    element: <Groups />
  },
  {
    path: "/language-games",
    element: <LanguageGames />
  },
  {
    path: "/lessons",
    element: <Lessons />
  },
  {
    path: "/profile",
    element: <Profile />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </UserProvider>
  </React.StrictMode>,
)
