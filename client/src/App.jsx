import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/Addblog";
import ListBlog from "./pages/admin/Listblog";
import Comments from "./pages/admin/Comments";
import "quill/dist/quill.snow.css"
import {Toaster} from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute";
import Signp from "./components/adminComponents/Signup";
const App = () => {


  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signp />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/admin" element={<ProtectedRoute>
          <Layout/>
        </ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="list-blog" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
