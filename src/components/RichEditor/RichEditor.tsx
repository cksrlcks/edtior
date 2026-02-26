import { DecoratorTextExtension } from "@lexical/extension";
import { defineExtension } from "lexical";
import { buildHTMLConfig } from "./buildHTMLConfig";
import PlaygroundNodes from "./nodes/PlaygroundNodes";
import PlaygroundEditorTheme from "./themes/PlaygroundEditorTheme";
import { SettingsContext, useSettings } from "./context/SettingsContext";

import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import {
  SharedHistoryContext,
  useSharedHistoryContext,
} from "./context/SharedHistoryContext";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { SelectionAlwaysOnDisplay } from "@lexical/react/LexicalSelectionAlwaysOnDisplay";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { CAN_USE_DOM } from "@lexical/utils";
import { useEffect, useMemo, useState } from "react";

import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import CodeHighlightPrismPlugin from "./plugins/CodeHighlightPrismPlugin";
import CodeHighlightShikiPlugin from "./plugins/CodeHighlightShikiPlugin";

import ContextMenuPlugin from "./plugins/ContextMenuPlugin";
import DragDropPaste from "./plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlockPlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import { MaxLengthPlugin } from "./plugins/MaxLengthPlugin";
import ShortcutsPlugin from "./plugins/ShortcutsPlugin";
import TabFocusPlugin from "./plugins/TabFocusPlugin";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableHoverActionsV2Plugin from "./plugins/TableHoverActionsV2Plugin";
import TableOfContentsPlugin from "./plugins/TableOfContentsPlugin";
import TableScrollShadowPlugin from "./plugins/TableScrollShadowPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ContentEditable from "./ui/ContentEditable";
import CustomOnChangePlugin from "./plugins/CustomOnChangePlugin";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import LexicalAutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { TableContext } from "./plugins/TablePlugin";
import StickyPlugin from "./plugins/StickyPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";

import { ToolbarContext } from "./context/ToolbarContext";
import { FlashMessageContext } from "./context/FlashMessageContext";

type RichEditorProps = {
  value?: string;
  onChange: (value: string) => void;
};

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const app = useMemo(
    () =>
      defineExtension({
        dependencies: [DecoratorTextExtension],
        html: buildHTMLConfig(),
        name: "@lexical/playground",
        namespace: "Playground",
        nodes: PlaygroundNodes,
        theme: PlaygroundEditorTheme,
      }),
    [],
  );

  return (
    <>
      <SettingsContext>
        <FlashMessageContext>
          <LexicalCollaboration>
            <LexicalExtensionComposer extension={app} contentEditable={null}>
              <SharedHistoryContext>
                <TableContext>
                  <ToolbarContext>
                    <div className="editor-shell">
                      <Editor value={value} onChange={onChange} />
                    </div>
                  </ToolbarContext>
                </TableContext>
              </SharedHistoryContext>
            </LexicalExtensionComposer>
          </LexicalCollaboration>
        </FlashMessageContext>
      </SettingsContext>
    </>
  );
}

function Editor({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const { historyState } = useSharedHistoryContext();

  const {
    settings: {
      isCodeHighlighted,
      isCodeShiki,
      isCollab,
      useCollabV2,
      isAutocomplete,
      isMaxLength,
      isCharLimit,
      hasLinkAttributes,
      hasNestedTables,
      hasFitNestedTables,
      isCharLimitUtf8,
      isRichText,
      showTreeView,
      showTableOfContents,
      shouldUseLexicalContextMenu,
      shouldPreserveNewLinesInMarkdown,
      tableCellMerge,
      tableCellBackgroundColor,
      tableHorizontalScroll,
      shouldAllowHighlightingWithBrackets,
      selectionAlwaysOnDisplay,
      listStrictIndent,
      shouldDisableFocusOnClickChecklist,
    },
  } = useSettings();
  const isEditable = useLexicalEditable();
  const placeholder = "내용을 입력해주세요...";
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <>
      {isRichText && (
        <ToolbarPlugin
          editor={editor}
          activeEditor={activeEditor}
          setActiveEditor={setActiveEditor}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      )}
      {isRichText && (
        <ShortcutsPlugin
          editor={activeEditor}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      )}
      <div
        className={`editor-container ${showTreeView ? "tree-view" : ""} ${
          !isRichText ? "plain-text" : ""
        }`}
      >
        <CustomOnChangePlugin value={value || ""} onChange={onChange} />
        {isMaxLength && <MaxLengthPlugin maxLength={30} />}
        <StickyPlugin />
        <AutoLinkPlugin />
        <DragDropPaste />
        <AutoFocusPlugin />
        {selectionAlwaysOnDisplay && <SelectionAlwaysOnDisplay />}
        <ClearEditorPlugin />
        <HashtagPlugin />

        <LexicalAutoLinkPlugin />

        {isRichText ? (
          <>
            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={
                <div className="editor-scroller">
                  <div className="editor" ref={onRef}>
                    <ContentEditable placeholder={placeholder} />
                  </div>
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin />
            {isCodeHighlighted &&
              (isCodeShiki ? (
                <CodeHighlightShikiPlugin />
              ) : (
                <CodeHighlightPrismPlugin />
              ))}
            <ListPlugin
              hasStrictIndent={listStrictIndent}
              shouldPreserveNumbering={false}
            />
            <CheckListPlugin
              disableTakeFocusOnClick={shouldDisableFocusOnClickChecklist}
            />
            <TablePlugin
              hasCellMerge={tableCellMerge}
              hasCellBackgroundColor={tableCellBackgroundColor}
              hasHorizontalScroll={tableHorizontalScroll}
              hasFitNestedTables={hasFitNestedTables}
              hasNestedTables={hasNestedTables}
            />
            <TableCellResizer />
            <TableScrollShadowPlugin />
            <ImagesPlugin />
            <LinkPlugin hasLinkAttributes={hasLinkAttributes} />

            <ClickableLinkPlugin disabled={isEditable} />
            <HorizontalRulePlugin />

            <TabFocusPlugin />
            <TabIndentationPlugin maxIndent={7} />

            {floatingAnchorElem && (
              <>
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                />
              </>
            )}
            {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <TableHoverActionsV2Plugin anchorElem={floatingAnchorElem} />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
              </>
            )}
          </>
        ) : (
          <>
            <PlainTextPlugin
              contentEditable={<ContentEditable placeholder={placeholder} />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
          </>
        )}
        {(isCharLimit || isCharLimitUtf8) && (
          <CharacterLimitPlugin
            charset={isCharLimit ? "UTF-16" : "UTF-8"}
            maxLength={5}
          />
        )}

        <div>{showTableOfContents && <TableOfContentsPlugin />}</div>
        {shouldUseLexicalContextMenu && <ContextMenuPlugin />}
      </div>
    </>
  );
}
