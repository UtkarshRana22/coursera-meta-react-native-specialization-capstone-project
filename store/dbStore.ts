import { create } from 'zustand';

export interface DBState {
    searchQuery: string;
    selectedCategory: number;
    categoriesReady: boolean;
    foodItemsReady: boolean;
    cartReady: boolean;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: number) => void;
    setCategoriesReady: (status: boolean) => void;
    setFoodItemsReady: (status: boolean) => void;
    setCartReady: (status: boolean) => void;
    clearDB: () => void;
}

const useDbStore = create<DBState>()((set) => ({
    searchQuery: '',
    selectedCategory: 1,
    categoriesReady: false,
    foodItemsReady: false,
    cartReady: false,
    setSelectedCategory: (categoryId) => {
        set(() => ({
            selectedCategory: categoryId,
        }));
    },
    setCategoriesReady: (status) => {
        set(() => ({
            categoriesReady: status
        }));
    },
    setFoodItemsReady: (status) => {
        set(() => ({
            foodItemsReady: status
        }));
    },
    setCartReady: (status) => {
        set(() => ({
            cartReady: status
        }));
    },
    setSearchQuery: (query) => {
        set(() => ({
            searchQuery: query
        }));
    },
    clearDB: () => {
        set({
            searchQuery: '',
            selectedCategory: 1,
            categoriesReady: false,
            foodItemsReady: false,
            cartReady: false
        })
    }
}));

export default useDbStore;