import { useState } from "react";
import { EditorValue } from "./editor";

export const initialEditorValue: EditorValue =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

export const useEditor = () => {
  const [value, setValue] = useState<EditorValue>(initialEditorValue);

  const [renderKey, setRenderKey] = useState(false);

  const rerender = () => {
    setRenderKey((prev) => !prev);
  };

  const onChange = (editorValue: EditorValue) => {
    setValue(editorValue);
  };

  const reset = () => {
    setValue(initialEditorValue);
    rerender();
  };

  const key = JSON.stringify(renderKey);

  return {
    value,
    onChange,
    reset,
    key,
  };
};
