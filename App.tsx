import React, { useState } from 'react';
import Header from './components/Header';
import TitleGenerator from './components/TitleGenerator';
import ThumbnailCreator from './components/ThumbnailCreator';

enum Step {
  TITLES,
  THUMBNAIL
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.TITLES);
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    setCurrentStep(Step.THUMBNAIL);
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(Step.TITLES);
    setSelectedTitle('');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 pt-10">
        {currentStep === Step.TITLES ? (
          <TitleGenerator onTitleSelected={handleTitleSelect} />
        ) : (
          <ThumbnailCreator 
            selectedTitle={selectedTitle} 
            onBack={handleBack} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
