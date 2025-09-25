// src/components/quantity-input.tsx

import React, { FC, useEffect, useState, useCallback } from "react";
import { Button } from "zmp-ui";
import { MinusIcon, PlusIcon } from "./vectors";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
}

/**
 * Component input cho phép người dùng chọn số lượng.
 * Được tối ưu hóa bằng React.memo để tránh re-render không cần thiết.
 */
const QuantityInput: FC<QuantityInputProps> = ({
  value,
  onChange,
  minValue = 0,
}) => {
  const [localValue, setLocalValue] = useState(String(value));

  // Đồng bộ state nội bộ khi prop `value` từ bên ngoài thay đổi
  useEffect(() => {
    if (Number(localValue) !== value) {
      setLocalValue(String(value));
    }
  }, [value]);

  // Xử lý khi người dùng thay đổi giá trị trong input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setLocalValue(numericValue);
  }, []);

  // Xử lý khi người dùng rời khỏi input (onBlur)
  const handleBlur = useCallback(() => {
    const finalValue = Math.max(minValue, Number(localValue) || minValue);
    if (finalValue !== value) {
      onChange(finalValue);
    }
    // Luôn đồng bộ lại giá trị hiển thị để tránh sai lệch
    setLocalValue(String(finalValue));
  }, [localValue, value, minValue, onChange]);

  // Xử lý khi nhấn nút giảm số lượng
  const handleDecrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(Math.max(minValue, value - 1));
  }, [value, minValue, onChange]);

  // Xử lý khi nhấn nút tăng số lượng
  const handleIncrement = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value + 1);
  }, [value, onChange]);

  return (
    <div className="w-full flex items-center">
      <Button
        size="small"
        variant="tertiary"
        className="min-w-0 aspect-square"
        onClick={handleDecrement}
        disabled={value <= minValue} // Vô hiệu hóa nút khi đạt giá trị tối thiểu
      >
        <MinusIcon width={14} height={14} />
      </Button>
      <input
        style={{ width: `calc(${localValue.length}ch + 16px)` }}
        className="flex-1 text-center font-medium text-xs px-2 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        inputMode="numeric"
        value={localValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onClick={(e) => e.stopPropagation()}
      />
      <Button
        size="small"
        variant="tertiary"
        className="min-w-0 aspect-square"
        onClick={handleIncrement}
      >
        <PlusIcon width={14} height={14} />
      </Button>
    </div>
  );
};

// [TỐI ƯU HIỆU NĂNG]
// Bọc component bằng React.memo. Component này sẽ chỉ re-render nếu các props
// của nó (value, onChange, minValue) thực sự thay đổi.
export default React.memo(QuantityInput);