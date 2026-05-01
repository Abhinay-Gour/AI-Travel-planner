import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { AuthModalProvider } from './context/AuthModalContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useEffect } from 'react';
import { trackPage } from './services/analyticsService';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GlobeDashboard from './components/GlobeDashboard';
import StatsCounter from './components/StatsCounter';
import Features from './components/Features';
import Transport from './components/Transport';
import HotelBooking from './components/HotelBooking';
import TripComparison from './components/TripComparison';
import VisaInfo from './components/VisaInfo';
import CurrencyConverter from './components/CurrencyConverter';
import { LanguageTranslator, FestivalCalendar, PNRStatus, GroupPlanner, LoyaltyPoints } from './components/ExtraFeatures';
import CostCalculator from './components/CostCalculator';
import TravelInsurance from './components/TravelInsurance';
import BudgetOptimizer from './components/BudgetOptimizer';
import TravelStories from './components/TravelStories';
import Leaderboard from './components/Leaderboard';
import MultiCityPlanner from './components/MultiCityPlanner';
import { VisaTracker, TravelBuddyFinder } from './components/TravelExtras';
import { TravelChecklist, TripDashboard } from './components/TravelTools';
import DestinationsExplorer from './components/DestinationsExplorer';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Wishlist from './components/Wishlist';
import PackingList from './components/PackingList';
import MoodQuiz from './components/MoodQuiz';
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';
import ScrollToTop from './components/ScrollToTop';
import CookieNotice from './components/CookieNotice';
import FeedbackWidget from './components/FeedbackWidget';
import WhatsAppSupport from './components/WhatsAppSupport';
import NotFound from './components/NotFound';
import { PrivacyPolicy, TermsOfService } from './components/LegalPages';

// Page transition wrapper
const PageWrapper = ({ children }) => {
  const location = useLocation();
  useEffect(() => {
    trackPage(location.pathname);
  }, [location.pathname]);
  return (
    <div key={location.pathname} style={{ animation: 'pageIn 0.3s ease' }}>
      {children}
      <style>{`@keyframes pageIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
};

const TABS = [
  { id: 'plan', label: '✈️ Plan Trip' },
  { id: 'tools', label: '🛠️ Tools' },
  { id: 'explore', label: '🌍 Explore' },
  { id: 'community', label: '👥 Community' },
];

// Home page — sections grouped into tabs
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('plan');
  const handleDestSelect = (dest) => {
    window.dispatchEvent(new CustomEvent('selectDestination', { detail: dest }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTabs = () => {
    document.getElementById('tab-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <PageWrapper>
      <Hero />
      <StatsCounter />
      <GlobeDashboard onSelectDestination={handleDestSelect} />

      {/* Sticky Tab Navigation */}
      <div style={{
        position: 'sticky', top: 73, zIndex: 90,
        background: 'rgba(15,10,11,0.96)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(225,29,72,0.15)',
        padding: '0 6vw',
      }}>
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id}
              onClick={() => { setActiveTab(tab.id); scrollToTabs(); }}
              style={{
                padding: '14px 22px',
                background: 'none', border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#f43f5e' : 'transparent'}`,
                color: activeTab === tab.id ? '#f43f5e' : 'rgba(255,255,255,0.5)',
                fontFamily: 'DM Sans', fontWeight: 600, fontSize: '0.88rem',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div id="tab-content">
        {activeTab === 'plan' && <>
          <Features />
          <TripComparison />
          <MultiCityPlanner />
          <BudgetOptimizer />
          <CostCalculator />
          <TripDashboard />
        </>}
        {activeTab === 'tools' && <>
          <CurrencyConverter />
          <VisaInfo />
          <VisaTracker />
          <TravelInsurance />
          <TravelChecklist />
          <PNRStatus />
          <GroupPlanner />
          <LanguageTranslator />
        </>}
        {activeTab === 'explore' && <>
          <FestivalCalendar />
          <LoyaltyPoints />
        </>}
        {activeTab === 'community' && <>
          <TravelStories />
          <TravelBuddyFinder />
          <Leaderboard />
        </>}
      </div>

      <Pricing />
      <FAQ />
      <CTA />
    </PageWrapper>
  );
};

const TransportPage = () => <PageWrapper><div style={{ paddingTop: '80px' }}><Transport /></div></PageWrapper>;
const HotelsPage = () => <PageWrapper><div style={{ paddingTop: '80px' }}><HotelBooking /></div></PageWrapper>;
const WishlistPage = () => <PageWrapper><div style={{ minHeight: '100vh', padding: '100px 20px 40px' }}><Wishlist /></div></PageWrapper>;
const PackingPage = () => (
  <PageWrapper>
    <div style={{ minHeight: '100vh', padding: '100px 20px 40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: 'var(--white)', marginBottom: '24px', fontSize: '1.8rem' }}>🎒 Smart Packing List</h2>
      <PackingList />
    </div>
  </PageWrapper>
);
const MoodQuizPage = () => (
  <PageWrapper>
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '100px 20px 40px' }}>
      <h2 style={{ color: 'var(--white)', fontSize: '1.8rem' }}>🎯 Find Your Perfect Destination</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)' }}>Answer 4 quick questions and we'll match you with ideal destinations</p>
      <MoodQuiz autoOpen onSelectDestination={(dest) => { window.location.href = `/?dest=${encodeURIComponent(dest)}`; }} />
    </div>
  </PageWrapper>
);
const DestinationsPage = () => <PageWrapper><DestinationsExplorer /></PageWrapper>;

function App() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('app_loaded'));

  const handleLoadDone = () => {
    sessionStorage.setItem('app_loaded', '1');
    setLoading(false);
  };

  if (loading) return <LoadingScreen onDone={handleLoadDone} />;

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <UserProvider>
            <AuthModalProvider>
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/transport" element={<TransportPage />} />
                  <Route path="/hotels" element={<HotelsPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/packing" element={<PackingPage />} />
                  <Route path="/mood-quiz" element={<MoodQuizPage />} />
                  <Route path="/destinations" element={<DestinationsPage />} />
                  <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
                  <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
                  <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
                </Routes>
                <Footer />
                <Chatbot />
                <BottomNav />
                <ScrollToTop />
                <WhatsAppSupport />
                <FeedbackWidget />
                <CookieNotice />
              </BrowserRouter>
            </AuthModalProvider>
          </UserProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
