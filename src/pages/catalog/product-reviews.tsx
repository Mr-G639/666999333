import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { Avatar, Box, Text } from 'zmp-ui';
import { reviewsState, userInfoState } from '@/state';
import { Review } from '@/types';
import Section from '@/components/section';

// Component con để hiển thị từng đánh giá
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  // Hàm tính toán thời gian tương đối
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
      <Box className="flex-1 bg-gray-100 rounded-xl p-2">
        <Text size="small" bold>{review.author.name}</Text>
        <Text size="small" className="whitespace-pre-wrap">{review.text}</Text>
        <Text size="xSmall" className="text-gray-500 pt-1">{timeAgo(review.timestamp)} trước</Text>
      </Box>
    </Box>
  );
};

// Component chính cho mục đánh giá
const ProductReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const reviews = useAtomValue(reviewsState(productId));
  const userInfoLoadable = useAtomValue(userInfoState); // Sử dụng userInfo để biết đã đăng nhập chưa
  const [newReview, setNewReview] = useState('');

  const handlePostReview = () => {
    if (newReview.trim()) {
      // Trong thực tế, bạn sẽ gọi API để gửi đánh giá mới
      console.log('Posting review:', newReview);
      setNewReview(''); // Xóa nội dung input sau khi gửi
    }
  };

  return (
    <Section title="Đánh giá sản phẩm">
      <Box className="p-4">
        {/* Hiển thị danh sách đánh giá */}
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))
        ) : (
          <Text className="text-center text-gray-500 py-4">Chưa có đánh giá nào cho sản phẩm này.</Text>
        )}

        {/* Khung nhập đánh giá, chỉ hiển thị khi đã đăng nhập */}
        {(userInfoLoadable) && (
          <Box flex className="space-x-2 mt-4 items-center">
            <Avatar size={32} src={userInfoLoadable.avatar} />
            <div className="flex-1 relative">
                <input
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Viết đánh giá..."
                    className="w-full bg-gray-100 rounded-full py-2 px-4 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handlePostReview()}
                />
            </div>
          </Box>
        )}
      </Box>
    </Section>
  );
};

export default ProductReviews;
