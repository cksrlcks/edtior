import { useState } from "react";
import "./App.css";
import RichEditor from "./components/RichEditor/RichEditor";

const fakeContent = JSON.stringify({"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"- 오늘 한 일","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #9b9b9b;","text":"“오늘 수행한 주요 업무를 한 줄씩 정리해 주세요.”","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"color: #9b9b9b;"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #000000;","text":"수행업무 1","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #000000;","text":"수행업무 2 ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"checked":false,"value":2}],"direction":null,"format":"","indent":0,"type":"list","version":1,"textStyle":"color: #000000;","listType":"check","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0},{"type":"horizontalrule","version":1},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"- 상세 진행 내용 / 특이사항","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #9b9b9b;","text":"“각 업무의 진행 상황, 이슈, 의사결정 사항을 적어 주세요.”","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"color: #9b9b9b;"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0},{"type":"horizontalrule","version":1},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"- 내일(향후) 계획","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #9b9b9b;","text":"“내일(다음 근무일)에 이어서 할 일과 우선순위를 적어 주세요.”","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"color: #9b9b9b;"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textStyle":"color: #000000;","textFormat":0}],"direction":null,"format":"","indent":0,"type":"root","version":1}});

//const fakeContent = ''

function App() {
  const [content, setContent] = useState<string | undefined>(fakeContent);
console.log(content)
  return (
    <>
      <RichEditor
        value={content}
        onChange={setContent}
      />
    </>
  );
}

export default App;
