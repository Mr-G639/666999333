// src/pages/catalog/product-reviews/index.tsx

import React, { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Avatar, Box, Text, Icon, Button } from 'zmp-ui';
import { reviewsState, loadableUserInfoState, postReviewAtom } from '@/state';
import { Review } from '@/types';
import Section from '@/components/section';
import { chooseImage } from 'zmp-sdk/apis';

// Số lượng review hiển thị ban đầu
const INITIAL_REVIEW_COUNT = 6;

// Component con để hiển thị từng ngôi sao
const Star: React.FC<{ filled: boolean; onClick: () => void; }> = ({ filled, onClick }) => (
  <span onClick={onClick} className="cursor-pointer">
    <Icon icon={filled ? 'zi-star-solid' : 'zi-star'} className="text-yellow-400" />
  </span>
);

// Component con để hiển thị từng đánh giá
const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
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
    <Box flex className="space-x-2 py-2 border-b border-gray-100 last:border-b-0">
      <Avatar size={32} src={review.author.avatar} />
      <Box className="flex-1">
        <Text size="small" bold>{review.author.name}</Text>
        <Box flex className="items-center">
          {Array.from({ length: 5 }).map((_, i) => <Icon key={i} icon={i < review.rating ? 'zi-star-solid' : 'zi-star'} className="text-yellow-400 text-xs" />)}
        </Box>
        <Text size="small" className="whitespace-pre-wrap mt-1">{review.text}</Text>
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

// Component chính đã được nâng cấp
const ProductReviews: React.FC<{ productId: number }> = ({ productId }) => {
  const reviews = useAtomValue(reviewsState(productId));
  const userInfoLoadable = useAtomValue(loadableUserInfoState);
  const postReview = useSetAtom(postReviewAtom);

  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(0);
  const [newReview, setNewReview] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  
  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_REVIEW_COUNT);

  const handleChooseImage = async () => {
    try {
      const { filePaths } = await chooseImage({
        count: 3 - reviewImages.length,
      });
      setReviewImages(prev => [...prev, ...filePaths]);
    } catch (error) {
      console.log("Lỗi hoặc người dùng hủy chọn ảnh:", error);
    }
  };

  const handlePostReview = () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (newReview.trim() || reviewImages.length > 0) {
      postReview({ 
        productId, 
        review: { 
          text: newReview, 
          images: reviewImages,
          rating: rating
        } 
      });
      setNewReview('');
      setReviewImages([]);
      setRating(0);
    }
  };

  return (
    <Section title="Đánh giá sản phẩm">
      <Box className="p-4">
        {reviews.length > 0 ? (
          <>
            {displayedReviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
            {!showAll && reviews.length > INITIAL_REVIEW_COUNT && (
              <Button
                onClick={() => setShowAll(true)}
                fullWidth
                variant="tertiary"
                className="mt-4"
              >
                Xem thêm {reviews.length - INITIAL_REVIEW_COUNT} đánh giá
              </Button>
            )}
          </>
        ) : (
          <Text className="text-center text-gray-500 py-4">Chưa có đánh giá nào cho sản phẩm này.</Text>
        )}

        {(userInfoLoadable.state === 'hasData' && userInfoLoadable.data) && (
          <Box className="mt-6">
            <Text bold className="text-center mb-2">Để lại đánh giá của bạn</Text>
            <Box className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} filled={star <= rating} onClick={() => setRating(star)} />
              ))}
            </Box>
            <div className="flex-1 relative border border-gray-200 rounded-lg p-2">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Sản phẩm tuyệt vời..."
                className="w-full bg-transparent focus:outline-none"
                rows={3}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center space-x-2">
                  {reviewImages.map((img, index) => (
                    <div key={index} className="relative w-12 h-12">
                      <img src={img} className="w-full h-full object-cover rounded" />
                      <div className="absolute -top-1 -right-1 bg-white rounded-full cursor-pointer" onClick={() => setReviewImages(p => p.filter((_, i) => i !== index))}>
                        <Icon icon="zi-close-circle-solid" />
                      </div>
                    </div>
                  ))}
                  {reviewImages.length < 3 && (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center cursor-pointer" onClick={handleChooseImage}>
                      <Icon icon="zi-camera" />
                    </div>
                  )}
                </div>
                <Button size="small" onClick={handlePostReview}>Gửi</Button>
              </div>
            </div>
          </Box>
        )}
      </Box>
    </Section>
  );
};

export default ProductReviews;