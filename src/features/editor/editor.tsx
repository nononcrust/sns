"use client";

import { cn, noop } from "@/lib/utils";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorThemeClasses } from "lexical";
import { AutoLinkPlugin, OnChangePlugin, OnFocusPlugin } from "./plugins";
import { initialEditorValue } from "./use-editor";

const DEFAULT_PLACEHOLDER = "내용을 입력해주세요.";

export type EditorValue = string;

const theme = {
  root: "focus:outline-none text-[15px]",
  link: "text-blue-500 hover:underline",
} satisfies EditorThemeClasses;

interface EditorProps {
  className?: string;
  placeholder?: string;
  value?: EditorValue;
  onChange?: (editorValue: EditorValue) => void;
  onFocus?: () => void;
  mode?: "view" | "edit";
  ["data-testid"]?: string;
}

export const Editor = ({
  placeholder = DEFAULT_PLACEHOLDER,
  className,
  value,
  onChange = noop,
  onFocus = noop,
  mode = "edit",
  ...props
}: EditorProps) => {
  const initialConfig = {
    namespace: mode === "edit" ? "editor" : "viewer",
    onError: () => {},
    theme,
    editable: mode === "edit" ? true : false,
    editorState: value && value.length > 0 ? value : undefined,
    nodes: [LinkNode, AutoLinkNode],
  } satisfies InitialConfigType;

  if (mode === "view" && value === initialEditorValue) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable data-testid={props["data-testid"]} />}
          placeholder={<Placeholder text={placeholder} />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <OnChangePlugin onChange={onChange} mode={mode} />
        <OnFocusPlugin onFocus={onFocus} />
      </LexicalComposer>
    </div>
  );
};

interface PlaceholderProps {
  text: React.ReactNode;
}

const Placeholder = ({ text }: PlaceholderProps) => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 text-[15px] opacity-50">{text}</div>
  );
};
