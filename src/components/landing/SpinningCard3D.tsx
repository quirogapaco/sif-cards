import React from 'react';

interface SpinningCard3DProps {
  frontImage: string;
  backImage: string;
  altFront?: string;
  altBack?: string;
  isFading?: boolean;
}

export const SpinningCard3D: React.FC<SpinningCard3DProps> = ({
  frontImage,
  backImage,
  altFront = 'SIF Card Frontal',
  altBack = 'SIF Card Reverso',
  isFading = false,
}) => {
  return (
    <div className="perspective-container relative w-full max-w-[440px] sm:max-w-[480px] aspect-[1.586/1] flex items-center justify-center pointer-events-auto">
      {/* Portador rotatorio 3D continuo */}
      <div
        aria-label="Visualización 3D continua de SIF Card"
        className="card-turntable relative w-full h-full flex items-center justify-center"
      >
        {/* Cara Frontal */}
        <div className="card-face absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={frontImage}
            alt={altFront}
            className={`w-full h-full object-contain select-none transition-opacity duration-300 scale-[1.16] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] ${
              isFading ? 'opacity-35' : 'opacity-100'
            }`}
          />
        </div>

        {/* Cara Trasera con QR */}
        <div className="card-face card-face-back absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src={backImage}
            alt={altBack}
            className={`w-full h-full object-contain select-none transition-opacity duration-300 scale-[1.16] drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] ${
              isFading ? 'opacity-35' : 'opacity-100'
            }`}
          />
        </div>
      </div>

      {/* Sombra de apoyo en piso */}
      <div className="floor-shadow absolute -bottom-10 inset-x-8 h-8 rounded-[100%] bg-black/90 blur-xl -z-20 pointer-events-none" />
    </div>
  );
};