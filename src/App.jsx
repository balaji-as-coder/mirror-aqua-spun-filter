import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { CartDrawer } from './components/drawers/CartDrawer.jsx';
import { WishlistDrawer } from './components/drawers/WishlistDrawer.jsx';
import { SearchDrawer } from './components/drawers/SearchDrawer.jsx';
import { MobileNavDrawer } from './components/drawers/MobileNavDrawer.jsx';
import { QuickViewModal } from './components/modals/QuickViewModal.jsx';
import { ComingSoonModal } from './components/modals/ComingSoonModal.jsx';

import { HomePage } from './pages/HomePage.jsx';
import { ShopPage } from './pages/ShopPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { StoriesPage, StoryDetailPage } from './pages/StoriesPage.jsx';
import { ComingSoonPage } from './pages/ComingSoonPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { AccountPage } from './pages/AccountPage.jsx';
import { AboutPage, FAQPage, ShippingInfoPage, LegalPage } from './pages/StaticPages.jsx';

export function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route Resolver
  const renderCurrentPage = () => {
    const path = currentPath;

    if (path === '/' || path === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (path === '/shop') {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      return <ShopPage initialFilter={filter} onNavigate={navigate} />;
    }

    if (path === '/category/handmade') {
      return <ShopPage initialFilter="handmade" onNavigate={navigate} />;
    }

    if (path === '/category/new-arrivals') {
      return <ShopPage initialFilter="new" onNavigate={navigate} />;
    }

    if (path === '/category/featured') {
      return <ShopPage initialFilter="editors-pick" onNavigate={navigate} />;
    }

    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('?')[0];
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (path === '/stories') {
      return <StoriesPage onNavigate={navigate} />;
    }

    if (path.startsWith('/stories/')) {
      const slug = path.replace('/stories/', '').split('?')[0];
      return <StoryDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (path === '/coming-soon') {
      return <ComingSoonPage onNavigate={navigate} />;
    }

    if (path === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (path === '/my-account') {
      return <AccountPage onNavigate={navigate} />;
    }

    if (path === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (path === '/faq') {
      return <FAQPage />;
    }

    if (path === '/shipping') {
      return <ShippingInfoPage />;
    }

    if (path === '/returns') {
      return (
        <LegalPage
          title="RETURNS & REPLACEMENTS"
          content="We provide a 7-day doorstep replacement guarantee on all handmade crafts if damaged in transit. Since each item is hand-burnished, hand-thrown, or hand-loomed, organic texture variations are natural signatures of human craft."
        />
      );
    }

    if (path === '/privacy-policy') {
      return (
        <LegalPage
          title="PRIVACY POLICY"
          content="We respect your privacy. Customer email, address, and phone details are used solely for order delivery, tracking updates, and optional artisan news. We never sell or share customer records with third-party advertisers."
        />
      );
    }

    if (path === '/terms') {
      return (
        <LegalPage
          title="TERMS & CONDITIONS"
          content="By browsing and shopping on Kala & Craft, you agree to our standard terms of trade, authentic handcrafted product disclosures, and dispute resolutions under the jurisdiction of Indian law."
        />
      );
    }

    // Default Fallback
    return <ShopPage onNavigate={navigate} />;
  };

  return (
    <div className="app-root">
      <Header currentPath={currentPath} onNavigate={navigate} />
      
      <main className="main-content-region">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global Overlays & Modals */}
      <CartDrawer onNavigate={navigate} />
      <WishlistDrawer onNavigate={navigate} />
      <SearchDrawer onNavigate={navigate} />
      <MobileNavDrawer currentPath={currentPath} onNavigate={navigate} />
      <QuickViewModal onNavigate={navigate} />
      <ComingSoonModal />
    </div>
  );
}
