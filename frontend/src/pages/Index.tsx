import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import UploadView from "@/components/UploadView";
import SimplifyView from "@/components/SimplifyView";
import GlossaryView from "@/components/GlossaryView";
import SummariesView from "@/components/SummariesView";
import Chatbot from "@/components/Chatbot";
import PreferencesModal from "@/components/PreferencesModal";
import SafetyDisclaimer from "@/components/SafetyDisclaimer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [language, setLanguage] = useState("en");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("medease-preferences");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.language) {
        setLanguage(parsed.language);
      }
    }
  }, []);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    // Automatically navigate to simplify view after upload
    setTimeout(() => {
      setActiveTab("simplify");
    }, 1500);
  };

  const renderView = () => {
    switch (activeTab) {
      case "upload":
        return <UploadView onFileUpload={handleFileUpload} />;
      case "simplify":
        return <SimplifyView />;
      case "glossary":
        return <GlossaryView />;
      case "summaries":
        return <SummariesView />;
      default:
        return <UploadView onFileUpload={handleFileUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main className="pb-32">
        {renderView()}
      </main>

      <SafetyDisclaimer />
      <Chatbot />
      <PreferencesModal language={language} onLanguageChange={setLanguage} />
    </div>
  );
};

export default Index;
