import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import getCroppedImg from '../../utils/cropImage';

interface ImageCropperModalProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onClose: () => void;
  aspect?: number;
  cropShape?: 'rect' | 'round';
  title?: string;
}

export default function ImageCropperModal({
  imageSrc,
  onCropComplete,
  onClose,
  aspect = 1,
  cropShape = 'round',
  title = 'Recortar Imagen'
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropCompleteHandler = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      setIsCropping(true);
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageFile) {
        onCropComplete(croppedImageFile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-sif-border bg-sif-surface shadow-2xl flex flex-col overflow-hidden h-[80vh] max-h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sif-border bg-[#18181c]">
          <h3 className="text-sm font-semibold text-sif-text">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-sif-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative flex-1 bg-black/50">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-[#18181c] border-t border-sif-border flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-sif-muted">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="flex-1 accent-sif-gold"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={onClose}
              disabled={isCropping}
              className="px-4 py-2 text-xs font-semibold rounded-xl hover:bg-white/5 text-sif-muted transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isCropping}
              className="flex items-center gap-2 px-6 py-2 text-xs font-bold rounded-xl bg-sif-gold text-black hover:bg-[#f0cc5a] transition-colors disabled:opacity-70 disabled:cursor-wait"
            >
              {isCropping ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
