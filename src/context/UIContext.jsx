import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [comingSoonRegion, setComingSoonRegion] = useState(null);

  const openQuickView = (product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openComingSoonModal = (region = null) => {
    setComingSoonRegion(region);
    setIsComingSoonModalOpen(true);
  };
  const closeComingSoonModal = () => {
    setIsComingSoonModalOpen(false);
    setComingSoonRegion(null);
  };

  return (
    <UIContext.Provider
      value={{
        isSearchOpen,
        setIsSearchOpen,
        isNavOpen,
        setIsNavOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isComingSoonModalOpen,
        comingSoonRegion,
        openComingSoonModal,
        closeComingSoonModal
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
