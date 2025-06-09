// frontend/src/components/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userDataActions } from "../../store/userData";
import "./Profile.css";

const Profile = () => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const [profileImage, setProfileImage] = useState(
      userData.profilePic || "/profile.jpg"
  );
  const [firstName] = useState(userData.imie || '');
  const [lastName] = useState(userData.nazwisko || '');
  const [email] = useState(userData.email || '');
  const [phoneNumber] = useState(userData.phoneNumber || '');
  const [role] = useState(userData.role || '');

  useEffect(() => {
    if (userData.profilePic && userData.profilePic !== profileImage) {
      setProfileImage(userData.profilePic);
    }
  }, [userData.profilePic, profileImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      // dispatch(userDataActions.setData({ profilePic: imageUrl })); // Tutaj będzie faktyczny upload
    }
  };

  return (
      <div className="container my-4">
        <h2 className="text-center mb-4">Twój Profil</h2>
        <div className="row">

          {/* Lewa kolumna: Avatar i opcja zmiany zdjęcia */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <img
                    src={profileImage}
                    alt="Zdjęcie profilowe"
                    className="img-fluid rounded-circle mb-3 profile-avatar"
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
          <div className="col-md-8 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title mb-3">Dane Podstawowe</h5>

                {/* Zmiany zaczynają się tutaj dla każdego pola */}
                <div className="d-flex align-items-center mb-2"> {/* Użycie d-flex dla flexboxa */}
                  <strong className="me-2">Imię:</strong> {/* me-2 to margin-right */
                  }
                  <span>{firstName}</span> {/* Zamiast <p>form-control-plaintext</p> */}
                </div>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Nazwisko:</strong>
                  <span>{lastName}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Email:</strong>
                  <span>{email}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Rola:</strong>
                  <span>{role}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <strong className="me-2">Numer telefonu:</strong>
                  <span>{phoneNumber}</span>
                </div>

                {/* Warunkowe sekcje dla różnych ról */}
                {role === 'provider' && (
                    <div className="provider-specific-info mt-4 pt-3 border-top">
                      <h5 className="card-title mb-3">Dane Dostawcy</h5>
                      <p>Tutaj będą dodatkowe informacje specyficzne dla dostawcy, np. nazwa firmy, NIP, historia dodanych ebooków.</p>
                    </div>
                )}

                {role === 'customer' && (
                    <div className="customer-specific-info mt-4 pt-3 border-top">
                      <h5 className="card-title mb-3">Dane Klienta</h5>
                      <p>Tutaj mogą być dodatkowe informacje specyficzne dla klienta, np. adres dostawy, lista zakupionych książek.</p>
                    </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default Profile;