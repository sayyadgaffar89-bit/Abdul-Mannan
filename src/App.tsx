/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { COMPANY } from './config/company.ts';
import { ARCHITECTURE_SERVICES, ArchitectureService } from './data/services.ts';
import { ARCHITECTURE_PROJECTS, Project } from './data/projects.ts';

// Components
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { AmberInteractiveCursor } from './components/AmberInteractiveCursor.tsx';
import { ScrollProgressBar } from './components/ScrollProgressBar.tsx';
import { Cinematic3DCanvas } from './components/Cinematic3DCanvas.tsx';
import { EntryGateModal } from './components/EntryGateModal.tsx';
import { ServiceSearchModal } from './components/ServiceSearchModal.tsx';
import { ChatbotAdvisor } from './components/ChatbotAdvisor.tsx';
import { ConsultationBookingModal } from './components/ConsultationBookingModal.tsx';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';

// Views
import { HomeView } from './views/HomeView.tsx';
import { ServicesView } from './views/ServicesView.tsx';
import { ProjectsView } from './views/ProjectsView.tsx';
import { EstimatorView } from './views/EstimatorView.tsx';
import { AboutView } from './views/AboutView.tsx';
import { ProcessView } from './views/ProcessView.tsx';
import { InsightsView } from './views/InsightsView.tsx';
import { ContactView } from './views/ContactView.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [gateCleared, setGateCleared] = useState<boolean>(false);
  const [visitorName, setVisitorName] = useState<string>('');

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [consultationData, setConsultationData] = useState<any>(null);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Selected items for detail drawers/modals
  const [selectedService, setSelectedService] = useState<ArchitectureService | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [preSelectedChatService, setPreSelectedChatService] = useState<string | null>(null);

  // Check gate status on first load
  useEffect(() => {
    try {
      const isCleared = localStorage.getItem('ud_gate_cleared');
      const savedName = localStorage.getItem('ud_lead_name');
      if (isCleared === 'true') {
        setGateCleared(true);
        if (savedName) setVisitorName(savedName);
      }
    } catch {
      // In private browsing without localStorage, defaults to showing gate
    }
  }, []);

  const handleGatePassed = (name: string) => {
    setGateCleared(true);
    setVisitorName(name);
  };

  const handleOpenConsultation = (data?: any) => {
    setConsultationData(data || null);
    setConsultationModalOpen(true);
  };

  const handleSelectServiceForEstimate = (service: ArchitectureService) => {
    setPreSelectedChatService(service.title);
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090A0E] text-[#F8FAFC] flex flex-col relative selection:bg-amber-500/30 selection:text-white">
      {/* 1. Subtle Custom Colorful Responsive and Interactive Amber Cursor */}
      <AmberInteractiveCursor />

      {/* 2. Top Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* 3. Three.js Cinematic 3D Canvas with Depth-Based Parallax Layers */}
      <Cinematic3DCanvas />

      {/* 4. Section 5: Mandatory Entry Login Gate Modal */}
      {!gateCleared && (
        <EntryGateModal
          onPassed={handleGatePassed}
          onOpenPrivacy={() => setPrivacyModalOpen(true)}
        />
      )}

      {/* 5. Global Sticky Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* 6. Main Content View Router */}
      <main className="flex-1 relative z-10">
        {currentTab === 'home' && (
          <HomeView
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenConsultation={handleOpenConsultation}
            onSelectService={(service) => {
              setSelectedService(service);
              setCurrentTab('services');
            }}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setCurrentTab('projects');
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'services' && (
          <ServicesView
            onOpenConsultation={handleOpenConsultation}
            selectedServiceModal={selectedService}
            setSelectedServiceModal={setSelectedService}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            onOpenConsultation={handleOpenConsultation}
            selectedProjectModal={selectedProject}
            setSelectedProjectModal={setSelectedProject}
          />
        )}

        {currentTab === 'estimator' && (
          <EstimatorView onOpenConsultation={handleOpenConsultation} />
        )}

        {currentTab === 'about' && (
          <AboutView onOpenConsultation={() => handleOpenConsultation()} />
        )}

        {currentTab === 'process' && (
          <ProcessView onOpenConsultation={() => handleOpenConsultation()} />
        )}

        {currentTab === 'insights' && <InsightsView />}

        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* 7. Section 7: Floating Architectural Chatbot Planner */}
      <ChatbotAdvisor
        preSelectedService={preSelectedChatService}
        onOpenConsultationWithData={handleOpenConsultation}
      />

      {/* 8. Global Search Modal (Section 6) */}
      <ServiceSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectServiceForEstimate={handleSelectServiceForEstimate}
        onSelectServiceView={(service) => {
          setSelectedService(service);
          setCurrentTab('services');
        }}
      />

      {/* 9. Consultation Booking Scheduler Modal */}
      <ConsultationBookingModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        initialData={consultationData}
      />

      {/* 10. Privacy Policy & DPDP Data Deletion Modal */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* 11. Admin Console (Section 10) */}
      {adminModalOpen && (
        <AdminPanel onClose={() => setAdminModalOpen(false)} />
      )}

      {/* 12. Global Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
      />
    </div>
  );
}
