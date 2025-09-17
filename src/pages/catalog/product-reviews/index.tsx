import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Avatar, Box, Text, Icon } from 'zmp-ui';
import { reviewsState, loadableUserInfoState } from '@/state';
import { Review } from '@/types';
import Section from '@/components/section';
import { chooseImage } from 'zmp-sdk/apis';

// Component con để hiển thị từng đánh giá
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  // Hàm tính toán thời gian tương đối, ví dụ: "5 phút trước"
  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " năm";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " tháng";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " ngày";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " giờ";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " phút";
    return Math.floor(seconds) + " giây";
  };

  return (
    <Box flex className="space-x-2 py-2">
      <Avatar size={32} src={review.author.avatar} />
      <Box className="flex-1">
        <Box className="bg-gray-100 rounded-xl p-2">
          <Text size="small" bold>{review.author.name}</Text>
          <Text size="small" className="whitespace-pre-wrap">{review.text}</Text>
        </Box>
        {/* Hiển thị hình ảnh của đánh giá (nếu có) */}
        {review.images && review.images.length > 0 && (
          <Box className="pt-2 grid grid-cols-3 gap-1">
            {review.images.map((img, index) => (
              <img key={index} src={img} className="w-full aspect-square object-cover rounded-lg bg-skeleton" alt={`Review image ${index + 1}`} />
            ))}
          </Box>
        )}
        <Text size="xSmall" className="text-gray-500 pt-1">{timeAgo(review.timestamp)} trước</Text>
      </Box>
    </Box>
  );
};

// Component chính cho mục đánh giá
const ProductReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const reviews = useAtomValue(reviewsState(productId));
  const userInfoLoadable = useAtomValue(loadableUserInfoState);
  const [newReview, setNewReview] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);

  // Hàm xử lý việc chọn ảnh từ thiết bị
  const handleChooseImage = async () => {
    try {
      const { filePaths } = await chooseImage({
        count: 3 - reviewImages.length, // Cho phép chọn tối đa 3 ảnh
      });
      setReviewImages(prev => [...prev, ...filePaths]);
    } catch (error) {
      console.log("Lỗi hoặc người dùng hủy chọn ảnh:", error);
    }
  };

  // Hàm xử lý việc đăng đánh giá (hiện tại chỉ log ra console)
  const handlePostReview = () => {
    if (newReview.trim() || reviewImages.length > 0) {
      console.log('Đăng đánh giá:', { text: newReview, images: reviewImages });
      // Reset trạng thái sau khi "đăng"
      setNewReview('');
      setReviewImages([]);
    }
  };

  return (
    <Section title="Đánh giá sản phẩm">
      <Box className="p-4">
        {/* Hiển thị danh sách các đánh giá đã có */}
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))
        ) : (
          <Text className="text-center text-gray-500 py-4">Chưa có đánh giá nào cho sản phẩm này.</Text>
        )}

        {/* Khung nhập đánh giá, chỉ hiển thị khi người dùng đã đăng nhập */}
        {(userInfoLoadable.state === 'hasData' && userInfoLoadable.data) && (
          <Box className="mt-4">
            {/* Khu vực hiển thị ảnh đã chọn để chuẩn bị đăng */}
            {reviewImages.length > 0 && (
                <Box className="mb-2 grid grid-cols-4 gap-2">
                    {reviewImages.map((img, index) => (
                        <div key={index} className="relative">
                            <img src={img} className="w-full aspect-square object-cover rounded-lg" alt={`Preview ${index + 1}`} />
                            {/* SỬA LỖI: Bọc Icon trong một div để nhận sự kiện onClick */}
                            <div 
                              className="absolute -top-1 -right-1 bg-white rounded-full cursor-pointer" 
                              onClick={() => setReviewImages(prev => prev.filter((_, i) => i !== index))} 
                            >
                                <Icon icon="zi-close-circle-solid" />
                            </div>
                        </div>
                    ))}
                </Box>
            )}
            <Box flex className="space-x-2 items-center">
              <Avatar size={32} src={userInfoLoadable.data.avatar} />
              <div className="flex-1 relative">
                  <input
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      placeholder="Viết đánh giá..."
                      className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handlePostReview()}
                  />
                  {/* SỬA LỖI: Bọc Icon trong một div để nhận sự kiện onClick */}
                  <div
                    className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer" 
                    onClick={handleChooseImage} 
                  >
                    <Icon icon="zi-camera" />
                  </div>
              </div>
            </Box>
          </Box>
        )}
      </Box>
    </Section>
  );
};

export default ProductReviews;

