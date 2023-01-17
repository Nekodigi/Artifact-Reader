import "./App.css";
import { TemplateMatching } from "./opencv/TemplateMatching.tsx";
import { TestPage } from "./opencv/TestPage";

function App() {
  return (
    <div className="App">
      {/* <TestPage /> */}
      <TemplateMatching />
    </div>
  );
}

export default App;
