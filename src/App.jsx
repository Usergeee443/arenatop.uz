import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { DownloadProvider } from './context/DownloadContext';
import PRIVACY_CONTENT from './data/privacyContent';
import AboutPage from './pages/AboutPage';
import BookingsPage from './pages/BookingsPage';
import CourtPage from './pages/CourtPage';
import CourtsPage from './pages/CourtsPage';
import FavoritesPage from './pages/FavoritesPage';
import HelpPage from './pages/HelpPage';
import HomePage from './pages/HomePage';
import LegalDocPage from './pages/LegalDocPage';
import MyReviewsPage from './pages/MyReviewsPage';
import NotificationsPage from './pages/NotificationsPage';
import OwnersPage from './pages/OwnersPage';
import PaymentCardsPage from './pages/PaymentCardsPage';
import PaymentsHistoryPage from './pages/PaymentsHistoryPage';
import ProfilePage from './pages/ProfilePage';
import RefundsPage from './pages/RefundsPage';

function OfertaPage() {
  return (
    <LegalDocPage
      title="Oferta"
      path="/oferta"
      description="ArenaTop foydalanish shartlari (Offerta)."
      fetchPath="/settings/offer-terms"
      fallbackTitle="ArenaTop Foydalanish Shartlari (Offerta)"
    />
  );
}

function PrivacyPage() {
  return (
    <LegalDocPage
      title="Maxfiylik siyosati"
      path="/privacy"
      description="ArenaTop maxfiylik siyosati."
      fallbackTitle="ArenaTop Maxfiylik siyosati"
      fallbackContent={PRIVACY_CONTENT}
    />
  );
}

export default function App() {
  return (
    <DownloadProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<CourtsPage />} />
              <Route path="maydonlar" element={<Navigate to="/" replace />} />
              <Route path="maydon/:id" element={<CourtPage />} />
              <Route path="bronlarim" element={<BookingsPage />} />
              <Route path="sevimlilar" element={<FavoritesPage />} />
              <Route path="profil" element={<ProfilePage />} />
              <Route path="profil/kartalar" element={<PaymentCardsPage />} />
              <Route path="profil/qaytarishlar" element={<RefundsPage />} />
              <Route path="profil/tolovlar" element={<PaymentsHistoryPage />} />
              <Route path="profil/sharhlar" element={<MyReviewsPage />} />
              <Route path="profil/bildirishnomalar" element={<NotificationsPage />} />
              <Route path="yordam" element={<HelpPage />} />
              <Route path="stadioni-borlar" element={<OwnersPage />} />
              <Route path="stadion-qoshish" element={<Navigate to="/stadioni-borlar" replace />} />
              <Route path="arena" element={<Navigate to="/stadioni-borlar" replace />} />
              <Route path="biz-haqimizda" element={<AboutPage />} />
              <Route path="ilova" element={<HomePage />} />
              <Route path="oferta" element={<OfertaPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<Navigate to="/oferta" replace />} />
              <Route path="stadion/:slug" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DownloadProvider>
  );
}
