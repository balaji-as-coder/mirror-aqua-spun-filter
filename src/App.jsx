import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { CartDrawer } from './components/drawers/CartDrawer.jsx';
import { WishlistDrawer } from './components/drawers/WishlistDrawer.jsx';
import { SearchDrawer } from './components/drawers/SearchDrawer.jsx';
import { MobileNavDrawer } from './components/drawers/MobileNavDrawer.jsx';
import { QuickViewModal } from './components/modals/QuickViewModal.jsx';

import { ProductLandingPage } from './components/landing/ProductLandingPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { AccountPage } from './pages/AccountPage.jsx';
import { VideoTutorialPage } from './pages/VideoTutorialPage.jsx';
import { TrackOrderPage } from './pages/TrackOrderPage.jsx';
import { FAQPage, ShippingInfoPage, LegalPage } from './pages/StaticPages.jsx';
import { WhatsAppBotButton } from './components/ui/WhatsAppBotButton.jsx';

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

    // Default Landing Page: 10-Inch 5-Micron PP Spun Filter
    if (path === '/' || path === '') {
      return <ProductLandingPage slug="10-inch-5-micron-pp-spun-filter" onNavigate={navigate} />;
    }

    if (path.startsWith('/product/')) {
      const slug = path.replace('/product/', '').split('?')[0].replace(/\/$/, '');
      return <ProductLandingPage slug={slug || '10-inch-5-micron-pp-spun-filter'} onNavigate={navigate} />;
    }

    if (path === '/how-to-change-spun-filter' || path === '/installation-guide' || path === '/video-tutorial') {
      return <VideoTutorialPage onNavigate={navigate} />;
    }

    if (path === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (path === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (path === '/track' || path === '/track-order') {
      return <TrackOrderPage onNavigate={navigate} />;
    }

    if (path === '/my-account') {
      return <AccountPage onNavigate={navigate} />;
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
          title="REPLACEMENT & COMPATIBILITY GUARANTEE"
          content="Mirror Aqua provides a direct replacement guarantee if any spare part arrives damaged or does not fit your compatible 10-inch pre-filter bowl. Contact our technical support on WhatsApp within 7 days of delivery for immediate dispatch of replacement."
        />
      );
    }

    if (path === '/privacy-policy') {
      return (
        <LegalPage
          title="PRIVACY POLICY"
          content="Mirror Aqua respects customer and dealer privacy. Phone numbers, addresses, and inquiry details are strictly used for logistics delivery, technical verification, and commercial trade quotes. We never share customer records with third-party advertisers."
        />
      );
    }

    if (path === '/terms') {
      return (
        <LegalPage
          title="TERMS & CONDITIONS"
          content="All Mirror Aqua products are sold under official trade specifications. Customers must verify bowl dimensions and follow purifier manufacturer operating instructions. All trade disputes are governed under applicable Indian jurisdiction."
        />
      );
    }

    // Default Fallback to Flagship Landing Page
    return <ProductLandingPage slug="10-inch-5-micron-pp-spun-filter" onNavigate={navigate} />;
  };

  return (
    <div className="app-root">
      <Header currentPath={currentPath} onNavigate={navigate} />
      
      <main className="main-content-region">
        {renderCurrentPage()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global Drawers & Modals */}
      <CartDrawer onNavigate={navigate} />
      <WishlistDrawer onNavigate={navigate} />
      <SearchDrawer onNavigate={navigate} />
      <MobileNavDrawer currentPath={currentPath} onNavigate={navigate} />
      <QuickViewModal onNavigate={navigate} />

      {/* Floating WhatsApp Bot Support Widget */}
      <WhatsAppBotButton />
    </div>
  );
}
