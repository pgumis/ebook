import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userDataActions } from "../../store/userData";
import "./Profile.css"; // Stylizacje poniżej

const Profile = () => {
  const [profileImage, setProfileImage] = useState("/profile.jpg"); // domyślne zdjęcie
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      dispatch(userDataActions.setData({ profilePic: imageUrl }));
    }
  };

  return (
    <div className="panel">
      <h2>Twój profil</h2>
      <div className="profile-card">
        <img
          src={profileImage}
          alt="Zdjęcie profilowe"
          className="profile-img"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <div className="profile-info">
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
