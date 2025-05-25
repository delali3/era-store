import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import HeroSlider from '../components/layout/home/HeroSlider';
import Testimonials from '../components/layout/home/Testimonials';
import Newsletter from '../components/layout/home/Newsletter';
// import FeaturesSection from '../components/layout/home/FeaturesSection';
import { ProductCard, CategoryCard } from "../components/layout/home/ProductComponents";
import SEO from '../components/SEO';

// Enhanced type definitions with tech-specific properties
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_id: number;
  inventory_count: number;
  featured: boolean;
  created_at?: string;
  rating?: number;
  discount_percentage?: number;
  release_date?: string;  // When the product was released
  manufacturer_location?: string; // Where the product was manufactured
  eco_friendly?: boolean; // Whether the product is eco-friendly
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url?: string;
  product_count?: number;
}

// State interface for better type safety
interface HomePageState {
  featuredProducts: Product[];
  newReleases: Product[];  // Changed from newHarvests to newReleases
  categories: Category[];
  bestSellers: Product[];
  isLoading: boolean;
  error: string | null;
}

// Main HomePage Component
const HomePage: React.FC = () => {
  const [state, setState] = useState<HomePageState>({
    featuredProducts: [],
    newReleases: [],
    categories: [],
    bestSellers: [],
    isLoading: true,
    error: null
  });

  const updateState = (updates: Partial<HomePageState>) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch multiple datasets in parallel for better performance
        const [featuredResult, newReleasesResult, categoriesResult, bestSellersResult] = await Promise.all([
          // Fetch featured products
          supabase
            .from('products')
            .select('*')
            .eq('featured', true)
            .limit(4),

          // Fetch new releases
          supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8),

          // Fetch categories
          supabase
            .from('categories')
            .select('*'),

          // Fetch best sellers (simulated with a query)
          supabase
            .from('products')
            .select('*')
            .order('sales_count', { ascending: false })
            .limit(4)
        ]);

        // Check for errors in any of the queries
        const errors = [
          featuredResult.error && `Failed to fetch featured products: ${featuredResult.error.message}`,
          newReleasesResult.error && `Failed to fetch new releases: ${newReleasesResult.error.message}`,
          categoriesResult.error && `Failed to fetch categories: ${categoriesResult.error.message}`,
          bestSellersResult.error && `Failed to fetch best sellers: ${bestSellersResult.error.message}`
        ].filter(Boolean);

        if (errors.length > 0) {
          throw new Error(errors.join('. '));
        }

        // Process category product counts (in a real app, this might be a direct query)
        const categoriesWithCount = categoriesResult.data?.map(category => ({
          ...category,
          product_count: Math.floor(Math.random() * 50) + 10 // Simulated count
        })) || [];

        // Update all state at once to prevent multiple re-renders
        updateState({
          featuredProducts: featuredResult.data || [],
          newReleases: newReleasesResult.data || [],
          categories: categoriesWithCount,
          bestSellers: bestSellersResult.data || [],
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        updateState({
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
      }
    };

    fetchData();
  }, []);

  // Placeholder data for fallbacks - Updated for tech context
  const placeholderFeaturedProducts: Product[] = [
    {
      id: 1,
      name: "Quantum AI Assistant",
      price: 349.99,
      description: "Next-gen AI assistant with advanced natural language processing capabilities",
      image_url: "https://source.unsplash.com/random/300x300/?ai-assistant",
      category_id: 1,
      inventory_count: 85,
      featured: true,
      rating: 4.5,
      discount_percentage: 10,
      release_date: "2025-03-15",
      manufacturer_location: "Silicon Valley",
      eco_friendly: true
    },
    {
      id: 2,
      name: "Neural Interface Hub",
      price: 499.50,
      description: "Central control system for all your smart home devices with neural learning",
      image_url: "https://source.unsplash.com/random/300x300/?smart-hub",
      category_id: 1,
      inventory_count: 120,
      featured: true,
      rating: 4.8,
      manufacturer_location: "Tokyo R&D Center",
      release_date: "2025-03-20"
    },
    {
      id: 3,
      name: "Holographic Display Projector",
      price: 899.75,
      description: "True 3D holographic projection system with gesture controls",
      image_url: "https://source.unsplash.com/random/300x300/?hologram",
      category_id: 2,
      inventory_count: 45,
      featured: true,
      rating: 4.7,
      eco_friendly: true,
      manufacturer_location: "Seoul Tech District",
      release_date: "2025-03-18"
    },
    {
      id: 4,
      name: "Quantum Encryption Module",
      price: 299.99,
      description: "Military-grade encryption for all your personal and business communications",
      image_url: "https://source.unsplash.com/random/300x300/?encryption",
      category_id: 3,
      inventory_count: 60,
      featured: true,
      rating: 4.9,
      manufacturer_location: "Zurich Research Lab",
      eco_friendly: true,
      release_date: "2025-03-10"
    }
  ];

  const placeholderCategories: Category[] = [
    {
      id: 1,
      name: "Smart Home",
      description: "AI assistants, hubs, and automated home systems",
      product_count: 42,
      image_url: "https://source.unsplash.com/random/300x300/?smart-home"
    },
    {
      id: 2,
      name: "AR/VR",
      description: "Augmented and virtual reality devices and accessories",
      product_count: 38,
      image_url: "https://source.unsplash.com/random/300x300/?virtual-reality"
    },
    {
      id: 3,
      name: "Security",
      description: "Encryption, privacy tools, and security systems",
      product_count: 25,
      image_url: "https://source.unsplash.com/random/300x300/?cybersecurity"
    },
    {
      id: 4,
      name: "Wearables",
      description: "Smart watches, fitness trackers, and wearable tech",
      product_count: 45,
      image_url: "https://source.unsplash.com/random/300x300/?wearable-tech"
    },
    {
      id: 5,
      name: "Robotics",
      description: "Personal and industrial robots and automation",
      product_count: 30,
      image_url: "https://source.unsplash.com/random/300x300/?robots"
    },
    {
      id: 6,
      name: "Dev Tools",
      description: "Hardware and software for tech developers",
      product_count: 20,
      image_url: "https://source.unsplash.com/random/300x300/?coding"
    }
  ];

  // Use real data if available, otherwise fallback to placeholders
  const {
    featuredProducts,
    newReleases,
    categories,
    bestSellers,
    isLoading,
    error
  } = state;

  const useFeaturedProducts = featuredProducts.length > 0
    ? featuredProducts
    : placeholderFeaturedProducts;

  const useNewReleases = newReleases.length > 0
    ? newReleases
    : placeholderFeaturedProducts.map(p => ({ ...p, featured: false }));

  const useCategories = categories.length > 0
    ? categories
    : placeholderCategories;

  const useBestSellers = bestSellers.length > 0
    ? bestSellers
    : placeholderFeaturedProducts.slice(0, 4);

  // Loading state component
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">Loading innovative solutions for you...</p>
      </div>
    );
  }

  // Error state component
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center px-4">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-4">
          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-bold mb-2">Oops! Something went wrong</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Featured category for the banner
  const featuredCategory = useCategories.length > 0 ? useCategories[0] : null;

  return (
    <div className="bg-white dark:bg-gray-900">
      <SEO
        title="Home | ERAAXIS - Cutting-Edge Tech Solutions"
        description="ERAAXIS connects you with innovative technology and smart solutions to enhance your digital lifestyle. Shop AI, smart home, AR/VR, and cutting-edge tech products."
        keywords="smart home, AI, virtual reality, tech innovation, digital solutions, ERAAXIS"
        ogType="website"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
        {/* Hero Section */}
        <section>
          <HeroSlider />
        </section>

        {/* Enhanced Features Section */}
        <section className="relative py-28 overflow-hidden">
          {/* Enhanced Background Decoration */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/20 to-purple-300/20 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-64 -left-64 w-[800px] h-[800px] bg-gradient-to-tr from-purple-200/20 to-indigo-300/20 dark:from-purple-900/10 dark:to-indigo-900/10 rounded-full blur-3xl opacity-60"></div>

            {/* Animated Particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400 dark:bg-indigo-500 rounded-full opacity-50 animate-pulse" style={{ animationDuration: '3s' }}></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 dark:bg-purple-500 rounded-full opacity-40 animate-pulse" style={{ animationDuration: '5s' }}></div>
            <div className="absolute bottom-1/4 right-1/5 w-2 h-2 bg-indigo-300 dark:bg-indigo-400 rounded-full opacity-60 animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-purple-300 dark:bg-purple-400 rounded-full opacity-30 animate-pulse" style={{ animationDuration: '6s' }}></div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwLjAyIj48cGF0aCBkPSJNMzUgMTBIMjVWMEg1djEwSDBWMzBoNVY2MGgyMFY0OGgxMFY2MGgyMFYzMGg1VjEwSDM1ek00MCAxMHYyMGgyMFYxMEg0MHptMCA0MHYtMTBIMjB2MTBoMjB6bS0yNS0yMHYtMUgwdjIwaDV2LTloMTB2LTEwek0wIDBWOWgxMFYwSDB6TTYwIDBINTB2OWgxMFYwem0wIDYwVjQxSDUwdjlIMzBWNDBIMTB2LTloLTV2MjloNTV6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-[0.015] dark:opacity-[0.03]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Enhanced Header Section */}
            <div className="lg:text-center max-w-3xl lg:max-w-4xl lg:mx-auto mb-20">
              <div className="inline-flex items-center justify-center px-4 py-2 bg-indigo-100/80 dark:bg-indigo-900/30 backdrop-blur-sm rounded-full text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider text-sm mb-4 transform transition-transform hover:scale-105">
                <span className="flex items-center">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3V19L14 13.5V8.5L5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 8.5C19.9853 8.5 22 10.5147 22 13C22 15.4853 19.9853 17.5 17.5 17.5C15.0147 17.5 13 15.4853 13 13C13 10.5147 15.0147 8.5 17.5 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  EXPERIENCE THE DIFFERENCE
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Why ERAAXIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Leads Innovation</span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Our commitment to excellence and innovation drives us to create products that don't just meet expectations — they redefine them. With cutting-edge technology and user-centered design, we're shaping the future of digital experiences.
              </p>
            </div>

            {/* Enhanced Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-12 lg:gap-y-16">
              {/* Feature 1 - Enhanced */}
              <div className="relative group">
                {/* Animated gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px]">
                  {/* Improved feature header */}
                  <div className="mb-6 flex items-center">
                    <div className="w-14 h-14 mr-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">Cutting-Edge Innovation</h3>
                  </div>

                  {/* Enhanced description with slightly larger text */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow text-base leading-relaxed">
                    Our dedicated research team constantly pushes the boundaries of what's possible, developing breakthrough technologies that transform everyday experiences. We partner with leading tech pioneers to bring you solutions that are months ahead of the market.
                  </p>

                  {/* Enhanced CTA link */}
                  <a href="/innovation" className="inline-flex items-center font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-auto group-hover:underline relative">
                    <span className="relative z-10">Learn more</span>
                    <span className="relative z-10 ml-2 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 transition-all duration-200">
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>

              {/* Feature 2 - Enhanced */}
              <div className="relative group">
                {/* Animated gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px]">
                  {/* Improved feature header */}
                  <div className="mb-6 flex items-center">
                    <div className="w-14 h-14 mr-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12H16L14 15H10L8 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.45 5.11L2 12V18C2 18.5304 2.21071 19.0391 2.58579 19.4142C2.96086 19.7893 3.46957 20 4 20H20C20.5304 20 21.0391 19.7893 21.4142 19.4142C21.7893 19.0391 22 18.5304 22 18V12L18.55 5.11C18.3844 4.77679 18.1292 4.49637 17.813 4.30028C17.4967 4.10419 17.1321 4.0002 16.76 4H7.24C6.86792 4.0002 6.50326 4.10419 6.18704 4.30028C5.87083 4.49637 5.61558 4.77679 5.45 5.11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">Premium Quality</h3>
                  </div>

                  {/* Enhanced description with slightly larger text */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow text-base leading-relaxed">
                    We rigorously test every product through our 100-point quality assurance system. Each device undergoes extensive real-world testing in our labs to ensure reliability, durability, and performance that exceeds industry standards and customer expectations.
                  </p>

                  {/* Enhanced CTA link */}
                  <a href="/quality" className="inline-flex items-center font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-auto group-hover:underline relative">
                    <span className="relative z-10">Our quality process</span>
                    <span className="relative z-10 ml-2 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 transition-all duration-200">
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>

              {/* Feature 3 - Enhanced */}
              <div className="relative group">
                {/* Animated gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px]">
                  {/* Improved feature header */}
                  <div className="mb-6 flex items-center">
                    <div className="w-14 h-14 mr-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 22V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">Integrated Ecosystem</h3>
                  </div>

                  {/* Enhanced description with slightly larger text */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow text-base leading-relaxed">
                    Experience true connectivity with our ecosystem of devices that work together seamlessly. Our proprietary ERALINK technology ensures all your devices communicate instantly, providing a unified experience that adapts to your lifestyle and preferences.
                  </p>

                  {/* Enhanced CTA link */}
                  <a href="/ecosystem" className="inline-flex items-center font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-auto group-hover:underline relative">
                    <span className="relative z-10">Explore ecosystem</span>
                    <span className="relative z-10 ml-2 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 transition-all duration-200">
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>

              {/* Feature 4 - Enhanced */}
              <div className="relative group">
                {/* Animated gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 group-hover:shadow-xl group-hover:translate-y-[-2px]">
                  {/* Improved feature header */}
                  <div className="mb-6 flex items-center">
                    <div className="w-14 h-14 mr-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 transform transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5H9L4 12L9 19H15L20 12L15 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 12H12.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">24/7 Expert Support</h3>
                  </div>

                  {/* Enhanced description with slightly larger text */}
                  <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow text-base leading-relaxed">
                    Our dedicated team of tech specialists is available around the clock to assist with any questions or issues. With an average response time of under 2 minutes and 97% first-contact resolution rate, you'll never feel left behind with new technology.
                  </p>

                  {/* Enhanced CTA link */}
                  <a href="/support" className="inline-flex items-center font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mt-auto group-hover:underline relative">
                    <span className="relative z-10">Contact support</span>
                    <span className="relative z-10 ml-2 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 transition-all duration-200">
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* New Section: Stats Highlight */}
            <div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 md:p-10">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Our Impact in Numbers</h3>
                <p className="text-gray-600 dark:text-gray-300">The results of our commitment to excellence</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">97%</div>
                  <p className="text-gray-600 dark:text-gray-300">Customer Satisfaction</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">24/7</div>
                  <p className="text-gray-600 dark:text-gray-300">Support Availability</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">120+</div>
                  <p className="text-gray-600 dark:text-gray-300">Countries Served</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">35+</div>
                  <p className="text-gray-600 dark:text-gray-300">Innovation Patents</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">Featured Innovations</h2>
              <p className="text-gray-700 dark:text-gray-400 mt-1">Handpicked by our technology experts</p>
            </div>
            <Link
              to="/products?featured=true"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center group"
            >
              View all
              <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useFeaturedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => console.log('Added to cart:', p.name)}
                onAddToWishlist={(p) => console.log('Added to wishlist:', p.name)}
                onQuickView={(p) => console.log('Quick view:', p.name)}
              />
            ))}
          </div>
        </section>

        {/* Enhanced Categories Banner */}
        {featuredCategory && (
          <section className="my-20 relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Advanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-indigo-900/90 mix-blend-multiply"></div>

            {/* Background image with animation */}
            <img
              src={featuredCategory.image_url || "https://source.unsplash.com/random/1400x500/?technology"}
              alt="Tech categories"
              className="absolute inset-0 w-full h-full object-cover transform scale-105 motion-safe:animate-subtle-zoom"
              style={{
                animationDuration: '30s',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationTimingFunction: 'ease-in-out'
              }}
            />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aC0ydi00aDJ2NHptMC04djJoLTJ2LTJoMnptLTQgMHYtMmgtNHYyaDR6bS00IDhoNHYtNGgtNHY0em04IDB2LTRoLTJ2NGgyeiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute h-2 w-2 rounded-full bg-white/20 top-1/4 left-1/4 animate-float" style={{ animationDuration: '15s', animationDelay: '1s' }}></div>
              <div className="absolute h-3 w-3 rounded-full bg-white/20 top-3/4 left-2/3 animate-float" style={{ animationDuration: '25s', animationDelay: '0s' }}></div>
              <div className="absolute h-2 w-2 rounded-full bg-white/20 top-1/3 left-3/4 animate-float" style={{ animationDuration: '18s', animationDelay: '5s' }}></div>
              <div className="absolute h-4 w-4 rounded-full bg-white/10 top-2/3 left-1/5 animate-float" style={{ animationDuration: '20s', animationDelay: '2s' }}></div>
            </div>

            {/* Content container with enhanced layout */}
            <div className="relative py-20 px-8 md:py-24 text-center flex flex-col items-center justify-center min-h-[320px] z-10">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2"></span>
                EXPLORE OUR COLLECTION
              </div>

              {/* Enhanced heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                <span className="relative">
                  Cutting-Edge Technology
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-white/0 via-white/70 to-white/0"></span>
                </span>
              </h2>

              {/* Enhanced description */}
              <p className="text-xl max-w-2xl mx-auto mb-10 text-white/90 leading-relaxed">
                Discover innovative, high-performance devices designed to transform your digital experience and elevate your connected lifestyle.
              </p>

              {/* Button group */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/categories"
                  className="px-8 py-3.5 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl flex items-center group"
                >
                  Browse All Categories
                  <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  to="/products/new"
                  className="px-8 py-3.5 bg-transparent border border-white/30 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  View New Releases
                </Link>
              </div>

              {/* Optional category preview */}
              <div className="mt-12 flex flex-wrap justify-center gap-3">
                {['Smart Home', 'Wearables', 'Audio', 'Computing', 'Accessories'].map((category, index) => (
                  <Link
                    key={index}
                    to={`/category/${category.toLowerCase().replace(' ', '-')}`}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white/90 text-sm font-medium transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-5 right-5 text-white/20">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 8V16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12H16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="absolute bottom-5 left-5 text-white/20">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </section>
        )}

        {/* Shop by Category */}
        <section>
          <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {useCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* New Releases - renamed from New Harvests */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">New Releases</h2>
              <p className="text-gray-700 dark:text-gray-400 mt-1">Recently launched tech from top innovators</p>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center group"
            >
              View all
              <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useNewReleases.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => console.log('Added to cart:', p.name)}
                onAddToWishlist={(p) => console.log('Added to wishlist:', p.name)}
                onQuickView={(p) => console.log('Quick view:', p.name)}
              />
            ))}
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="bg-indigo-50 dark:bg-gray-800 py-12 px-4 sm:px-6 -mx-4 sm:-mx-6 lg:-mx-8 rounded-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-300">Most Popular</h2>
                <p className="text-gray-700 dark:text-gray-400 mt-1">Our best-selling tech innovations</p>
              </div>
              <Link
                to="/products?sort=popular"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium inline-flex items-center group"
              >
                View all
                <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {useBestSellers.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => console.log('Added to cart:', p.name)}
                  onAddToWishlist={(p) => console.log('Added to wishlist:', p.name)}
                  onQuickView={(p) => console.log('Quick view:', p.name)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-indigo-800 dark:text-indigo-300 mb-4">What Our Users & Partners Say</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from the innovators and customers who are part of our growing tech community.
            </p>
          </div>
          <Testimonials />
        </section>

        {/* Newsletter - Updated to Tech Updates */}
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 py-16 px-4 sm:px-6 -mx-4 sm:-mx-6 lg:-mx-8 rounded-2xl">
          <div className="max-w-3xl mx-auto">
            <Newsletter />
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;