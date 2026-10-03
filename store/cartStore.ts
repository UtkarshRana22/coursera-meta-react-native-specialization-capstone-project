import { create } from 'zustand';

export interface Product {
    id: number;
    name: string;
    reference_name: string;
    description: string;
    price: number;
    photo: string;
    quantity: number;
}

export interface CartState {
    products: Array<Product>
    items: number;
    total: number;
    addProduct: (product: Product) => void;
    reduceProduct: (product: Product) => void;
    clearCart: () => void;
}

const useCartStore = create<CartState>()((set) => ({
    products: [],
    items: 0,
    total: 0,
    addProduct: (product) => {
        set((state) => {
            state.items += 1;
            state.total += product.price;
            const hasProduct = state.products.find((p) => p.id === product.id)

            if (hasProduct) {
                hasProduct.quantity += 1;
                return { products: [...state.products] }
            } else {
                return { products: [...state.products, { ...product }] }
            }
        });
    },
    reduceProduct: (product) => {
        set((state) => {
            state.items -= 1;
            state.total -= product.price;
            return {
                products: state.products.map((p) => {
                    if (p.id === product.id) {
                        p.quantity -= 1;
                    }
                    return p;
                })
                    .filter((p) => p.quantity > 0)
            }
        })
    },
    clearCart: () => {
        set({
            products: [],
            items: 0,
            total: 0
        })
    }
}));

export default useCartStore;