import React, { useState } from 'react';
import { Zap, Shield, Cpu, BarChart } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  ctaText?: string;
  ctaUrl?: string;
}

interface FeaturesSectionProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = "Why ERAAXIS",
  subtitle = "We connect you with cutting-edge technology with these benefits",
  className = "",
  features
}) => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  
  const defaultFeatures: Feature[] = [
    {
      id: "innovation",
      title: "Cutting-Edge Innovation",
      description: "Access the latest technological breakthroughs and innovations from leading developers across the globe.",
      icon: <Zap size={24} />,
      ctaText: "Explore Innovations",
      ctaUrl: "#innovation-process"
    },
    {
      id: "security",
      title: "Advanced Security",
      description: "All our tech products feature the highest level of encryption and security protocols to protect your digital life.",
      icon: <Shield size={24} />,
      ctaText: "Security Features",
      ctaUrl: "#security"
    },
    {
      id: "ecosystem",
      title: "Integrated Ecosystem",
      description: "Join our network of connected devices and platforms for a seamless technological experience across all your devices.",
      icon: <Cpu size={24} />,
      ctaText: "View Ecosystem",
      ctaUrl: "#ecosystem"
    },
    {
      id: "analytics",
      title: "Smart Analytics",
      description: "Our products collect and analyze data to provide you with meaningful insights and improved performance over time.",
      icon: <BarChart size={24} />,
      ctaText: "Analytics Overview",
      ctaUrl: "#analytics"
    }
  ];

  const featuresToRender = features || defaultFeatures;

  return (
    <div className={`py-12 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">{title}</h2>}
          {subtitle && <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuresToRender.map((feature) => (
          <div
            key={feature.id}
            className="flex flex-col h-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-indigo-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => setHoveredFeature(feature.id)}
            onMouseLeave={() => setHoveredFeature(null)}
            onFocus={() => setHoveredFeature(feature.id)}
            onBlur={() => setHoveredFeature(null)}
          >
            <div 
              className={`flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 transition-all duration-300 ${
                hoveredFeature === feature.id ? 'scale-110' : ''
              }`}
            >
              {feature.icon}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">{feature.description}</p>
            
            {feature.ctaText && feature.ctaUrl && (
              <a 
                href={feature.ctaUrl}
                className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-auto inline-flex items-center hover:text-indigo-700 dark:hover:text-indigo-300 focus:outline-none focus:underline"
                aria-label={`${feature.ctaText} about ${feature.title}`}
              >
                {feature.ctaText}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;