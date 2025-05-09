import { useSelector } from "react-redux";

import TopBar from "./components/TopBar/TopBar";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import ContactForm from "./components/ContactForm/ContactForm";
import ResetPasswordForm from "./components/ResetPasswordForm/ResetPasswordForm";
import ResetPasswordEmailForm from "./components/ResetPasswordEmailForm/ResetPasswordEmailForm";

function App() {
  const currView = useSelector((state) => state.view);
  console.log(currView.selectedView);
  return (
    <div className="App">
      <TopBar />
      <div className="content-wrapper">
        {currView.selectedView === "signUp" && <SignUp />}
        {currView.selectedView === "signIn" && <SignIn />}
        {currView.selectedView === "contact" && <ContactForm />}
        {currView.selectedView === "resetPassword" && <ResetPasswordForm />}

      </div>
    </div>
  );
}

export default App;
