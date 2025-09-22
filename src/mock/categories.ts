// src/mock/categories.ts

import { Category } from "@/types";

// Import icons for top-level categories
import TBDD from "@/static/category/TBDD.png";
import QANA from "@/static/category/QANA.png";
import QANu from "@/static/category/QANu.png";
// Other icons can be used for sub-categories if needed in the future
import GDN from "@/static/category/GDN.png";
import MVB from "@/static/category/MVB.png";
import VNA from "@/static/category/VNA.png";
import GDNU from "@/static/category/GDNU.png";
import TVNU from "@/static/category/TVNU.png";
import GDNCDS from "@/static/category/GDNCDS.png";

export const categories: Category[] = [
  {
    id: 1,
    name: "Thiết bị điện tử",
    icon: TBDD,
  },
  {
    id: 2,
    name: "Thời trang nam",
    icon: QANA,
    // Danh mục con cho "Thời trang nam"
    children: [
      { id: 201, name: "Quần áo nam", icon: QANA },
      { id: 202, name: "Giày dép nam", icon: GDN },
      { id: 203, name: "Mũ và phụ kiện", icon: MVB },
      { id: 204, name: "Ví da nam", icon: VNA },
      { id: 205, name: "Giày cao cấp", icon: GDNCDS },
    ],
  },
  {
    id: 3,
    name: "Thời trang nữ",
    icon: QANu,
    // Danh mục con cho "Thời trang nữ"
    children: [
      { id: 301, name: "Quần áo nữ", icon: QANu },
      { id: 302, name: "Giày dép nữ", icon: GDNU },
      { id: 303, name: "Túi xách & Trang sức", icon: TVNU },
    ],
  },
  // Bạn có thể thêm các danh mục cấp cao khác ở đây
  // Ví dụ:
  // {
  //   id: 4,
  //   name: "Nhà cửa & Đời sống",
  //   icon: SomeOtherIcon,
  // },
];