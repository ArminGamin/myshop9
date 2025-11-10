import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  imagesBySize?: string[][]; // optional: arrays of images per size (aligned with sizes)
  imagesByColor?: string[][]; // optional: arrays of images per color (aligned with colors)
  rating: number;
  reviews: number;
  discount: string;
  description: string;
  features: string[];
  colors: { name: string; value: string }[];
  sizes: { name: string; value: string }[];
  // Optional: multiple size groups (e.g., Adults and Kids), each with its own size list
  sizeGroups?: { label: string; sizes: { name: string; value: string }[] }[];
  sizeLabel?: string; // optional UI label for sizes (e.g., "Tipas")
  pricesByColor?: number[]; // optional per-variant current prices (aligned with colors)
  originalPricesByColor?: number[]; // optional per-variant original prices
  pricesBySize?: number[]; // optional per-size current prices (aligned with sizes)
  originalPricesBySize?: number[]; // optional per-size original prices
  category: string;
  tags: string[];
  stock: number;
  isNew: boolean;
  isPopular: boolean;
  createdAt: Date;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  tags?: string[];
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  filters: ProductFilter;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
  isLoading: boolean;
  setProducts: (products: Product[]) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<ProductFilter>) => void;
  setSortBy: (sortBy: ProductState['sortBy']) => void;
  filterProducts: () => void;
  getProductById: (id: number) => Product | undefined;
  getRelatedProducts: (productId: number, limit?: number) => Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],
      searchQuery: '',
      filters: {},
      sortBy: 'popular',
      isLoading: false,

      setProducts: (products: Product[]) => {
        set({ products, filteredProducts: products });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
        get().filterProducts();
      },

      setFilters: (newFilters: Partial<ProductFilter>) => {
        set(state => ({ filters: { ...state.filters, ...newFilters } }));
        get().filterProducts();
      },

      setSortBy: (sortBy: ProductState['sortBy']) => {
        set({ sortBy });
        get().filterProducts();
      },

      filterProducts: () => {
        const { products, searchQuery, filters, sortBy } = get();
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        // Category filter
        if (filters.category) {
          filtered = filtered.filter(product => product.category === filters.category);
        }

        // Price filter
        if (filters.minPrice !== undefined) {
          filtered = filtered.filter(product => product.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(product => product.price <= filters.maxPrice!);
        }

        // Rating filter
        if (filters.rating !== undefined) {
          filtered = filtered.filter(product => product.rating >= filters.rating!);
        }

        // Stock filter
        if (filters.inStock) {
          filtered = filtered.filter(product => product.stock > 0);
        }

        // Tags filter
        if (filters.tags && filters.tags.length > 0) {
          filtered = filtered.filter(product =>
            filters.tags!.some(tag => product.tags.includes(tag))
          );
        }

        // Sort
        switch (sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
            filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            break;
          case 'popular':
            filtered.sort((a, b) => {
              if (a.isPopular && !b.isPopular) return -1;
              if (!a.isPopular && b.isPopular) return 1;
              return b.reviews - a.reviews;
            });
            break;
        }

        set({ filteredProducts: filtered });
      },

      getProductById: (id: number) => {
        return get().products.find(product => product.id === id);
      },

      getRelatedProducts: (productId: number, limit = 4) => {
        const { products } = get();
        const product = products.find(p => p.id === productId);
        if (!product) return [];

        return products
          .filter(p => p.id !== productId && p.category === product.category)
          .slice(0, limit);
      },

      addProduct: (productData: Omit<Product, 'id'>) => {
        const { products } = get();
        const newProduct: Product = {
          ...productData,
          id: Date.now(),
        };
        set({ products: [...products, newProduct] });
        get().filterProducts();
      },

      updateProduct: (id: number, updates: Partial<Product>) => {
        set(state => ({
          products: state.products.map(product =>
            product.id === id ? { ...product, ...updates } : product
          ),
        }));
        get().filterProducts();
      },

      deleteProduct: (id: number) => {
        set(state => ({
          products: state.products.filter(product => product.id !== id),
        }));
        get().filterProducts();
      },
    }),
    {
      name: 'product-storage',
    }
  )
);


