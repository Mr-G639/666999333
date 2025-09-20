// File: src/pages/home/index.tsx

import Banners from "./banners";
import Category from "./category";
import FlashSales from "./flash-sales";
import AllProducts from "./all-products";
import CategorySlider from "@/components/category-slider"; // <-- Thêm import
import { useAtomValue } from "jotai"; // <-- Thêm import
import { mainScrollState } from "@/state"; // <-- Thêm import
import { useLayoutEffect, useRef, useState } from "react"; // <-- Thêm import

const HomePage: React.FunctionComponent = () => {
  const scrollY = useAtomValue(mainScrollState);
  const categoryRef = useRef<HTMLDivElement>(null);
  
  const [categoryHeaderPosition, setCategoryHeaderPosition] = useState(0);
  const [showStickySlider, setShowStickySlider] = useState(false);

  // Lấy vị trí của component Category gốc sau khi nó được render
  useLayoutEffect(() => {
    if (categoryRef.current) {
      setCategoryHeaderPosition(categoryRef.current.offsetTop + categoryRef.current.offsetHeight);
    }
  }, []);
  
  // Quyết định khi nào hiển thị slider dính
  useLayoutEffect(() => {
    if (categoryHeaderPosition > 0) {
      setShowStickySlider(scrollY > categoryHeaderPosition);
    }
  }, [scrollY, categoryHeaderPosition]);

  return (
    <div className="min-h-full space-y-2 pb-2 relative">
      {/* Thanh danh mục dính, chỉ hiển thị khi cần */}
      <div 
        className={`sticky top-0 z-10 bg-background shadow-md transition-transform duration-300 ${
          showStickySlider ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <CategorySlider />
      </div>

      {/* Gắn ref vào component Category gốc để lấy vị trí */}
      <div ref={categoryRef}>
        <Category />
      </div>
      
      <div className="bg-section">
        <Banners />
      </div>
      <FlashSales />
      <AllProducts />
    </div>
  );
};

export default HomePage;