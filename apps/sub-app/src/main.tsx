import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { subAppRoutes } from '@/config/routes.tsx';
import { RouterProvider } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(    <RouterProvider router={subAppRoutes} />
);
