import React from "react";
import Home from "./components/Home";
import { BrowserRouter  as Router, Route, Routes} from "react-router-dom";
import { WavyBackground } from "./components/ui/wavy-background";
import PowerBi from "./components/ui/PowerBi";

function App() {
  return (
    <Router>
    <WavyBackground className="h-screen w-full flex items-center justify-center">
     
        <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/powerbi" element={<PowerBi/>}/>
        </Routes>
    </WavyBackground>
    </Router>
  );
}

export default App;
