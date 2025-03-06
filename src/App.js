import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/Home";
import AddUser from "./pages/AddUser";
import ViewUsers from "./pages/ViewUsers";
import UserDetails from "./pages/UserDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/user/:id" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
