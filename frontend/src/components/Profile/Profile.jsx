// frontend/src/components/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userDataActions } from "../../store/userData";
import "./Profile.css"; // Używamy jednego, ale przeprojektowanego pliku CSS

// --- Komponent "Moja Półka", pozostaje bez zmian w logice ---
const MojaPolkaSection = () => {
  const [ebooki, setEbooki] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state.userData.token);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const fetchMyEbooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/profil/moja-polka', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setEbooki(data);
      } catch (error) {
        console.error("Błąd pobierania e-booków:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchMyEbooks();
  }, [token]);

  const handleDownload = async (ebookId) => {
    setDownloading(ebookId); // Pokaż stan ładowania na przycisku
    try {
      const response = await fetch(`http://localhost:8000/api/ebooks/${ebookId}/pobierz`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Błąd autoryzacji lub nie znaleziono pliku.');
      }

      const result = await response.json();

      // Kiedy otrzymamy link z backendu, przekierowujemy przeglądarkę, aby rozpoczęła pobieranie
      window.location.href = result.download_url;

    } catch (error) {
      console.error("Błąd podczas próby pobrania:", error);
      alert("Nie udało się pobrać pliku. Spróbuj ponownie.");
    } finally {
      setDownloading(null); // Zakończ stan ładowania
    }
  };

  if (loading) return <p className="text-center mt-4">Ładowanie Twoich e-booków...</p>;

  return (
      <>
        {ebooki.length === 0 ? (
            <p className="text-center text-muted mt-4">Nie masz jeszcze żadnych zakupionych e-booków.</p>
        ) : (
            <div className="ebook-grid">
              {ebooki.map(ebook => (
                  <div key={ebook.id} className="ebook-card">
                    <img src={ebook.okladka} alt={`Okładka ${ebook.tytul}`} />
                    <div className="ebook-info">
                      <h3>{ebook.tytul}</h3>
                      <p>{ebook.autor}</p>
                      <button
                          onClick={() => handleDownload(ebook.id)}
                          className="download-btn"
                          disabled={downloading === ebook.id}
                      >
                        {downloading === ebook.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-download"></i>
                        )}
                        {downloading === ebook.id ? 'Przygotowuję...' : ` Pobierz (${ebook.format})`}
                      </button>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </>
  );
};


// --- Główny komponent Profilu ---
const Profile = () => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  // Stany formularza i edycji (logika bez zmian)
  const [editedFirstName, setEditedFirstName] = useState(userData.imie || "");
  const [editedLastName, setEditedLastName] = useState(userData.nazwisko || "");
  const [editedEmail, setEditedEmail] = useState(userData.email || "");
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(userData.phoneNumber || "");
  const [profileImage, setProfileImage] = useState(userData.profilePic || "/avatars/avatar1.png");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatarNumbers = [1, 2, 3, 4, 5, 6];
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());

  useEffect(() => {
    setEditedFirstName(userData.imie || "");
    setEditedLastName(userData.nazwisko || "");
    setEditedEmail(userData.email || "");
    setEditedPhoneNumber(userData.phoneNumber || "");
    setProfileImage(userData.profilePic || "/avatars/avatar1.png");
    setCacheBuster(Date.now());
  }, [userData]);

  // Wszystkie Twoje funkcje (handleAvatarSelect, toggleEditMode, handleSubmit) pozostają bez zmian.

  const handleAvatarSelect = (avatarNumber) => {
    const newAvatarPath = `/avatars/avatar${avatarNumber}.png`;
    setProfileImage(newAvatarPath);
    // Możesz dispatchować od razu lub poczekać na zapis całego profilu
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setMessage(null);
    if (isEditing) { // Przywracamy wartości, jeśli anulujemy edycję
      setEditedFirstName(userData.imie || "");
      setEditedLastName(userData.nazwisko || "");
      setEditedEmail(userData.email || "");
      setEditedPhoneNumber(userData.phoneNumber || "");
      setProfileImage(userData.profilePic || "/avatars/avatar1.png");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        headers: { Authorization: `Bearer ${userData.token}`, "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: result.message });
        setIsEditing(false);
        dispatch(userDataActions.setData(result.user));
        setCacheBuster(Date.now());
      } else {
        setMessage({ type: "error", text: result.message || "Wystąpił błąd." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Nie udało się połączyć z serwerem." });
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <div className="profile-page-container">
        {/* === NOWY, NOWOCZESNY NAGŁÓWEK PROFILU === */}
        <div className="profile-header">
          <div className="profile-header-avatar">
            <img src={`${profileImage}?v=${cacheBuster}`} alt="Zdjęcie profilowe" />
            {isEditing && (
                <button className="change-avatar-btn" onClick={() => setShowAvatarPicker(p => !p)}>
                  <i className="fas fa-camera"></i>
                </button>
            )}
          </div>
          <div className="profile-header-info">
            <h1>{userData.imie} {userData.nazwisko}</h1>
            <p>{userData.role}</p>
          </div>
          {!isEditing && (
              <button className="profile-edit-main-btn" onClick={toggleEditMode}>
                <i className="fas fa-pencil-alt"></i> Edytuj profil
              </button>
          )}
        </div>

        {isEditing && showAvatarPicker && (
            <div className="profile-section-card avatar-picker-container">
              <div className="avatar-picker">
                {avatarNumbers.map((num) => (
                    <img key={num} src={`/avatars/avatar${num}.png?v=${cacheBuster}`} alt={`Awatar ${num}`}
                         className={`avatar-thumbnail ${profileImage === `/avatars/avatar${num}.png` ? 'selected-avatar' : ''}`}
                         onClick={() => handleAvatarSelect(num)} />
                ))}
              </div>
            </div>
        )}


        {/* === SEKCJA "MOJA PÓŁKA" - WIDOCZNA OD RAZU === */}
        <div className="profile-section-card">
          <div className="section-title">
            <i className="fas fa-book-open"></i>
            <h2>Moja półka</h2>
          </div>
          <MojaPolkaSection />
        </div>

        {/* === SEKCJA "DANE PROFILOWE" === */}
        <div className="profile-section-card">
          <div className="section-title">
            <i className="fas fa-user-edit"></i>
            <h2>Dane profilowe</h2>
          </div>

          {message && (
              <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                {message.text}
              </div>
          )}

          {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <label>Imię</label>
                  <input type="text" value={editedFirstName} onChange={(e) => setEditedFirstName(e.target.value)} required />
                </div>
                <div className="form-row">
                  <label>Nazwisko</label>
                  <input type="text" value={editedLastName} onChange={(e) => setEditedLastName(e.target.value)} required />
                </div>
                <div className="form-row">
                  <label>E-mail</label>
                  <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} required />
                </div>
                <div className="form-row">
                  <label>Numer telefonu</label>
                  <input type="text" value={editedPhoneNumber} onChange={(e) => setEditedPhoneNumber(e.target.value)} />
                </div>
                <div className="form-actions-edit">
                  <button type="button" className="btn-cancel" onClick={toggleEditMode} disabled={isLoading}>Anuluj</button>
                  <button type="submit" className="btn-save" disabled={isLoading}>
                    {isLoading ? "Zapisywanie..." : "Zapisz zmiany"}
                  </button>
                </div>
              </form>
          ) : (
              <div className="profile-data-view">
                <div className="data-row"><span>Imię</span><span>{userData.imie}</span></div>
                <div className="data-row"><span>Nazwisko</span><span>{userData.nazwisko}</span></div>
                <div className="data-row"><span>E-mail</span><span>{userData.email}</span></div>
                <div className="data-row"><span>Numer telefonu</span><span>{userData.phoneNumber || '-'}</span></div>
                <div className="data-row"><span>Rola</span><span>{userData.role}</span></div>
              </div>
          )}
        </div>
      </div>
  );
};

export default Profile;