import React, { useEffect } from 'react';
import { Navbar } from '../../components/landing/Navbar';
import { FooterCTA } from '../../components/landing/FooterCTA';

interface LegalPageProps {
  type: 'privacy' | 'terms';
}

const privacyContent = {
  title: "Políticas de Privacidad",
  sections: [
    {
      title: "1. Datos que recopilamos",
      content: "Al iniciar sesión con Google, SIF Cards App recopila únicamente tu nombre, dirección de correo electrónico y foto de perfil."
    },
    {
      title: "2. Uso de la información",
      content: "Utilizamos estos datos exclusivamente para crear tu cuenta, autenticar tu acceso y personalizar tu perfil dentro de la aplicación. No utilizamos tus datos para enviar spam."
    },
    {
      title: "3. Protección y uso compartido",
      content: "Tus datos se almacenan de forma segura. No vendemos, alquilamos ni compartimos tu información personal con terceros para fines publicitarios."
    },
    {
      title: "4. Tus derechos",
      content: "Puedes solicitar la eliminación completa de tu cuenta y tus datos en cualquier momento enviando un correo a pacoquiroga33@gmail.com."
    }
  ]
};

const termsContent = {
  title: "Términos y Condiciones para SIF Cards App",
  sections: [
    {
      title: "1. Aceptación de los términos",
      content: "Al acceder y utilizar SIF Cards App, aceptas estar sujeto a estos términos y condiciones."
    },
    {
      title: "2. Uso de la plataforma",
      content: "Te comprometes a utilizar la aplicación de manera legal. Está prohibido suplantar identidades, intentar vulnerar la seguridad de la plataforma o utilizarla para fines ilícitos."
    },
    {
      title: "3. Disponibilidad del servicio",
      content: 'SIF Cards App se proporciona "tal cual". Nos esforzamos por mantener la plataforma operativa, pero no garantizamos que el servicio sea ininterrumpido o libre de errores.'
    },
    {
      title: "4. Cancelación de cuenta",
      content: "Nos reservamos el derecho de suspender o eliminar tu cuenta si incumples estos términos. Puedes dejar de usar el servicio y solicitar la baja de tu cuenta en cualquier momento."
    }
  ]
};

export default function LegalPage({ type }: LegalPageProps) {
  const content = type === 'privacy' ? privacyContent : termsContent;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <div className="min-h-dvh dark:bg-[#09090b] bg-[#fafafa] dark:text-slate-300 text-slate-700 relative selection:bg-[#ddb225] selection:text-black overflow-x-hidden transition-colors duration-300 flex flex-col">
      {/* Luces sutiles de fondo */}
      <div className="fixed inset-0 pointer-events-none -z-10 dark:bg-[radial-gradient(circle_at_75%_20%,rgba(221,178,37,0.05),transparent_55%)] bg-[radial-gradient(circle_at_75%_20%,rgba(221,178,37,0.08),transparent_60%)]" />
      <div className="fixed inset-0 pointer-events-none -z-10 dark:bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.03),transparent_45%)] bg-[radial-gradient(circle_at_25%_10%,rgba(0,0,0,0.02),transparent_50%)]" />
      
      <Navbar edition="gold" />

      <main className="flex-grow pt-32 pb-16 px-6 lg:px-8 max-w-3xl mx-auto w-full z-10 relative">
        <div className="mb-12 border-b dark:border-white/10 border-slate-200 pb-8">
          <h1 className="text-3xl sm:text-4xl font-bold dark:text-white text-slate-900 tracking-tight mb-4">
            {content.title}
          </h1>
          <p className="text-sm dark:text-slate-400 text-slate-500 font-medium">
            Última actualización: 24 de septiembre de 2026
          </p>
        </div>

        <div className="space-y-10">
          {content.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-xl font-semibold dark:text-white text-slate-800 tracking-tight">
                {section.title}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed dark:text-slate-300 text-slate-600">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </main>

      <FooterCTA />
    </div>
  );
}
