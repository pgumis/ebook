// frontend/src/components/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userDataActions } from "../../store/userData";
import "./Profile.css"; // Będziemy używać tego pliku dla niestandardowych stylów

const Profile = () => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  // Użyj useState, ale zainicjuj wartością z Reduxa, jeśli istnieje
  const [profileImage, setProfileImage] = useState(
      userData.profilePic || "/profile.jpg" // Domyślne zdjęcie, jeśli brak w Reduxie
  );
  // Stany dla wyświetlanych pól (nie do edycji na razie)
  const [firstName] = useState(userData.imie || '');
  const [lastName] = useState(userData.nazwisko || '');
  const [email] = useState(userData.email || '');
  const [phoneNumber] = useState(userData.phoneNumber || '');
  const [role] = useState(userData.role || '');


  useEffect(() => {
    // Zaktualizuj profileImage, jeśli userData.profilePic się zmieni (np. po zalogowaniu)
    // To jest ważne, jeśli obrazek profilowy jest ładowany dynamicznie
    if (userData.profilePic && userData.profilePic !== profileImage) {
      setProfileImage(userData.profilePic);
    }
  }, [userData.profilePic, profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // W realnej aplikacji tutaj wysłałbyś plik na serwer i zaktualizował ścieżkę w bazie danych
      // dispatch(userDataActions.setData({ profilePic: imageUrl })); // Opcjonalnie: Zapisz nową ścieżkę avatara w Reduxie
    }
  };

  return (
      <div className="container my-4"> {/* Kontener Bootstrapa z marginesem pionowym */}
        <h2 className="text-center mb-4">Twój Profil</h2> {/* Zmieniony tytuł na bardziej ogólny */}
        <div className="row"> {/* Wiersz dla dwóch kolumn */}

          {/* Lewa kolumna: Avatar i opcja zmiany zdjęcia */}
          <div className="col-md-4 mb-3"> {/* Kolumna zajmująca 4/12 szerokości na średnich i większych ekranach */}
            <div className="card h-100"> {/* Karta zajmująca pełną wysokość kolumny */}
              <div className="card-body text-center">
                <img
                    src={profileImage}
                    alt="Zdjęcie profilowe"
                    className="img-fluid rounded-circle mb-3 profile-avatar" // Klasy Bootstrapa + niestandardowa
                />
                <div className="mb-3">
                  <label htmlFor="profileImageUpload" className="form-label">
                    Zmień zdjęcie profilowe
                  </label>
                  <input
                      type="file"
                      className="form-control"
                      id="profileImageUpload"
                      accept="image/*"
                      onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prawa kolumna: Informacje ogólne o profilu */}
          <div className="col-md-8 mb-3"> {/* Kolumna zajmująca 8/12 szerokości */}
            <div className="card h-100"> {/* Karta zajmująca pełną wysokość kolumny */}
              <div className="card-body">
                <h5 className="card-title mb-3">Dane Podstawowe</h5>
                <div className="mb-3">
                  <label className="form-label"><strong>Imię:</strong></label>
                  <p className="form-control-plaintext">{firstName}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label"><strong>Nazwisko:</strong></label>
                  <p className="form-control-plaintext">{lastName}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label"><strong>Email:</strong></label>
                  <p className="form-control-plaintext">{email}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label"><strong>Rola:</strong></label>
                  <p className="form-control-plaintext">{role}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label"><strong>Numer telefonu:</strong></label>
                  <p className="form-control-plaintext">{phoneNumber}</p>
                </div>

                {/* === Warunkowe sekcje dla różnych ról (PRZYKŁAD) === */}
                {role === 'provider' && ( // Zakładając, że rola dostawcy to 'provider'
                    <div className="provider-specific-info mt-4 pt-3 border-top">
                      <h5 className="card-title mb-3">Dane Dostawcy</h5>
                      <p>Tutaj będą dodatkowe informacje specyficzne dla dostawcy, np. nazwa firmy, NIP, historia dodanych ebooków.</p>
                      {/* <div className="mb-3">
                    <label className="form-label"><strong>Nazwa Firmy:</strong></label>
                    <p className="form-control-plaintext">{userData.companyName}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label"><strong>NIP:</strong></label>
                    <p className="form-control-plaintext">{userData.nip}</p>
                  </div> */}
                      {/* ... więcej pól dla dostawcy ... */}
                    </div>
                )}

                {role === 'customer' && ( // Zakładając, że rola klienta to 'customer'
                    <div className="customer-specific-info mt-4 pt-3 border-top">
                      <h5 className="card-title mb-3">Dane Klienta</h5>
                      <p>Tutaj mogą być dodatkowe informacje specyficzne dla klienta, np. adres dostawy, lista zakupionych książek.</p>
                      {/* ... więcej pól dla klienta ... */}
                    </div>
                )}
                {/* ==================================================== */}
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default Profile;