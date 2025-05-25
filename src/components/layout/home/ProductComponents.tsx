import React, { useState } from 'react';
import { ShoppingCart, Heart, Eye, AlertTriangle, CheckCircle, Zap, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

// Type definitions with tech-specific properties
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_id: number;
  inventory_count: number;
  featured: boolean;
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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  showActions?: boolean;
}

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'compact' | 'featured';
}

// Product Badge Component
const ProductBadge: React.FC<{ 
  type: 'sale' | 'featured' | 'new' | 'low-stock' | 'out-of-stock' | 'eco-friendly',
  value?: string | number
}> = ({ type, value }) => {
  const badgeConfig = {
    'sale': {
      bgColor: 'bg-red-500',
      textColor: 'text-white',
      icon: null,
      text: value ? `${value}% OFF` : 'SALE'
    },
    'featured': {
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      icon: null,
      text: 'Featured'
    },
    'new': {
      bgColor: 'bg-purple-100 dark:bg-purple-900/40',
      textColor: 'text-purple-800 dark:text-purple-200',
      icon: null,
      text: 'New Release'
    },
    'low-stock': {
      bgColor: 'bg-amber-100 dark:bg-amber-900/40',
      textColor: 'text-amber-800 dark:text-amber-200',
      icon: <AlertTriangle size={12} className="mr-1" />,
      text: `Only ${value} left`
    },
    'out-of-stock': {
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      textColor: 'text-gray-800 dark:text-gray-200',
      icon: null,
      text: 'Out of Stock'
    },
    'eco-friendly': {
      bgColor: 'bg-green-100 dark:bg-green-900/40',
      textColor: 'text-green-800 dark:text-green-200',
      icon: <Zap size={12} className="mr-1" />,
      text: 'Eco-Friendly'
    }
  };

  const config = badgeConfig[type];

  return (
    <span className={`inline-flex items-center ${config.bgColor} ${config.textColor} text-xs font-semibold px-2 py-1 rounded-full`}>
      {config.icon}
      {config.text}
    </span>
  );
};

// Product Card Component
export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView,
  showActions = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && product.inventory_count > 0) {
      onAddToCart(product);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const discountedPrice = product.discount_percentage 
    ? product.price * (1 - product.discount_percentage / 100) 
    : null;
    
  // Format release date if available
  const formattedReleaseDate = product.release_date 
    ? new Date(product.release_date).toLocaleDateString('en-GH', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : null;

  return (
    <div 
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg border border-indigo-100 dark:border-gray-700 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%] bg-indigo-50 dark:bg-gray-700 overflow-hidden">
        <img
          src={product.image_url || `https://source.unsplash.com/random/300x300/?tech-${product.id}`}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-center object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Product badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.featured && <ProductBadge type="featured" />}
          {product.discount_percentage && <ProductBadge type="sale" value={product.discount_percentage} />}
          {product.inventory_count <= 5 && product.inventory_count > 0 && (
            <ProductBadge type="low-stock" value={product.inventory_count} />
          )}
          {product.eco_friendly && <ProductBadge type="eco-friendly" />}
        </div>

        {/* Out of stock overlay */}
        {product.inventory_count === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
            <ProductBadge type="out-of-stock" />
          </div>
        )}
        
        {/* Action buttons */}
        {showActions && product.inventory_count > 0 && (
          <div 
            className={`absolute right-2 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <button
              onClick={handleQuickView}
              aria-label={`Quick view ${product.name}`}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 rounded-full shadow-md hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={handleAddToWishlist}
              aria-label={`Add ${product.name} to wishlist`}
              className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-2 rounded-full shadow-md hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              <Heart size={18} />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        {/* Rating stars if available */}
        {product.rating && (
          <div className="flex items-center mb-1">
            {[...Array(5)].map((_, index) => (
              <svg 
                key={index} 
                className={`w-4 h-4 ${
                  index < Math.floor(product.rating!) 
                    ? 'text-yellow-400' 
                    : index < product.rating! 
                      ? 'text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                }`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        )}
        
        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
          <Link to={`/products/${product.id}`} className="after:absolute after:inset-0 focus:outline-none focus:underline">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 flex-grow">{product.description}</p>
        
        {/* Product info section */}
        <div className="mb-3 space-y-1">
          {product.manufacturer_location && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <MapPin size={12} className="mr-1" />
              <span>Made in {product.manufacturer_location}</span>
            </div>
          )}
          
          {formattedReleaseDate && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar size={12} className="mr-1" />
              <span>Released: {formattedReleaseDate}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {discountedPrice ? (
              <>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  ₵{discountedPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  ₵{product.price.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                ₵{product.price.toFixed(2)}
              </p>
            )}
          </div>
          
          {showActions && product.inventory_count > 0 && (
            <button
              onClick={handleAddToCart}
              disabled={isAddedToCart}
              className={`flex items-center justify-center rounded-full p-2 transition-all ${
                isAddedToCart 
                  ? 'bg-purple-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              aria-label={`Add ${product.name} to cart`}
            >
              {isAddedToCart ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Category Card Component
export const CategoryCard: React.FC<CategoryCardProps> = ({ category, variant = 'default' }) => {
  // Generate consistent color based on category id
  const colors = [
    { bg: 'bg-indigo-500', light: 'bg-indigo-100', text: 'text-indigo-800' },
    { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-800' },
    { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-800' },
    { bg: 'bg-violet-500', light: 'bg-violet-200', text: 'text-violet-900' },
    { bg: 'bg-cyan-500', light: 'bg-cyan-100', text: 'text-cyan-800' },
    { bg: 'bg-fuchsia-500', light: 'bg-fuchsia-100', text: 'text-fuchsia-800' }
  ];
  const colorSet = colors[category.id % colors.length];

  if (variant === 'compact') {
    return (
      <Link
        to={`/products?category=${category.id}`}
        className="flex items-center p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className={`${colorSet.light} dark:${colorSet.bg} dark:bg-opacity-20 ${colorSet.text} dark:text-white w-10 h-10 flex items-center justify-center rounded-full mr-3`}>
          <span className="font-semibold">{category.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
          {category.product_count !== undefined && (
            <p className="text-xs text-gray-600 dark:text-gray-400">{category.product_count} products</p>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/products?category=${category.id}`}
        className="relative group overflow-hidden rounded-lg shadow-md flex h-48"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
        <img 
          src={category.image_url || `https://source.unsplash.com/random/600x400/?tech-${category.name}`}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="relative z-20 p-5 mt-auto text-white">
          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-gray-200 mb-2 line-clamp-2">{category.description}</p>
          )}
          {category.product_count !== undefined && (
            <p className="text-xs text-gray-300">{category.product_count} products</p>
          )}
          <span className="inline-flex items-center text-sm font-medium mt-2 group-hover:underline">
            Shop now
            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/products?category=${category.id}`}
      className="group block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-gray-700 h-full"
    >
      <div className={`${colorSet.bg} dark:${colorSet.bg} dark:bg-opacity-80 h-32 flex items-center justify-center overflow-hidden relative`}>
        {category.image_url ? (
          <>
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <img
              src={category.image_url}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="relative z-10 text-white text-2xl font-bold">{category.name}</span>
          </>
        ) : (
          <span className="text-white text-2xl font-bold">{category.name.charAt(0)}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{category.description}</p>
        )}
        {category.product_count !== undefined && (
          <p className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {category.product_count} products
          </p>
        )}
      </div>
    </Link>
  );
};

// Example of a layout component using both cards
export const ProductCatalog: React.FC<{
  products: Product[];
  categories: Category[];
  featuredCategory?: Category;
}> = ({ products, categories, featuredCategory }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  
  const filteredProducts = activeCategory
    ? products.filter(p => p.category_id === activeCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Featured category banner */}
      {featuredCategory && (
        <div className="mb-12">
          <CategoryCard category={featuredCategory} variant="featured" />
        </div>
      )}
      
      {/* Category pills */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-200 dark:hover:bg-gray-600'
            }`}
          >
            All Products
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(p) => console.log('Added to cart:', p.name)}
            onAddToWishlist={(p) => console.log('Added to wishlist:', p.name)}
            onQuickView={(p) => console.log('Quick view:', p.name)}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try selecting a different category or check back for new tech releases.</p>
        </div>
      )}
    </div>
  );
};

export default { ProductCard, CategoryCard, ProductCatalog, ProductBadge };