import React, { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { Typography } from "@mui/material";
const TemplateMatching = lazy(
  () => import("./components/template/TemplateMatching")
);

function App() {
  return (
    <div className="App">
      <Typography>ARTIFACT SCAN</Typography>
      <Suspense
        fallback={
          <Typography>
            LOADING... opencv genshin-db loading takes time
          </Typography>
        }
      >
        <TemplateMatching />
      </Suspense>
    </div>
  );
}

export default App;
