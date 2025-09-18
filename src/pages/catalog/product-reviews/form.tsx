// src/pages/catalog/product-reviews/form.tsx

import { postReviewAtom } from '@/state';
import { useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// Sửa lỗi: Chỉ import các component thực sự có trong zmp-ui
import { Box, Button, Icon, Text } from 'zmp-ui';
import toast from 'react-hot-toast';

const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
  return (
    <Box flex className="justify-center items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} onClick={() => setRating(star)} className="cursor-pointer">
          <Icon
            icon={star <= rating ? 'zi-star-solid' : 'zi-star'}
            className="text-yellow-400 text-3xl"
          />
        </div>
      ))}
    </Box>
  );
};

const ProductReviewForm = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const postReview = useSetAtom(postReviewAtom);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }
    await postReview({ productId: Number(id), review: { rating, text, images } });
    // Reset form sau khi gửi
    setRating(5);
    setText('');
    setImages([]);
  };

  return (
    <Box className="p-4 space-y-4">
      <Text size="large" bold className="text-center">Viết đánh giá của bạn</Text>
      <StarRating rating={rating} setRating={setRating} />
      
      {/* Sửa lỗi: Sử dụng thẻ <textarea> tiêu chuẩn của HTML và tùy chỉnh CSS
        để giao diện đồng nhất với các component Input khác của zmp-ui.
      */}
      <textarea
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        rows={4}
        placeholder="Cảm nhận của bạn về sản phẩm..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      {/* TODO: Tích hợp chức năng upload ảnh ở đây */}
      <Button fullWidth onClick={handleSubmit}>Gửi đánh giá</Button>
    </Box>
  );
};

export default ProductReviewForm;