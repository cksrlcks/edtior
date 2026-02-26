import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import RichEditor from "./components/RichEditor/RichEditor";
import { template } from "./components/RichEditor/template";
import "./App.css";

const STORAGE_KEY = "rich_editor_content";
type SaveStatus = "idle" | "saving" | "saved";

function App() {
  const [content, setContent] = useState<string | undefined>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || template;
  });
  const [editorKey, setEditorKey] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const debouncedSave = useMemo(
    () =>
      debounce(
        (newContent: string) => {
          localStorage.setItem(STORAGE_KEY, newContent);
          setSaveStatus("saved");

          setTimeout(() => {
            setSaveStatus("idle");
          }, 1000);
        },
        1000,
        {
          maxWait: 5000,
        },
      ),
    [],
  );

  useEffect(() => {
    if (content !== undefined) {
      setSaveStatus("saving");
      debouncedSave(content);
    }

    return () => debouncedSave.cancel();
  }, [content, debouncedSave]);

  const resetFomat = () => {
    if (
      content !== template &&
      !window.confirm("양식이 초기화됩니다. 계속하시겠습니까?")
    ) {
      return;
    }

    debouncedSave.cancel();
    localStorage.removeItem(STORAGE_KEY);

    setContent(template);
    setSaveStatus("idle");
    setEditorKey((prevKey) => prevKey + 1);
  };

  return (
    <>
      <div className="temp-control">
        <button type="button" onClick={resetFomat}>
          양식 초기화
        </button>

        <div className={`save-indicator ${saveStatus}`}>
          {saveStatus === "saving" && <span>저장 중...</span>}
          {saveStatus === "saved" && (
            <span style={{ color: "#4caf50" }}>저장 완료</span>
          )}
          {saveStatus === "idle" && (
            <span style={{ color: "#999" }}>입력 대기 중</span>
          )}
        </div>
      </div>
      <RichEditor key={editorKey} value={content} onChange={setContent} />
    </>
  );
}

export default App;
