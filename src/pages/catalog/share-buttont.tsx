// src/pages/catalog/share-button.tsx

import { FC } from 'react'; // Sửa: Chỉ import FC vì React không cần thiết
import { openShareSheet } from "zmp-sdk/apis";
import { Icon } from "zmp-ui";

import { ShareDecor } from "@/components/vectors";
import { Product } from "@/types";

type Props = {
  product: Product;
};

/**
 * Component nút bấm cho phép người dùng chia sẻ thông tin sản phẩm
 * thông qua Zalo Share Sheet.
 * @param props Component props
 * @param props.product Thông tin sản phẩm cần chia sẻ.
 */
const ShareButton: FC<Props> = ({ product }) => {

  /**
   * Xử lý sự kiện khi người dùng nhấn nút chia sẻ.
   * Mở Zalo Share Sheet với thông tin của sản phẩm.
   */
  const handleShare = () => {
    const thumbnailUrl = product.images?.[0];

    openShareSheet({
      type: "zmp_deep_link",
      data: {
        title: product.name,
        thumbnail: thumbnailUrl,
        path: `/product/${product.id}`,
      },
    }).catch(err => {
      console.error("Lỗi khi mở Share Sheet:", err);
    });
  };

  return (
    <button
      className="relative h-9 rounded-lg cursor-pointer overflow-hidden w-full"
      onClick={handleShare}
    >
      <div className="absolute inset-0 bg-[var(--zaui-light-button-secondary-background)] opacity-50" />
      <ShareDecor className="absolute inset-0" />
      <div className="relative flex justify-center items-center space-x-1 text-foreground text-sm font-medium p-2 h-full">
        <span>Chia sẻ ngay cho bạn bè</span>
        <Icon icon="zi-chevron-right" />
      </div>
    </button>
  );
};

export default ShareButton;