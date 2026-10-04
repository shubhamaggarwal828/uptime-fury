import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import "./App.css";
import QuickStats from "./pages/QuickStats";
import SSL from "./pages/SSL";
import Ping from "./pages/Ping";
import Http from "./pages/Http";
import Whois from "./pages/Whois";
import TraceRoute from "./pages/Traceroute";
import NSLookup from "./pages/NSLookup";
import DNSLookup from "./pages/DNSLookup";
import MultiDiagnostics from "./pages/MultiDiagnostics";
import SysadminTools from "./pages/SysadminTools";
import Settings from "./pages/Settings";
import PortScanner from "./pages/PortScanner";
import SecurityHeaders from "./pages/SecurityHeaders";
import DNSPropagation from "./pages/DNSPropagation";
import BGPInspector from "./pages/BGPInspector";
import Footer from "./components/Footer/Footer"; 
import ScrollToTop from "./ScrollToTop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import WebsiteMonitoring from "./pages/WebsiteMonitoring";

const App = () => {
  return (
    <div className="bg-[#07090e] min-h-screen text-white flex">
      <BrowserRouter>
        <ScrollToTop />
        {/* Left Panel Sidebar with all metrics & blades */}
        <Sidebar />
        
        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Navbar />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/quickstats" element={<QuickStats />} />
              <Route path="/multi" element={<MultiDiagnostics />} />
              <Route path="/tools" element={<SysadminTools />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ssl" element={<SSL />} />
              <Route path="/ping" element={<Ping />} />
              <Route path="/ports" element={<PortScanner />} />
              <Route path="/security-headers" element={<SecurityHeaders />} />
              <Route path="/propagation" element={<DNSPropagation />} />
              <Route path="/bgp" element={<BGPInspector />} />
              <Route path="/http" element={<Http />} />
              <Route path="/whois" element={<Whois />} />
              <Route path="/TraceRoute" element={<TraceRoute />} />
              <Route path="/NSLookup" element={<NSLookup />} />
              <Route path="/DNSLookup" element={<DNSLookup />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/websitemonitoring" element={<WebsiteMonitoring />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
