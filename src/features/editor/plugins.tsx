import { AutoLinkPlugin as LexicalAutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from "lexical";
import { useEffect } from "react";
import { EditorValue } from "./editor";

const URL_MATCHER =
  /((https?:\/\/(www\.)?|www\.)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([-a-zA-Z0-9()@:%_+.~#?&//=]*)?)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (match?.length) {
      const url = match[0];
      // URL이 http로 시작하지 않고, www도 없으면 https://를 붙인다.
      const formattedUrl = url.startsWith("http")
        ? url
        : url.startsWith("www.")
          ? `https://${url}`
          : `https://www.${url}`;
      return {
        index: match.index,
        length: url.length,
        text: url,
        url: formattedUrl,
      };
    }
    return null;
  },
];
export const AutoLinkPlugin = () => {
  return <LexicalAutoLinkPlugin matchers={MATCHERS} />;
};

export const OnChangePlugin = ({
  onChange,
  mode,
}: {
  onChange: (editorValue: EditorValue) => void;
  mode: "view" | "edit";
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (mode === "view") return;

    const removeEditableListener = editor.registerUpdateListener(({ editorState }) => {
      const editorValue = JSON.stringify(editorState.toJSON());
      onChange(editorValue);
    });

    return () => {
      removeEditableListener();
    };
  }, [editor, onChange, mode]);

  return null;
};

export const OnFocusPlugin = ({ onFocus }: { onFocus: () => void }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        onFocus();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, onFocus]);

  return null;
};
