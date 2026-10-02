import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EateryPage from "./pages/EateryPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/eatery/:slug" element={<EateryPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}