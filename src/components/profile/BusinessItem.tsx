import { Briefcase, ExternalLink } from 'lucide-react';

interface BusinessItemProps {
  name: string;
  description: string;
  url?: string;
}

export default function BusinessItem({ name, description, url }: BusinessItemProps) {
  return (
    <div className="flex flex-col gap-1.5 font-card-body">
      <h4 
        className="text-sm font-semibold flex items-center gap-2 transition-colors duration-500"
        style={{ color: 'var(--card-text-main)' }}
      >
        <Briefcase className="w-4 h-4 shrink-0 opacity-70" />
        {name}
      </h4>
      
      {description && (
        <p 
          className="text-xs transition-colors duration-500 pl-6"
          style={{ color: 'var(--card-text-muted)' }}
        >
          {description}
        </p>
      )}

      {url && (
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold flex items-center gap-1.5 mt-1 hover:underline pl-6 transition-colors duration-500"
          style={{ color: 'var(--card-primary)' }}
        >
          <ExternalLink className="w-3 h-3" />
          Visitar enlace
        </a>
      )}
    </div>
  );
}
