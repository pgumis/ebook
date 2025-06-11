import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDataActions } from "./store/userData";
import { viewActions } from "./store/view";

import TopBar from "./components/TopBar/TopBar";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import ContactForm from "./components/ContactForm/ContactForm";
import ResetPasswordForm from "./components/ResetPasswordForm/ResetPasswordForm";
import ResetPasswordEmailForm from "./components/ResetPasswordEmailForm/ResetPasswordEmailForm";
import BooksList from "./components/BooksList/BooksList";
import BookDetails from "./components/BookDetails/BookDetails";
import Footer from "./components/Footer/Footer";
import Cart from "./components/Cart/Cart";
import PurchaseHistory from "./components/PurchaseHistory/PurchaseHistory";
import PurchaseDetails from "./components/PurchaseDetails/PurchaseDetails";
import Profile from "./components/Profile/Profile";
import VendorPanel from "./components/VendorPanel/VendorPanel";
import VendorEditBookDetails from "./components/VendorEditBookDetails/VendorEditBookDetails";
import VendorAddBook from "./components/VendorAddBook/VendorAddBook";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import AdminPanelManage from "./components/AdminPanel/AdminPanelManage/AdminPanelManage";
import AdminPanelMessagesShowAll from "./components/AdminPanel/AdminPanelMessagesShowAll";
import AdminPanelMessageDetails from "./components/AdminPanel/AdminPanelMessageDetails";
import HomePageContent from "./components/HomePage/HomePageContent";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function App() {
  const dispatch = useDispatch();
  const currView = useSelector((state) => state.view);
  const userData = useSelector((state) => state.userData);
  console.log(userData);
  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      dispatch(userDataActions.setData(JSON.parse(storedData)));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <div className="wrapper">
        <TopBar />
        <div className="content-wrapper">
          <button onClick={()=>{dispatch(userDataActions.setData({...userData, role: 'klient'}))}}>klient</button>
          <button onClick={()=>{dispatch(userDataActions.setData({...userData, role: 'dostawca'}))}}>dostawca</button>
          <button onClick={()=>{dispatch(userDataActions.setData({...userData, role: 'admin'}))}}>admin</button>
          {currView.selectedView === "home" && (
              !userData.role || userData.role === "klient" || userData.role === "user"
          ) && <HomePageContent />}
          {(currView.selectedView === "home" && userData.role === 'dostawca')&& <VendorPanel />}
          {(currView.selectedView === "home" && userData.role === 'admin')&& <AdminPanel />}
          {currView.selectedView === "signUp" && <SignUp />}
          {currView.selectedView === "signIn" && <SignIn />}
          {currView.selectedView === "contact" && <ContactForm />}
          {currView.selectedView === "bookDetails" && <BookDetails />}
          {currView.selectedView === "resetPassword" && <ResetPasswordForm />}
          {currView.selectedView === "cart" && <Cart />}
          {currView.selectedView === "purchaseHistory" && <PurchaseHistory />}
          {currView.selectedView === "purchaseDetails" && <PurchaseDetails />}
          {currView.selectedView === "profileDetails" && <Profile />}
          {currView.selectedView === "editBookDetails" && <VendorEditBookDetails />}
          {currView.selectedView === "addBook" && <VendorAddBook />}
          {currView.selectedView === "adminPanelManageUsers" && <AdminPanelManage />}
          {currView.selectedView === "adminPanelManageEbooks" && <AdminPanelManage />}
          {currView.selectedView === "adminPanelManageRatings" && <AdminPanelManage />}
          {currView.selectedView === "adminPanelManageOrders" && <AdminPanelManage />}
          {currView.selectedView === "adminPanelMessagesShowAll" && <AdminPanelMessagesShowAll />}
         {currView.selectedView === "adminPanelMessageDetails" && <AdminPanelMessageDetails />}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
