import { useEffect, useState } from "react";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";

interface CustomOnChangePluginProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomOnChangePlugin({
  value,
  onChange,
}: CustomOnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized || !value) return;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      try {
        // 1. JSON (Lexical EditorState) 파싱 시도
        const parsed = JSON.parse(value);
        if (parsed && parsed.root) {
          const editorState = editor.parseEditorState(value);
          editor.setEditorState(editorState);
        } else {
          // JSON이지만 Lexical 형식이 아닐 경우 일반 텍스트로 처리
          throw new Error("Not a Lexical JSON");
        }
      } catch (e) {
        // 2. JSON이 아니거나 파싱 실패 시 일반 텍스트(주석 로직)로 처리
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(value));
        root.append(paragraph);
      }
      
      setIsInitialized(true);
    });
  }, [editor, value, isInitialized]);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          onChange(JSON.stringify(editorState.toJSON()));
        });
      }}
    />
  );
}