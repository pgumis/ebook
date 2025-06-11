// frontend/src/components/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userDataActions } from "../../store/userData";
import "./Profile.css"; // Stylizacje

const Profile = () => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  // Stany dla danych formularza
  const [editedFirstName, setEditedFirstName] = useState(userData.imie || "");
  const [editedLastName, setEditedLastName] = useState(userData.nazwisko || "");
  const [editedEmail, setEditedEmail] = useState(userData.email || "");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(userData.phoneNumber || "");

// Stan dla zdjęcia profilowego
  const [profileImage, setProfileImage] = useState(
      userData.profilePic || "/avatars/avatar1.png"
  );

  // NOWY STAN: do przełączania widoczności galerii awatarów
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const handleAvatarSelect = (avatarNumber) => {
    const newAvatarPath = `/avatars/avatar${avatarNumber}.png`;
    setProfileImage(newAvatarPath);
    dispatch(userDataActions.setData({ profilePic: newAvatarPath }));
    setShowAvatarPicker(false);
  };
  // I tablicę z numerami awatarów:
  const avatarNumbers = [1, 2, 3, 4, 5, 6];

  // Stan do przełączania trybu edycji
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null); // Komunikaty dla użytkownika (sukces/błąd)
  const [isLoading, setIsLoading] = useState(false); // Stan ładowania podczas wysyłania danych
  console.log("Profile component rendered. isEditing:", isEditing);
  // Efekt do aktualizacji stanów formularza, gdy userData się zmienia (np. po zalogowaniu, lub po edycji)
  useEffect(() => {
    console.log("useEffect triggered. userData:", userData);
    setEditedFirstName(userData.imie || "");
    setEditedLastName(userData.nazwisko || "");
    setEditedEmail(userData.email || "");
    setEditedPhoneNumber(userData.phoneNumber || "");
  }, [userData]);

  const toggleEditMode = () => {
    console.log("toggleEditMode called. Current isEditing:", isEditing);
    setIsEditing((prev) => !prev);
    setMessage(null); // Czyścimy komunikaty przy przełączaniu trybu
    if (!isEditing) {
      console.log("Entering edit mode. Setting form values from userData.");
      // Jeśli wchodzimy w tryb edycji, upewnij się, że formularz odzwierciedla aktualne dane z Reduxa
      setEditedFirstName(userData.imie || "");
      setEditedLastName(userData.nazwisko || "");
      setEditedEmail(userData.email || "");
      setEditedPhoneNumber(userData.phoneNumber || "");
      setProfileImage(userData.profilePic || "/profile.jpg");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called. Event:", e);
    setIsLoading(true);
    setMessage(null);

    const dataToSend = {
      imie: editedFirstName,
      nazwisko: editedLastName,
      email: editedEmail,
      numer_telefonu: editedPhoneNumber,
      profilePic: profileImage,
    };

    try {
      const response = await fetch("http://localhost:8000/api/profil", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        setIsEditing(false); // Wyłącz tryb edycji po sukcesie

        dispatch(userDataActions.setData(result.user));
      } else {
        const errorText = result.message || "Wystąpił błąd podczas aktualizacji profilu.";
        setMessage({ type: "error", text: errorText });
        if (result.errors) {
          console.error("Błędy walidacji:", result.errors);
        }
      }
    } catch (error) {
      console.error("Błąd sieci lub serwera:", error);
      setMessage({
        type: "error",
        text: "Nie udało się połączyć z serwerem.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="container my-4">
        <h2 className="text-center mb-4">Twój profil</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <img
                    src={profileImage}
                    alt="Zdjęcie profilowe"
                    className="rounded-circle img-fluid"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                {isEditing && ( // Wyświetlaj tylko w trybie edycji
                    <div className="mt-2">
                      <button
                          type="button" // Zawsze type="button"
                          className="btn-sm edit-button"
                          onClick={() => setShowAvatarPicker((prev) => !prev)}
                      >
                        {showAvatarPicker ? "Ukryj wybór awatara" : "Zmień awatar"}
                      </button>
                      {showAvatarPicker && ( // Wyświetlaj picker tylko gdy showAvatarPicker jest true
                          <div className="avatar-picker mt-3">
                            {avatarNumbers.map((num) => (
                                <img
                                    key={num}
                                    src={`/avatars/avatar${num}.png`}
                                    alt={`Awatar ${num}`}
                                    className={`avatar-thumbnail ${profileImage === `/avatars/avatar${num}.png` ? 'selected-avatar' : ''}`}
                                    onClick={() => handleAvatarSelect(num)}
                                />
                            ))}
                          </div>
                      )}
                    </div>
                )}
                <h5 className="my-3">
                  {userData.imie} {userData.nazwisko}
                </h5>
                <p className="text-muted mb-1">{userData.role}</p>
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                {message && (
                    <div
                        className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}
                        role="alert"
                    >
                      {message.text}
                    </div>
                )}

                {/* !!! WAŻNE: <form> zaczyna się TUTAJ i kończy po wszystkich polach input !!! */}
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                      {/* Email */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">E-mail</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                              type="email"
                              className="form-control"
                              value={editedEmail}
                              onChange={(e) => setEditedEmail(e.target.value)}
                              required
                          />
                        </div>
                      </div>
                      <hr />

                      {/* Imię */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Imię</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                              type="text"
                              className="form-control"
                              value={editedFirstName}
                              onChange={(e) => setEditedFirstName(e.target.value)}
                              required
                          />
                        </div>
                      </div>
                      <hr />

                      {/* Nazwisko */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Nazwisko</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                              type="text"
                              className="form-control"
                              value={editedLastName}
                              onChange={(e) => setEditedLastName(e.target.value)}
                              required
                          />
                        </div>
                      </div>
                      <hr />

                      {/* Numer telefonu */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Numer telefonu</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          <input
                              type="text"
                              className="form-control"
                              value={editedPhoneNumber}
                              onChange={(e) => setEditedPhoneNumber(e.target.value)}
                              required
                          />
                        </div>
                      </div>
                      <hr />

                      {/* Rola (zawsze wyświetlana, nieedytowalna) */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Rola</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {userData.role}
                        </div>
                      </div>
                      <hr />

                      {/* Przyciski w trybie edycji (Zapisz/Anuluj) - ZAWSZE W FORMULARZU */}
                      <div className="row">
                        <div className="col-sm-12 text-end">
                          <button type="submit" className="save-button me-2" disabled={isLoading}>
                            {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={toggleEditMode} disabled={isLoading}>
                            Anuluj
                          </button>
                        </div>
                      </div>
                    </form>
                ) : (
                    // !!! WAŻNE: To jest tryb WYŚWIETLANIA, więc nie ma tu tagu <form> !!!
                    <>
                      {/* Email (wyświetlanie) */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">E-mail</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {editedEmail} {/* Użyj editedEmail, żeby pokazywało zaktualizowane dane */}
                        </div>
                      </div>
                      <hr />

                      {/* Imię (wyświetlanie) */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Imię</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {editedFirstName}
                        </div>
                      </div>
                      <hr />

                      {/* Nazwisko (wyświetlanie) */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Nazwisko</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {editedLastName}
                        </div>
                      </div>
                      <hr />

                      {/* Numer telefonu (wyświetlanie) */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Numer telefonu</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {editedPhoneNumber}
                        </div>
                      </div>
                      <hr />

                      {/* Rola (wyświetlanie) */}
                      <div className="row mb-3">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Rola</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {userData.role}
                        </div>
                      </div>
                      <hr />

                      {/* Przycisk "Edytuj profil" - POZA FORMULARZEM, gdy isEditing jest FALSE */}
                      <div className="row">
                        <div className="col-sm-12 text-end">
                          <button type="button" className="btn edit-button" onClick={toggleEditMode}>
                            Edytuj profil
                          </button>
                        </div>
                      </div>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Profile;