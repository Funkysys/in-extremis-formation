"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CART_QUERY } from "@/graphql/queries/cart-queries";
import { ADD_TO_CART_MUTATION, REMOVE_FROM_CART_MUTATION, CLEAR_CART_MUTATION } from "@/graphql/mutations/cart-mutations";
import { CartItem } from "@/types";
import { useToaster } from "@/providers/ToasterProvider";

interface CartProps {
  onClose: () => void;
}

export default function Cart({ onClose }: CartProps) {
  let userId: string | null = null;
  if (typeof window !== "undefined") {
    userId = localStorage.getItem("userId");
  }

  const { data, error, loading, refetch } = useQuery(GET_CART_QUERY, {
    variables: { userId },
    skip: !userId,
  });
  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART_MUTATION);
  const [removeFromCart, { loading: removingFromCart }] = useMutation(REMOVE_FROM_CART_MUTATION);
  const [clearCartMutation, { loading: clearingCart }] = useMutation(CLEAR_CART_MUTATION);
  const { addToast } = useToaster();

  if (error) {
    console.log(error);
    
  }

  const cartItems: CartItem[] = data?.cartByUser?.cartItems || [];

  const totalPrice = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);

  const handleAddToCart = async (courseId: string) => {
    try {
      await addToCart({ variables: { courseId } });
      await refetch();
      addToast("Le cours a été ajouté au panier", "success");
    } catch (err) {
      addToast("Erreur lors de l'ajout au panier", "error");
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await removeFromCart({ variables: { cartItemId } });
      await refetch();
      addToast("Le cours a été retiré du panier", "success");
    } catch (err) {
      addToast("Erreur lors de la suppression du panier", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartMutation({ variables: { cartId: data.cart.id } });
      await refetch();
      addToast("Panier vidé", "success");
    } catch (err) {
      addToast("Erreur lors du vidage du panier", "error");
    }
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
      <h2 className="text-lg font-bold text-slate-900 border-b-2 border-slate-400">Mon Panier</h2>
      {loading ? (
        <p className="text-slate-600">Chargement...</p>
      ) : error ? (
        <p className="text-red-600 py-4">Erreur lors du chargement du panier</p>
      ) : cartItems.length === 0 ? (
        <p className="text-slate-600 py-4">Votre panier est vide.</p>
      ) : (
        <div className="overflow-y-auto max-h-[60vh] py-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              <div className="flex items-center w-full">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title || item.course_id}
                    fill
                    className="w-16 h-16 object-cover mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-300 mr-4 flex items-center justify-center text-slate-500">?</div>
                )}
                <div>
                  <h3 className="text-md font-semibold text-slate-800">
                    {item.title || item.course_id}
                  </h3>
                  <p className="text-sm text-slate-600">{`Prix: ${item.price !== undefined ? item.price + ' €' : '?'}`}</p>
                  <p className="text-sm text-slate-600">{`Quantité: ${item.quantity}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAddToCart(item.course_id)}
                  className="btn btn-xs bg-yellow-300 hover:bg-yellow-400"
                  disabled={addingToCart}
                  title="Ajouter 1"
                >
                  +
                </button>
                <button
                  onClick={() => item.quantity > 1 ? handleRemoveFromCart(item.id) : undefined}
                  className="btn btn-xs bg-yellow-300 hover:bg-yellow-400"
                  disabled={removingFromCart || item.quantity <= 1}
                  title={item.quantity <= 1 ? "Impossible de descendre sous 1" : "Retirer 1"}
                >
                  -
                </button>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="btn btn-xs bg-red-300 hover:bg-red-400"
                  disabled={removingFromCart}
                  title="Supprimer l'article du panier"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
          <div className="mt-4 border-t pt-2">
            <h3 className="text-lg font-bold text-slate-900">{`Total: ${totalPrice} €`}</h3>
            <button
              onClick={handleClearCart}
              className="btn btn-sm bg-red-500 hover:bg-red-600 mt-2"
              disabled={clearingCart}
            >
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
