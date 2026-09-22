import sifGold from '../../assets/sif_gold.png';

/**
 * Fallback de carga minimalista en tono deep matte (#09090b)
 * Diseñado para evitar Layout Shifts (CLS) durante la carga diferida de rutas.
 */
export default function LoadingFallback() {
  return (
    <div
      className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden select-none"
      role="status"
      aria-label="Cargando contenido..."
    >
      {/* Luces sutiles de fondo para consistencia visual */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(221,178,37,0.06),transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-4 z-10">
        {/* Indicador de anillo exterior con pulso y spinner interior */}
        <div className="relative flex items-center justify-center w-12 h-12">
          {/* Anillo de pulso sutil */}
          <div className="absolute inset-0 rounded-full border border-[#ddb225]/20 animate-ping opacity-75" />

          {/* Spinner de alto contraste */}
          <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#ddb225] animate-spin" />
        </div>

        {/* Logo sutil de marca */}
        <img src={sifGold} alt="SIF Cards" className="h-20 w-auto object-contain opacity-50 animate-pulse" />
      </div>
    </div>
  );
}
