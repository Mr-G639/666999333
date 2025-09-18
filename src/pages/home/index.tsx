import Banners from "./banners";
import Category from "./category";
import FlashSales from "./flash-sales";
import AllProducts from "./all-products";

const HomePage: React.FunctionComponent = () => {
  return (
    // --- THAY ĐỔI TẠI ĐÂY ---
    <div className="min-h-full space-y-2 pb-2">
      <Category />
      <div className="bg-section">
        <Banners />
      </div>
      <FlashSales />
      <AllProducts />
    </div>
  );
};

export default HomePage;