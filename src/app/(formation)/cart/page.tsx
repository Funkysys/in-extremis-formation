"use client";
// import { useState, useEffect } from "react";
import {
  ADD_TO_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
} from "@/graphql/mutations/cart-mutations";
import { GET_CART_QUERY } from "@/graphql/queries/cart-queries";
import { useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
// import Image from "next/image";
import CartItemComponent from "@/components/formationUi/CartItem";
import { useToast } from "@/providers/ToastProvider";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { data, error, loading, refetch } = useQuery(GET_CART_QUERY);
  const [addToCart, { loading: addingToCart }] =
    useMutation(ADD_TO_CART_MUTATION);
  const [removeFromCart, { loading: removingFromCart }] = useMutation(
    REMOVE_FROM_CART_MUTATION
  );
  const router = useRouter();
  const { showToast } = useToast();

  if (loading)
    return (
      <div className="text-center py-10 text-lg">Chargement du panier...</div>
    );
  if (error)
    return (
      <div className="text-center py-10 text-red-600">
        Erreur lors du chargement du panier
      </div>
    );

  const cartItems: CartItem[] = data?.cart?.items || [];

  const handleAddToCart = async (courseId: string) => {
    try {
      await addToCart({ variables: { courseId } });
      await refetch();
      showToast("Le cours a été ajouté au panier avec succès", "success");
    } catch (error) {
      showToast("Une erreur est survenue lors de l'ajout au panier", "error");
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  const handleRemoveFromCart = async (courseId: string) => {
    try {
      await removeFromCart({ variables: { courseId } });
      await refetch();
      showToast("Le cours a été retiré du panier avec succès", "success");
    } catch (error) {
      showToast(
        "Une erreur est survenue lors de la suppression du panier",
        "error"
      );
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Mon panier</h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-slate-500">Votre panier est vide.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onAdd={() => handleAddToCart(item.id)}
              onRemove={() => handleRemoveFromCart(item.id)}
              adding={addingToCart}
              removing={removingFromCart}
            />
          ))}
          <div className="mt-4 border-t pt-4 flex justify-end">
            <button
              onClick={() => router.push("/checkout")}
              disabled={addingToCart || removingFromCart}
              className="btn btn-primary"
            >
              Passer à la caisse
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
