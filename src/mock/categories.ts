// src/mock/categories.ts

// Refactor: Import trực tiếp các module ảnh thay vì dùng chuỗi tên file.
// Đây là cách làm an toàn, được bundler (Vite) hỗ trợ để đảm bảo đường dẫn luôn đúng.
import QANu from "@/static/category/QANu.png";
import TVNU from "@/static/category/TVNU.png";
import MVB from "@/static/category/MVB.png";
import VNA from "@/static/category/VNA.png";
import TBDD from "@/static/category/TBDD.png";
import QANA from "@/static/category/QANA.png";
import GDNU from "@/static/category/GDNU.png";
import GDNCDS from "@/static/category/GDNCDS.png";
import GDN from "@/static/category/GDN.png";

export const categories = [
  { id: 1, name: "Quần Áo Nữ", image: QANu },
  { id: 2, name: "Túi Ví Nữ", image: TVNU },
  { id: 3, name: "Mẹ & Bé", image: MVB },
  { id: 4, name: "Ví Nam", image: VNA },
  { id: 5, name: "Thiết Bị Di Động", image: TBDD },
  { id: 6, name: "Quần Áo Nam", image: QANA },
  { id: 7, name: "Giày Dép Nữ", image: GDNU },
  { id: 8, name: "Gia Dụng", image: GDNCDS },
  { id: 9, name: "Giày Dép Nam", image: GDN },
];