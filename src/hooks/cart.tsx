import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';


interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const Storage = '@GoMarketplace:products';


const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storageProducts = await AsyncStorage.getItem(
        `${Storage}`,
      ); // buscar todos os produtos

      //verificar os produtos e passar
      if (storageProducts) {
        setProducts([...JSON.parse(storageProducts)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    // Verificar se  o produto existe
    const productExists = products.find(p => product.id === p.id);

    //verificar se os produto ja foi adicionado e caso esteja da mais um
    if (productExists) {
      setProducts(
        //mapeando todos os produtos e verificando se os mesmos são iguais
        products.map(p =>
          p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      //se não existir vai criar um e adicionar
      setProducts([...products, { ...product, quantity: 1 }]);
    }

    await AsyncStorage.setItem(
      `${Storage}`,
      JSON.stringify(products),
    );

  }, [products]);

  const increment = useCallback(async id => {

    //verificar se a id existe e adicionar
    const newProducts = products.map
      (product => product.id === id ?
        { ...product, quantity: product.quantity + 1 } : product);

    setProducts(newProducts);

    await AsyncStorage.setItem(
      `${Storage}`,
      JSON.stringify(newProducts),
    );
  }, [products]);

  const decrement = useCallback(async id => {
    //verificar se a id existe e decremetar
    const newProducts = products.map
      (product => product.id === id ?
        { ...product, quantity: product.quantity - 1 } : product);

    setProducts(newProducts);

    await AsyncStorage.setItem(
      `${Storage}`,
      JSON.stringify(newProducts),
    );
  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
