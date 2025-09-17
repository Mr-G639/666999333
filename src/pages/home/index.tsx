import Banners from "./banners";
import Category from "./category";
import FlashSales from "./flash-sales";
import AllProducts from "./all-products"; // <-- Thêm import

const HomePage: React.FunctionComponent = () => {
  return (
    <div className="min-h-full space-y-2 py-2">
      <Category />
      <div className="bg-section">
        <Banners />
      </div>
      <FlashSales />
      <AllProducts /> {/* <-- Thêm mục mới vào đây */}
    </div>
  );
};

export default HomePage;