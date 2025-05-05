"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Formation {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

interface CartItem extends Formation {
  quantity: number;
}

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem("formation-cart");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("formation-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoading]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const increaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, right: "-100vw" }}
      animate={{ opacity: 1, right: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut", delay: 0 }}
      exit={{ opacity: 0, right: "-100vw" }}
      className={
        "fixed right-4 rounded-md h-[100%] w-[100vw] lg:w-[30vw] z-50 bg-sky-100 p-4"
      }
    >
      <button
        onClick={onClose}
        className="btn absolute right-2 top-2 bg-amber-300 hover:bg-amber-400 drawer-button shadow-none text-slate-900 border-none "
      >
        Fermer le panier
      </button>
      <h2 className="text-lg font-bold text-slate-900">Mon Panier</h2>
      {isLoading ? (
        <p className="text-slate-600">Chargement...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-slate-600">Votre panier est vide.</p>
      ) : (
        <div className="overflow-y-auto max-h-[60vh]">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center w-full">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="w-16 h-16 object-cover mr-4"
                  />
                )}
                <div>
                  <h3 className="text-md font-semibold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600">{`Prix: ${item.price} €`}</p>
                  <p className="text-sm text-slate-600">{`Quantité: ${item.quantity}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="btn btn-xs bg-yellow-300 hover:bg-yellow-400"
                >
                  +
                </button>
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="btn btn-xs bg-yellow-300 hover:bg-yellow-400"
                >
                  -
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="btn btn-xs bg-red-300 hover:bg-red-400"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 border-t pt-2">
            <h3 className="text-lg font-bold text-slate-900">{`Total: ${totalPrice} €`}</h3>
            <button
              onClick={clearCart}
              className="btn btn-sm bg-red-500 hover:bg-red-600 mt-2"
            >
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
