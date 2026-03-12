import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
}

export default function FeatureCard({ title, description, icon: Icon, onClick, color = "primary" }: FeatureCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl hover:bg-card/60 transition-all cursor-pointer group"
    >
      <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}