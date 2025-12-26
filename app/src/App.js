import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { PortfolioPage } from './pages/PortfolioPage';
export default function App() {
    return (_jsxs("div", { className: "min-h-screen noise", children: [_jsx(Header, {}), _jsx("main", { className: "container mx-auto px-4 py-8 max-w-7xl", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/market/:id", element: _jsx(MarketPage, {}) }), _jsx(Route, { path: "/portfolio", element: _jsx(PortfolioPage, {}) })] }) })] }));
}
