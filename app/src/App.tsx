import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

export default function App() {
  return (
    <div className="min-h-screen noise">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/market/:id" element={<MarketPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </main>
    </div>
  );
}

