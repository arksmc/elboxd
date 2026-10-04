import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EateryPage from "./pages/EateryPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Eateries from "./pages/Eateries";
// inside <Routes>


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eateries" element={<Eateries />} />
        <Route path="/eatery/:slug" element={<EateryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}