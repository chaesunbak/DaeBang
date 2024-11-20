import './App.css';
import SiseList from './components/SiseList';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import { ThemeProvider } from 'styled-components';
import { theme } from './style/theme';
import GlobalStyle from './style/global';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
]);

// 임시 라우팅임
function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
