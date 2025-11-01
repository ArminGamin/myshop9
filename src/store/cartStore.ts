import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './authStore';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemById: (itemId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item: Omit<CartItem, 'id'>) => {
        // Do not round up fractional cents when normalizing UI price values.
        // Truncate to 2 decimals to avoid inflating totals toward free-shipping thresholds.
        const normalizePrice = (p: number) => Math.floor(Number(p) * 100) / 100;
        // normalize incoming price to 2 decimals to avoid float drift
        item.price = normalizePrice(item.price);
        const { items } = get();
        const existingItem = items.find(
          i => i.productId === item.productId && 
               i.selectedColor === item.selectedColor && 
               i.selectedSize === item.selectedSize
        );

        if (existingItem) {
          set(state => ({
            items: state.items.map(i =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          }));
        } else {
          const newItem: CartItem = {
            ...item,
            id: Date.now().toString(),
          };
          set(state => ({ items: [...state.items, newItem] }));
        }
        // Update totals using integer cents to ensure exact sums
        set(state => {
          const totalItems = state.items.reduce((sum, it) => sum + it.quantity, 0);
          const totalCents = state.items.reduce((sum, it) => sum + Math.round(Number(it.price) * 100) * it.quantity, 0);
          return { totalItems, totalPrice: totalCents / 100 };
        });
      },

      removeItem: (itemId: string) => {
        set(state => {
          const newItems = state.items.filter(item => item.id !== itemId);
          const totalItems = newItems.reduce((sum, it) => sum + it.quantity, 0);
          const totalCents = newItems.reduce((sum, it) => sum + Math.round(Number(it.price) * 100) * it.quantity, 0);
          return { items: newItems, totalItems, totalPrice: totalCents / 100 };
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set(state => {
          const newItems = state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          );
          const totalItems = newItems.reduce((sum, it) => sum + it.quantity, 0);
          const totalCents = newItems.reduce((sum, it) => sum + Math.round(Number(it.price) * 100) * it.quantity, 0);
          return { items: newItems, totalItems, totalPrice: totalCents / 100 };
        });
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 });
      },

      getItemById: (itemId: string) => {
        return get().items.find(item => item.id === itemId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);


