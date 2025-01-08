import { createBrowserRouter } from 'react-router-dom';
import MainPage from '../Components/MainPage';
import LandingPage from '../Components/LandingPage';
import ErrorPage from '../Components/ErrorPage';
import AuthPage from '../Components/AuthPage';
import Root from '../Components/Root';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: '/auth',
        element: <AuthPage />
      },
      {
        path: '/main',
        element: <MainPage />
      }
    ]
  },
]);

export default router;