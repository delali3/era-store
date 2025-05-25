import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Mail, CheckCircle, Cpu, Zap } from 'lucide-react';

interface NewsletterProps {
  onSubscribe?: (email: string) => Promise<void>;
  title?: string;
  description?: string;
  successMessage?: string;
  className?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({
  onSubscribe,
  title = 'Join Our Tech Community',
  description = 'Subscribe to receive weekly tech updates, innovation news, digital trends, and tech insights to enhance your connected lifestyle.',
  successMessage = 'You\'ve been added to our tech community. We\'ll keep you updated with the latest innovations, product releases, and tech trends.',
  className = '',
}) => {
  const [email, setEmail] = useState<string>('');
  const [interest, setInterest] = useState<string>('Smart Home');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handleInterestChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setInterest(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (onSubscribe) {
        await onSubscribe(email);
      } else {
        // Simulate API call if no handler provided
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-indigo-100 dark:border-gray-700 max-w-lg mx-auto ${className}`}>
      <div className="flex justify-center mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full">
          {isSubmitted ? (
            <Cpu size={24} className="text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Mail size={24} className="text-indigo-600 dark:text-indigo-400" />
          )}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {isSubmitted ? 'Thanks for joining our community!' : title}
      </h2>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">
        {isSubmitted ? successMessage : description}
      </p>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col gap-3">
            <div className="relative flex-grow">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email address"
                className={`w-full px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder-gray-500 
                  bg-gray-100 dark:bg-gray-700 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  transition-all duration-200`}
                required
                aria-label="Email address"
                aria-invalid={error ? 'true' : 'false'}
              />
            </div>
            
            <div className="relative flex-grow">
              <select
                value={interest}
                onChange={handleInterestChange}
                className={`w-full px-4 py-3 text-base text-gray-900 dark:text-gray-100 
                  bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  transition-all duration-200`}
                aria-label="Your tech interest"
              >
                <option value="Smart Home">Smart Home</option>
                <option value="AR/VR">AR/VR</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Robotics">Robotics</option>
                <option value="Wearables">Wearables</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="IoT Devices">IoT Devices</option>
                <option value="Mobile Tech">Mobile Tech</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${isLoading 
                  ? 'bg-indigo-400 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'} 
                text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              aria-busy={isLoading}
            >
              {isLoading ? 'Subscribing...' : 'Subscribe for Updates'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            You'll receive personalized tech updates based on your interests. Unsubscribe anytime.
          </p>
        </form>
      ) : (
        <div>
          <div className="flex items-center justify-center text-indigo-500 dark:text-indigo-400 mt-2 mb-4">
            <CheckCircle size={20} className="mr-2" />
            <span>Successfully subscribed</span>
          </div>
          
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap size={20} className="text-yellow-500" />
              <Cpu size={20} className="text-blue-500" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              You'll now receive {interest}-specific tech news, innovation alerts, and digital trends to help enhance your tech experience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Newsletter;