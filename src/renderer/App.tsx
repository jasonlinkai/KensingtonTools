import React from 'react';
import { Box } from '@mui/material';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import TranslationTool from './pages/TranslationTool';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navigation />
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {children}
    </Box>
  </Box>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Home /></Layout>,
  },
  {
    path: '/about',
    element: <Layout><About /></Layout>,
  },
  {
    path: '/translate',
    element: <Layout><TranslationTool /></Layout>,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App; 