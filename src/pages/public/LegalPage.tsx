import { useEffect } from 'react';
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
      content: "Al iniciar sesión con Google, SIF Cards App recopila tu nombre, dirección de correo electrónico y foto de perfil. Adicionalmente, recopilamos la información que decides añadir voluntariamente a tu tarjeta digital (enlaces de redes sociales, números de teléfono, cargo, empresa, etc.)."
    },
    {
      title: "2. Naturaleza pública de los datos",
      content: "Entiendes y aceptas que el propósito principal de SIF Cards es compartir tu información profesional. Por lo tanto, cualquier dato que añadas a tu perfil digital será de carácter público y accesible para cualquier persona que escanee tu tarjeta NFC o visite tu enlace."
    },
    {
      title: "3. Uso y protección de la información",
      content: "Utilizamos estos datos exclusivamente para crear tu cuenta, autenticar tu acceso, generar tu tarjeta digital y permitirte compartirla. No vendemos, alquilamos ni compartimos tu información personal con terceros para fines de marketing o publicidad.\n\nTus datos se almacenan de forma segura utilizando servicios en la nube de alta seguridad. Los datos sensibles (como correos de inicio de sesión) nunca se exponen en tu perfil público."
    },
    {
      title: "4. Tus derechos",
      content: "Tienes el derecho de acceder, rectificar o eliminar tus datos en cualquier momento. Puedes solicitar la eliminación completa de tu cuenta y tus datos asociados enviando un correo a pacoquiroga33@gmail.com o directamente desde tu panel de usuario. Al eliminar tu cuenta, tu perfil público y enlace NFC dejarán de estar disponibles inmediatamente."
    }
  ]
};

const termsContent = {
  title: "Términos y Condiciones para SIF Cards App",
  sections: [
    {
      title: "1. Aceptación de los términos",
      content: "Al acceder y utilizar SIF Cards App, aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte, no debes utilizar nuestro servicio."
    },
    {
      title: "2. Uso de la plataforma y Responsabilidad del Contenido",
      content: "Eres el único responsable del contenido, enlaces, imágenes y datos que agregues a tu perfil. Te comprometes a utilizar la aplicación de manera legal.\n\nEstá estrictamente prohibido subir material ilícito, ofensivo, suplantar identidades o incluir enlaces a sitios web maliciosos. SIF Cards se reserva el derecho de suspender o eliminar perfiles que violen esta norma sin previo aviso."
    },
    {
      title: "3. Disponibilidad del servicio",
      content: 'SIF Cards App se proporciona "tal cual". Nos esforzamos por mantener la plataforma operativa de forma continua, pero no garantizamos que el servicio sea ininterrumpido o libre de errores. No nos hacemos responsables por la pérdida de oportunidades comerciales debido a interrupciones temporales del servicio.'
    },
    {
      title: "4. Propiedad Intelectual",
      content: "Los diseños, logotipos y el código de la plataforma SIF Cards son de nuestra propiedad. Sin embargo, tú conservas todos los derechos sobre la información, imágenes y logotipos personales o corporativos que subas a tu perfil digital."
    },
    {
      title: "5. Cancelación de cuenta",
      content: "Puedes dejar de usar el servicio y solicitar la baja de tu cuenta en cualquier momento. Al hacerlo, se desactivará tu perfil público. Nos reservamos el derecho de eliminar tu cuenta permanentemente si detectamos un uso indebido de la plataforma."
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
            Última actualización: 1 de octubre de 2026
          </p>
        </div>

        <div className="space-y-10">
          {content.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-xl font-semibold dark:text-white text-slate-800 tracking-tight">
                {section.title}
              </h2>
              {/* Se agregó whitespace-pre-wrap para respetar los saltos de línea (\n\n) en el JSON */}
              <p className="text-sm sm:text-base leading-relaxed dark:text-slate-300 text-slate-600 whitespace-pre-wrap">
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