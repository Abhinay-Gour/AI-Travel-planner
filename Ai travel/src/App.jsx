import { UserProvider } from "./context/UserContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsCounter from "./components/StatsCounter";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Destinations from "./components/Destinations";
import CostCalculator from "./components/CostCalculator";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <AuthModalProvider>
          <Navbar />
          <Hero />
          <StatsCounter />
          <Features />
          <HowItWorks />
          <Destinations />
          <CostCalculator />
          <Pricing />
          <FAQ />
          <CTA />
          <Footer />
        </AuthModalProvider>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
