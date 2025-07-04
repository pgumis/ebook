

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { viewActions } from "../../store/view";

const ResetPasswordEmailForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
          "http://localhost:8000/api/haslo/wyslij-kod",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
      );

      const result = await response.json();

      if (response.ok) {

        dispatch(viewActions.setEmailForPasswordReset(email));

        dispatch(viewActions.changeView("reset-password-code"));
      } else {

        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Wystąpił błąd sieci. Spróbuj ponownie.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="auth-form-container screen-center">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Resetowanie hasła</h2>
          <p className="auth-subtitle">
            Podaj adres e-mail powiązany z Twoim kontem, a wyślemy na niego kod
            do zresetowania hasła.
          </p>

          {message && (
              <div
                  className={`alert ${
                      message.type === "success" ? "alert-success" : "alert-danger"
                  }`}
              >
                {message.text}
              </div>
          )}

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Wysyłanie..." : "Wyślij instrukcje"}
          </button>
        </form>
      </div>
  );
};

export default ResetPasswordEmailForm;