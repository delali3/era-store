import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';

interface ProductHighlight {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  link: string;
}

const HeroSlider: React.FC = () => {
  const [currentProduct, setCurrentProduct] = useState(0);
  
  const featuredProducts: ProductHighlight[] = [
    {
      id: 1,
      name: "SmartLens Pro",
      category: "Smart Glasses",
      price: "$299.99",
      image: "https://img.freepik.com/free-photo/smart-glasses-tech-mixed-media_53876-121261.jpg?w=1380&t=st=1715434363~exp=1715434963~hmac=70c4c7b4ee5db3b7c6106e4e17c91be78f3a1c4f99f6a46af8cd1f17bb9bcc0c",
      link: "/products/smartlens-pro"
    },
    {
      id: 2,
      name: "EchoSphere 360",
      category: "Smart Speakers",
      price: "$179.99",
      image: "https://img.freepik.com/free-photo/voice-technologies-digital-concept_23-2150208963.jpg?w=1380&t=st=1715434464~exp=1715435064~hmac=eb20ee4bcedcd34cc27c4d24f27ed0ab2d3c9a6c6e80ca57f7b6c6a3fbc22a8a",
      link: "/products/echosphere-360"
    },
    {
      id: 3,
      name: "NexusBand",
      category: "Wearables",
      price: "$149.99",
      image: "https://img.freepik.com/free-photo/human-hand-presenting-wearable-smart-watch-with-abstract-data-screen-generated-by-ai_188544-42448.jpg?w=1380&t=st=1715434518~exp=1715435118~hmac=f8cc38a04d33c09ad00e0fc1c1a4d0cbb85b0d6ca66df36d8cce59c981d5eb24",
      link: "/products/nexusband"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredProducts.length]);
  
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left side: Featured product image */}
        <div className="relative overflow-hidden" style={{ height: "80vh", minHeight: "600px" }}>
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentProduct ? 'opacity-100' : 'opacity-0'}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 via-indigo-800/30 to-transparent"></div>
              </div>
            </div>
          ))}
          
          {/* Optional floating product info card */}
          <div className="absolute bottom-8 left-8 right-8 lg:right-auto lg:max-w-sm bg-white/10 backdrop-blur-md p-6 rounded-2xl text-white border border-white/10">
            <div className="text-xs font-medium text-indigo-300 mb-1">
              {featuredProducts[currentProduct].category}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {featuredProducts[currentProduct].name}
            </h2>
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium">{featuredProducts[currentProduct].price}</span>
              <Link 
                to={featuredProducts[currentProduct].link}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          
          {/* Product indicators */}
          <div className="absolute top-8 left-8 flex space-x-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentProduct(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentProduct ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Right side: Content and categories */}
        <div className="flex flex-col">
          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 py-12 lg:py-0">
            <div className="max-w-lg">
              <span className="inline-block text-xs font-semibold tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
                REDEFINING TECHNOLOGY
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Transforming Life Through Innovation
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Experience cutting-edge technology that seamlessly integrates into your lifestyle, enhancing every moment through intelligent design and intuitive functionality.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/collections/featured"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md flex items-center transition-colors"
                >
                  Explore Collections
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                <Link 
                  to="/about-us"
                  className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-md transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
          
          {/* Category grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 border-t border-gray-200 dark:border-gray-800">
            <Link 
              to="/collections/smart-home"
              className="group flex flex-col items-center justify-center py-8 px-4 border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-r-0"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Smart Home</span>
            </Link>
            
            <Link 
              to="/collections/wearables"
              className="group flex flex-col items-center justify-center py-8 px-4 border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors sm:border-r sm:last:border-r-0"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 16V18C16 19.1046 15.1046 20 14 20H10C8.89543 20 8 19.1046 8 18V16M16 16V6C16 4.89543 15.1046 4 14 4H10C8.89543 4 8 4.89543 8 6V16M16 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Wearables</span>
            </Link>
            
            <Link 
              to="/collections/audio"
              className="group flex flex-col items-center justify-center py-8 px-4 border-r-0 sm:border-r border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-t sm:border-t-0"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 6H16M7 12H17M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Audio</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;