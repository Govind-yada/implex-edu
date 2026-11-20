import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import Toast from '../components/common/Toast.jsx';
import NewsletterPopup from '../components/common/NewsletterPopup.jsx';
import TopNotificationBar from '../components/common/TopNotificationBar.jsx';
import PostNavbarPromoBanners from '../components/common/PostNavbarPromoBanners.jsx';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <TopNotificationBar />
      <Navbar />
      {/* 4 Auto-scrolling Banners after the Navbar showing 60% OFF (Bihar TRE, BPSC 72, UPSC, UPPSC) */}
      {location.pathname === '/' && <PostNavbarPromoBanners />}
      <main className="flex-1 page-enter" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <NewsletterPopup />
    </div>
  );
}
