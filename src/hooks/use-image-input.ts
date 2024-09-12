import { useRef, useState } from "react";
import { useInput } from "./use-input";

export const useImageInput = (defaultValue?: File) => {
  const [value, setValue] = useState(defaultValue ?? null);

  const altInput = useInput();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const onChange = (value: File | null) => {
    setValue(value);
  };

  const reset = () => {
    setValue(null);
    altInput.setValue("");
  };

  const onRemove = () => {
    reset();
  };

  return {
    value,
    onChange,
    setValue,
    buttonRef,
    reset,
    onRemove,
    alt: {
      value: altInput.value,
      setValue: altInput.setValue,
    },
  };
};
