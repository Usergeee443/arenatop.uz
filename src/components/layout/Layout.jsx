import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';
import Footer from './Footer';
import Preloader from './Preloader';
import ScrollToTopButton from './ScrollToTopButton';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  const { pathname } = useLocation();
  const isCourtDetail = /^\/maydon\//.test(pathname);

  useEffect(() => {
    document.documentElement.classList.toggle('court-immersive', isCourtDetail);
    return () => document.documentElement.classList.remove('court-immersive');
  }, [isCourtDetail]);

  return (
    <>
      <Preloader />
      <ScrollToTop />
      <Outlet />
      <Footer />
      <ScrollToTopButton />
      <AuthModal />
    </>
  );
}
