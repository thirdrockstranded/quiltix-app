import { useRef, useState } from 'react';
import { validateFileType, validateFileSize, checkResolution } from '../validation';

interface UploadState {
  previewUrl: string | null;
  error: string | null;
  warning: string | null;
  isValid: boolean;
}

const INITIAL_STATE: UploadState = {
  previewUrl: null,
  error: null,
  warning: null,
  isValid: false,
};

interface PhotoUploadProps {
  onContinue: (file: File) => void;
}

export function PhotoUpload({ onContinue }: PhotoUploadProps) {
  const [state, setState] = useState<UploadState>(INITIAL_STATE);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const typeResult = validateFileType(file);
    if (!typeResult.valid) {
      setState({ ...INITIAL_STATE, error: typeResult.error! });
      return;
    }

    const sizeResult = validateFileSize(file);
    if (!sizeResult.valid) {
      setState({ ...INITIAL_STATE, error: sizeResult.error! });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const warning = checkResolution(img.naturalWidth, img.naturalHeight);
      setState({
        previewUrl: objectUrl,
        error: null,
        warning,
        isValid: true,
      });
    };
    img.src = objectUrl;
  }

  function handleContinue() {
    const file = inputRef.current?.files?.[0];
    if (file) onContinue(file);
  }

  return (
    <div data-testid="photo-upload">
      <h1>Quiltix</h1>
      <p>Upload a photo to convert into a pixel-style quilt pattern.</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture
        data-testid="file-input"
        onChange={handleFileChange}
      />

      {state.error && (
        <p data-testid="error-message" role="alert">
          {state.error}
        </p>
      )}

      {state.warning && (
        <p data-testid="warning-message" role="status">
          {state.warning}
        </p>
      )}

      {state.previewUrl && (
        <div data-testid="preview-container">
          <img
            src={state.previewUrl}
            alt="Upload preview"
            data-testid="preview-image"
            style={{ maxWidth: '400px', height: 'auto', display: 'block' }}
          />
        </div>
      )}

      {state.isValid && (
        <button data-testid="continue-button" onClick={handleContinue}>
          Continue
        </button>
      )}
    </div>
  );
}
