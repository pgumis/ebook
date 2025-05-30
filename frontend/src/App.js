import { useSelector } from "react-redux";

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
function App() {
  const currView = useSelector((state) => state.view);
  return (
    <div className="App">
      <div className="wrapper">
        <TopBar />
        <div className="content-wrapper">
          {currView.selectedView === "home" && <BooksList />}
          {currView.selectedView === "signUp" && <SignUp />}
          {currView.selectedView === "signIn" && <SignIn />}
          {currView.selectedView === "contact" && <ContactForm />}
          {currView.selectedView === "bookDetails" && <BookDetails />}
          {currView.selectedView === "resetPassword" && <ResetPasswordForm />}
          {currView.selectedView === "cart" && <Cart />}
          {currView.selectedView === "purchaseHistory" && <PurchaseHistory />}
          {currView.selectedView === "purchaseDetails" && <PurchaseDetails />}
          {currView.selectedView === "profileDetails" && <Profile />}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
