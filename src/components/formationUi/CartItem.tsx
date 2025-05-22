import React from "react";
import { CartItem } from "@/types";

interface CartItemComponentProps {
  item: CartItem;
  onAdd?: () => void;
  onRemove?: () => void;
  adding?: boolean;
  removing?: boolean;
}

const CartItemComponent: React.FC<CartItemComponentProps> = ({
  item,
  onAdd,
  onRemove,
  adding,
  removing,
}) => {
  return (
    <div className="flex items-center justify-between border rounded p-4 bg-white shadow">
      <div>
        <div className="font-semibold">{item.course_id}</div>
        <div className="text-sm text-slate-500">Quantité : {item.quantity}</div>
      </div>
      <div className="flex gap-2">
        {onAdd && (
          <button
            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
            onClick={onAdd}
            disabled={adding}
          >
            +
          </button>
        )}
        {onRemove && (
          <button
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
            onClick={onRemove}
            disabled={removing}
          >
            -
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemComponent;
