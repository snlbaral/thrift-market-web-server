import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import Home from "./pages/user/Home";
import SellerRequest from "./pages/static/SellerRequest";
import ProductDetail from "./pages/user/post/ProductDetail";
import CategoryPage from "./pages/user/category/CategoryPage";
import BrandPage from "./pages/user/brand/BrandPage";
import SearchResult from "./pages/user/search/SearchResult";
import ContactUs from "./pages/static/ContactUs";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Interest from "./pages/auth/Interest";
import ResetPassword from "./pages/auth/ResetPassword";
import ContactForm from "./pages/static/ContactForm";
import ProductList from "./pages/user/ProductList";
import Closet from "./pages/user/profile/Closet";
import ProtectedPayment from "./pages/static/ProtectedPayment";
import ExpeditedShipping from "./pages/static/ExpeditedShipping";
import CartItems from "./pages/user/cart-checkout-payment/CartItems";
import Checkout from "./pages/user/cart-checkout-payment/Checkout";
import EditAddress from "./pages/user/address/EditAddress";
import AddAddress from "./pages/user/address/AddAddress";
import Payment from "./pages/user/cart-checkout-payment/Payment";
import OrderList from "./pages/user/order/OrderList";
import Profile from "./pages/user/profile/Profile";
import EditProfile from "./pages/user/profile/EditProfile";
import Payouts from "./pages/user/payout/Payouts";
import CreatePost from "./pages/user/post/CreatePost";
import EditPost from "./pages/user/post/EditPost";
import OrderReceived from "./pages/user/order/OrderReceived";
import Register from "./pages/auth/Register";
import Adminregister from "./pages/auth/Adminregister";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Brandindex from "./pages/admin/brand/Brandindex";
import Addbrand from "./pages/admin/brand/Addbrand";
import Editbrand from "./pages/admin/brand/Editbrand";
import AddCategory from "./pages/admin/category/AddCategory";
import IndexCategory from "./pages/admin/category/IndexCategory";
import EditCategory from "./pages/admin/category/EditCategory";
import Addproduct from "./pages/admin/product/Addproduct";
import IndexProduct from "./pages/admin/product/IndexProduct";
import Editproduct from "./pages/admin/product/Editproduct";
import User from "./pages/admin/user/User";
import BannerIndex from "./pages/admin/banner/BannerIndex";
import BannerAdd from "./pages/admin/banner/BannerAdd";
import BannerEdit from "./pages/admin/banner/BannerEdit";
import IndexSize from "./pages/admin/size/IndexSize";
import AddSize from "./pages/admin/size/AddSize";
import AddColor from "./pages/admin/color/AddColor";
import IndexColor from "./pages/admin/color/IndexColor";
import AdminIndex from "./pages/admin/user/AdminIndex";
import ShippingIndex from "./pages/admin/shipping/ShippingIndex";
import AddShipping from "./pages/admin/shipping/AddShipping";
import Index from "./pages/admin/district/Index";
import Create from "./pages/admin/district/Create";
import Edit from "./pages/admin/district/Edit";
import CreateCity from "./pages/admin/city/CreateCity";
import City from "./pages/admin/city/City";
import Withdraw from "./pages/admin/withdraw/Withdraw";
import Order from "./pages/admin/order/Order";
import AdminProtected from "./global/AdminProtected";
import AddAdmin from "./pages/admin/user/AddAdmin";
import UserProtected from "./global/UserProtected";
import CartContext from "./global/CartContext";
import Footer from "./pages/user/layout/Footer";
import Navbar from "./pages/user/layout/Navbar";
import AdminNav from "./pages/admin/layout/AdminNav";
import OrderTrackIndex from "./pages/admin/orderTrack/OrderTrackIndex";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import AboutUs from "./pages/static/AboutUs";
import TermsCondition from "./pages/static/TermsCondition";
import ReturnRefund from "./pages/static/ReturnRefund";
import EsewaSuccess from "./pages/user/paymentResponse/EsewaSuccess";
import EsewaFailed from "./pages/user/paymentResponse/EsewaFailed";
import { QueryClientProvider, QueryClient } from "react-query";
import SaleHistoryDetail from "./pages/user/sale/SaleHistoryDetail";
import AddPickupLocation from "./pages/user/address/AddPickupLocation";
import EditPickupAddress from "./pages/user/address/EditPickupAddress";

axios.defaults.baseURL = "http://localhost:5000/api";
// axios.defaults.baseURL = "https://hamrocloset.com/api";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <CartContext>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/sellerrequest" component={SellerRequest} />
            <Route exact path="/product-detail/:id" component={ProductDetail} />
            <Route exact path="/category/:slug" component={CategoryPage} />
            <Route exact path="/brand/:slug" component={BrandPage} />
            <Route exact path="/search/:parameter?" component={SearchResult} />
            <Route exact path="/contactus" component={ContactUs} />
            <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/about-us" component={AboutUs} />
            <Route
              exact
              path="/terms-and-conditions"
              component={TermsCondition}
            />
            <Route exact path="/returns-and-refunds" component={ReturnRefund} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/interest" component={Interest} />

            <Route exact path="/reset-password" component={ResetPassword} />
            <Route exact path="/product-list" component={ProductList} />
            <Route exact path="/closet/:id" component={Closet} />
            <Route
              exact
              path="/protected-payment"
              component={ProtectedPayment}
            />

            <Route
              exact
              path="/expedited-shipping"
              component={ExpeditedShipping}
            />

            <Route exact path="/cartitems">
              <UserProtected cmp={CartItems} />
            </Route>
            <Route exact path="/payment-success">
              <UserProtected cmp={EsewaSuccess} />
            </Route>
            <Route exact path="/payment-failed">
              <UserProtected cmp={EsewaFailed} />
            </Route>
            <Route exact path="/checkout">
              <UserProtected cmp={Checkout} />
            </Route>
            <Route exact path="/address">
              <UserProtected cmp={AddAddress} />
            </Route>
            <Route exact path="/add-pickup-location">
              <UserProtected cmp={AddPickupLocation} />
            </Route>
            <Route exact path="/edit-address/:id">
              <UserProtected cmp={EditAddress} />
            </Route>
            <Route exact path="/edit-pickup-location/:id">
              <UserProtected cmp={EditPickupAddress} />
            </Route>
            <Route exact path="/payment">
              <UserProtected cmp={Payment} />
            </Route>
            <Route exact path="/orderlist/:parameter?">
              <UserProtected cmp={OrderList} />
            </Route>
            <Route exact path="/profile/:parameter?">
              <UserProtected cmp={Profile} />
            </Route>
            <Route exact path="/edit-profile">
              <UserProtected cmp={EditProfile} />
            </Route>
            <Route exact path="/payout">
              <UserProtected cmp={Payouts} />
            </Route>
            <Route exact path="/create-post">
              <UserProtected cmp={CreatePost} />
            </Route>
            <Route exact path="/edit-post/:id">
              <UserProtected cmp={EditPost} />
            </Route>
            <Route exact path="/sale/detail/:id">
              <UserProtected cmp={SaleHistoryDetail} />
            </Route>
            <Route exact path="/order-received">
              <UserProtected cmp={OrderReceived} />
            </Route>

            {/* admin route */}
            <Route exact path="/nav" component={AdminNav} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/admin/register" component={Adminregister} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/admin/dashboard">
              <AdminProtected Cmp={Dashboard} />
            </Route>

            <Route exact path="/admin/brand">
              <AdminProtected Cmp={Brandindex} />
            </Route>

            <Route exact path="/admin/addbrand">
              <AdminProtected Cmp={Addbrand} />
            </Route>
            <Route exact path="/admin/order-track">
              <AdminProtected Cmp={OrderTrackIndex} />
            </Route>
            <Route exact path="/admin/editbrand/:id">
              <AdminProtected Cmp={Editbrand} />
            </Route>
            <Route exact path="/admin/addcategory">
              <AdminProtected Cmp={AddCategory} />
            </Route>

            <Route exact path="/admin/category">
              <AdminProtected Cmp={IndexCategory} />
            </Route>
            <Route exact path="/admin/editcategory/:id">
              <AdminProtected Cmp={EditCategory} />
            </Route>
            <Route exact path="/admin/addproduct">
              <AdminProtected Cmp={Addproduct} />
            </Route>
            <Route exact path="/admin/product">
              <AdminProtected Cmp={IndexProduct} />
            </Route>
            <Route exact path="/admin/editproduct/:id">
              <AdminProtected Cmp={Editproduct} />
            </Route>
            <Route exact path="/admin/user">
              <AdminProtected Cmp={User} />
            </Route>
            <Route exact path="/admin/banner">
              <AdminProtected Cmp={BannerIndex} />
            </Route>
            <Route exact path="/admin/addbanner">
              <AdminProtected Cmp={BannerAdd} />
            </Route>
            <Route exact path="/admin/editbanner/:id">
              <AdminProtected Cmp={BannerEdit} />
            </Route>

            <Route exact path="/admin/size">
              <AdminProtected Cmp={IndexSize} />
            </Route>

            <Route exact path="/admin/addsize">
              <AdminProtected Cmp={AddSize} />
            </Route>

            <Route exact path="/admin/addcolor">
              <AdminProtected Cmp={AddColor} />
            </Route>

            <Route exact path="/admin/color">
              <AdminProtected Cmp={IndexColor} />
            </Route>
            <Route exact path="/admin/admin">
              <AdminProtected Cmp={AdminIndex} />
            </Route>
            <Route exact path="/admin/create">
              <AdminProtected Cmp={AddAdmin} />
            </Route>
            <Route exact path="/admin/shipping">
              <AdminProtected Cmp={ShippingIndex} />
            </Route>
            <Route exact path="/admin/addshipping">
              <AdminProtected Cmp={AddShipping} />
            </Route>
            <Route exact path="/admin/district">
              <AdminProtected Cmp={Index} />
            </Route>
            <Route exact path="/admin/createdistrict">
              <AdminProtected Cmp={Create} />
            </Route>
            <Route exact path="/admin/editdistrict/:id">
              <AdminProtected Cmp={Edit} />
            </Route>
            <Route exact path="/admin/createcity/">
              <AdminProtected Cmp={CreateCity} />
            </Route>
            <Route exact path="/admin/city/">
              <AdminProtected Cmp={City} />
            </Route>
            <Route exact path="/admin/withdraw">
              <AdminProtected Cmp={Withdraw} />
            </Route>

            <Route exact path="/admin/order">
              <AdminProtected Cmp={Order} />
            </Route>
          </Switch>
          <Footer />
        </CartContext>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
