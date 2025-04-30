import { lazy } from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
const LazyDemo3 = lazy(() => import('@/pages/Demo3'));
const Demo4 = lazy(() => import('@/pages/Demo4'));
const App =  lazy(() => import('@/App'));

export const subAppRoutes = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
  {
    path: '/demo3',
    // 由于需要将组件包裹在 <React.Suspense> 中使用，这里使用 lazy 加载组件
    element: <LazyDemo3 />,
  },
  {
    path: '/demo4',
    element: <Demo4 />,
  },
]);
