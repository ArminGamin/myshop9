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

        // Update totals
        set(state => ({
          totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }));
      },

      removeItem: (itemId: string) => {
        set(state => {
          const newItems = state.items.filter(item => item.id !== itemId);
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          };
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
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          };
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


