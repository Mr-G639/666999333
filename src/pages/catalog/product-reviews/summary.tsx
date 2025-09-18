// src/pages/home/category.tsx

import { useState } from "react";
import { useAtomValue } from "jotai";
import { categoriesState } from "@/state";
import { loadable } from "jotai/utils";
import TransitionLink from "@/components/transition-link";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { Icon } from "zmp-ui";

// Component con cho nút "Tất cả danh mục"
const AllCategoriesItem = () => (
  <TransitionLink
    className="flex flex-col items-center space-y-1 flex-none overflow-hidden cursor-pointer mx-auto"
    to="/categories"
  >
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <Icon icon="zi-more-grid" className="text-gray-500" />
    </div>
    <div className="text-center text-3xs w-full line-clamp-2 text-subtitle">
      Tất cả
    </div>
  </TransitionLink>
);

const loadableCategoriesState = loadable(categoriesState);

export default function Category() {
  const [expanded, setExpanded] = useState(false);
  const categoriesLoadable = useAtomValue(loadableCategoriesState);

  // Hiệu ứng chuyển động cho chiều cao của container
  const springProps = useSpring({
    height: expanded ? 180 : 90, // Chiều cao cho 2 hàng và 1 hàng
    config: { tension: 300, friction: 30 },
  });

  // Xử lý thao tác vuốt của người dùng
  const bind = useDrag(({ swipe: [swipeX], down }) => {
    // Chỉ thay đổi trạng thái khi người dùng đã nhấc ngón tay ra
    if (!down) {
      if (swipeX === -1) setExpanded(true); // Vuốt sang trái -> Mở rộng
      if (swipeX === 1) setExpanded(false); // Vuốt sang phải -> Thu gọn
    }
  }, { axis: 'x' }); // Chỉ lắng nghe cử chỉ vuốt ngang

  // Giao diện khi đang tải dữ liệu
  if (categoriesLoadable.state === 'loading') {
    return (
      <div className="bg-section p-4 h-[90px] overflow-hidden">
          <div className="grid grid-flow-col gap-x-2 gap-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-1 flex-none overflow-hidden mx-auto">
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="text-center text-3xs w-16 h-3 bg-gray-200 animate-pulse rounded mt-1"></div>
              </div>
            ))}
          </div>
      </div>
    );
  }

  if (categoriesLoadable.state === 'hasError') {
    return <div className="p-4 text-red-500">Lỗi tải danh mục.</div>;
  }

  const categories = categoriesLoadable.data;
  // Giới hạn số lượng danh mục hiển thị, chừa 1 vị trí cho nút "Tất cả"
  const itemsToShow = categories.slice(0, 9); 

  return (
    // {...bind()} để kích hoạt tính năng vuốt
    <div {...bind()} className="bg-section p-4 overflow-hidden" style={{ touchAction: 'pan-y' }}>
      <animated.div style={springProps} className="overflow-hidden">
        <div
          className="grid gap-y-4"
          style={{
            gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
            gridAutoFlow: 'column',
            // Tự động tính toán số cột dựa trên số lượng item
            gridTemplateColumns: `repeat(${Math.ceil((itemsToShow.length + 1) / 2)}, 1fr)`,
          }}
        >
          {itemsToShow.map((category) => (
            <TransitionLink
              key={category.id}
              className="flex flex-col items-center space-y-1 flex-none overflow-hidden cursor-pointer mx-auto"
              to={`/category/${category.id}`}
            >
              <img
                src={category.image}
                className="w-12 h-12 object-cover rounded-full bg-skeleton"
                alt={category.name}
              />
              <div className="text-center text-3xs w-full line-clamp-2 text-subtitle">
                {category.name}
              </div>
            </TransitionLink>
          ))}
          {/* Luôn hiển thị nút "Tất cả" ở cuối */}
          <AllCategoriesItem />
        </div>
      </animated.div>
    </div>
  );
}