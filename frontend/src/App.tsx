import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Success from './pages/Success';
import Requests from './pages/Requests';
import EditProfile from './pages/EditProfile';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Protected from './components/Protected';
import AboutPage from './pages/AboutPage';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/category/:id" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route
          path="/success/:id"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <Success />
            </Protected>
          }
        />
        <Route
          path="/requests"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <Requests />
            </Protected>
          }
        />
        <Route
          path="/editprofile"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <EditProfile />
            </Protected>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <Protected isLoggedIn={isAdminUser}>
              <Admin />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
