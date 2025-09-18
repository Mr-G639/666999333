// src/pages/orders/order-item.tsx

import { CartItem } from "@/types";
import { formatPrice } from "@/utils/format";
import { List } from "zmp-ui";
import { useNavigate } from "react-router-dom";

// Thêm prop `clickable` để điều khiển hành vi
function OrderItem(props: CartItem & { clickable?: boolean }) {
  const navigate = useNavigate();
  const imageUrl = props.product?.images?.[0] ?? (props.product as any)?.image ?? "";

  const handleClick = () => {
    // Chỉ điều hướng nếu `clickable` là true
    if (props.clickable) {
      navigate(`/product/${props.product.id}`);
    }
  };

  return (
    <List.Item
      onClick={handleClick}
      // Thêm class `cursor-pointer` một cách có điều kiện để cải thiện UX
      className={props.clickable ? "cursor-pointer" : ""}
      prefix={
        <img 
          src={imageUrl} 
          className="w-14 h-14 rounded-lg bg-skeleton"
          alt={props.product.name}
        />
      }
      suffix={
        <div className="text-sm font-medium flex items-center h-full">
          x{props.quantity}
        </div>
      }
    >
      <div className="text-sm">{props.product.name}</div>
      <div className="text-sm font-bold mt-1">
        {formatPrice(props.product.price)}
      </div>
      {props.product.originalPrice && (
        <div className="line-through text-subtitle text-4xs">
          {formatPrice(props.product.originalPrice)}
        </div>
      )}
    </List.Item>
  );
}

export default OrderItem;