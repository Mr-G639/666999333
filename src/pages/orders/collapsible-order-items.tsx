// src/pages/orders/collapsible-order-items.tsx

import { CartItem } from "@/types";
import OrderItem from "./order-item";
import { useState } from "react";
import { Icon, List } from "zmp-ui";

function CollapsibleOrderItems(props: {
  items: CartItem[];
  defaultExpanded?: boolean;
  itemsClickable?: boolean; // Thêm prop này
}) {
  const [collapsed, setCollapsed] = useState(
    props.defaultExpanded ? false : true
  );
  const displayItems = collapsed ? props.items.slice(0, 1) : props.items;

  return (
    <>
      <List noSpacing>
        {displayItems.map((item) => (
          // Truyền prop `clickable` xuống cho mỗi OrderItem
          <OrderItem key={item.product.id} {...item} clickable={props.itemsClickable} />
        ))}
      </List>
      {displayItems.length < props.items.length && (
        <button
          className="w-full flex justify-center items-center space-x-1 text-xs p-2 -mt-4 transition-all relative"
          onClick={(e) => {
            e.stopPropagation();
            document.startViewTransition(() => {
              setCollapsed(false);
            });
          }}
        >
          <span>Xem thêm</span>
          <Icon icon="zi-chevron-down" />
        </button>
      )}
    </>
  );
}

export default CollapsibleOrderItems;