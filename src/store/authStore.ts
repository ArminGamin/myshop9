import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
  createdAt: Date;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  trackingNumber?: string;
}

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (addressId: string) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login
        const user: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          addresses: [],
          orders: [],
          createdAt: new Date(),
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      register: async (userData: Partial<User>) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user: User = {
          id: Date.now().toString(),
          email: userData.email || '',
          name: userData.name || '',
          phone: userData.phone,
          addresses: [],
          orders: [],
          createdAt: new Date(),
        };

        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },

      addAddress: (address: Omit<Address, 'id'>) => {
        const { user } = get();
        if (user) {
          const newAddress: Address = {
            ...address,
            id: Date.now().toString(),
          };
          set({
            user: {
              ...user,
              addresses: [...user.addresses, newAddress],
            },
          });
        }
      },

      removeAddress: (addressId: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              addresses: user.addresses.filter(addr => addr.id !== addressId),
            },
          });
        }
      },

      updateAddress: (addressId: string, address: Partial<Address>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              addresses: user.addresses.map(addr =>
                addr.id === addressId ? { ...addr, ...address } : addr
              ),
            },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);


