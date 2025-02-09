import React from "react";
import Home from "./components/Home";
import { WavyBackground } from "./components/ui/wavy-background";

function App() {
  return (
    <WavyBackground className="h-screen w-full flex items-center justify-center">
      <Home />
    </WavyBackground>
  );
}

export default App;
