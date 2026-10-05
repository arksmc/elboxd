import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EateryPage from "./pages/EateryPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Eateries from "./pages/Eateries";
import Login from "./pages/Login";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Suggest from "./pages/Suggest";
import Admin from "./pages/Admin";
import People from ".pages/People";


export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eateries" element={<Eateries />} />
        <Route path="/eatery/:slug" element={<EateryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/u/:nickname" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/suggest" element={<Suggest />} />
        <Route path="/people" element={<People />} />
      </Routes>
    </Layout>
  );
}