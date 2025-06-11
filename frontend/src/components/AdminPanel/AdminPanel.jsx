import React, { useState, useEffect } from "react";
import "./AdminPanel.css";
import UserManagement from "./UserManagement";
import EbookManagement from "./EbookManagement";
import ReviewManagement from "./ReviewManagement";
import OrderManagement from "./OrderManagement";
import MessageInbox from "./MessageInbox";
import UserDetails from "./UserDetails";
const AdminPanel = () => {
  const [activeView, setActiveView] = useState("users");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize); // nasłuchuj zmiany rozmiaru
    return () => window.removeEventListener("resize", handleResize); // usuń nasłuchiwacz przy unmount
  }, [windowWidth]);

  const renderActiveView = () => {
    switch (activeView) {
      case "users":
        return <UserManagement />;

      case "ebooks":
        return <EbookManagement />;
      case "reviews":
        return <ReviewManagement />;
      case "orders":
        return <OrderManagement />;
      case "messages":
        return <MessageInbox />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="panel admin-panel-layout">
      {windowWidth >= 1189 && (
        <aside className="admin-sidebar">
          <nav>
            <ul>
              {/* -> DODANE IKONY DO KAŻDEJ POZYCJI */}
              <li
                className={activeView === "users" ? "active" : ""}
                onClick={() => setActiveView("users")}
              >
                <i className="fas fa-users"></i>
                <span>Zarządzaj użytkownikami</span>
              </li>
              <li
                className={activeView === "ebooks" ? "active" : ""}
                onClick={() => setActiveView("ebooks")}
              >
                <i className="fas fa-book"></i>
                <span>Zarządzaj e-bookami</span>
              </li>
              <li
                className={activeView === "reviews" ? "active" : ""}
                onClick={() => setActiveView("reviews")}
              >
                <i className="fas fa-star"></i>
                <span>Zarządzaj recenzjami</span>
              </li>
              <li
                className={activeView === "orders" ? "active" : ""}
                onClick={() => setActiveView("orders")}
              >
                <i className="fas fa-receipt"></i>
                <span>Zarządzaj zamówieniami</span>
              </li>
              <li
                className={activeView === "messages" ? "active" : ""}
                onClick={() => setActiveView("messages")}
              >
                <i className="fas fa-inbox"></i>
                <span>Skrzynka wiadomości</span>
              </li>
            </ul>
          </nav>
        </aside>
      )}
      {windowWidth < 1189 && (
        <div className="mobile-button-grid">
          <button
            onClick={() => setActiveView("users")}
            className={activeView === "users" ? "active" : ""}
          >
            <i className="fas fa-users"></i>
            <span>Użytkownicy</span>
          </button>
          <button
            onClick={() => setActiveView("ebooks")}
            className={activeView === "ebooks" ? "active" : ""}
          >
            <i className="fas fa-book"></i>
            <span>E-booki</span>
          </button>
          <button
            onClick={() => setActiveView("reviews")}
            className={activeView === "reviews" ? "active" : ""}
          >
            <i className="fas fa-star"></i>
            <span>Recenzje</span>
          </button>
          <button
            onClick={() => setActiveView("orders")}
            className={activeView === "orders" ? "active" : ""}
          >
            <i className="fas fa-receipt"></i>
            <span>Zamówienia</span>
          </button>
          <button
            onClick={() => setActiveView("messages")}
            className={activeView === "messages" ? "active" : ""}
          >
            <i className="fas fa-inbox"></i>
            <span>Wiadomości</span>
          </button>
        </div>
      )}
      <main className="admin-content">{renderActiveView()}</main>
    </div>
  );
};

export default AdminPanel;
