import { useState } from 'react';
import { PhotoUpload } from './components/PhotoUpload';
import { QuiltInputs } from './components/QuiltInputs';

type Step = 'upload' | 'inputs';

function App() {
  const [step, setStep] = useState<Step>('upload');
  const [photo, setPhoto] = useState<File | null>(null);

  function handleUploadContinue(file: File) {
    setPhoto(file);
    setStep('inputs');
  }

  if (step === 'inputs' && photo) {
    return <QuiltInputs photo={photo} />;
  }

  return <PhotoUpload onContinue={handleUploadContinue} />;
}

export default App;
