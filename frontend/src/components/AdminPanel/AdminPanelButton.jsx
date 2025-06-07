const AdminPanelButton = ({ children, index }) => {
  const icons = [
    <svg
      fill="none"
      height="64"
      viewBox="0 0 24 24"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="9"
        cy="9"
        r="4"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        d="M16 19C16 15.6863 12.866 13 9 13C5.13401 13 2 15.6863 2 19"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        d="M15 13C17.2091 13 19 11.2091 19 9C19 6.79086 17.2091 5 15 5C13.8053 5 12.7329 5.52375 12 6.35418"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        d="M22 19C22 15.6863 18.866 13 15 13C14.1928 13 12.897 12.7069 12 11.7655"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>,
    <svg
      fill="none"
      height="64"
      viewBox="0 0 24 24"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6.60324C13.6667 5.33178 17.5 3.74246 21 6.60324V19C17.5 16.1392 13.6667 17.7285 12 19M12 6.60324C10.3333 5.33178 6.5 3.74246 3 6.60324V19C6.5 16.1392 10.3333 17.7285 12 19M12 6.60324V19"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>,
    <svg
      data-name="Layer 1"
      id="Layer_1"
      viewBox="0 0 24 24"
      width="64"
      height="64"
      stroke="white"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title />
      <path d="M22.28,11.75a2.54,2.54,0,0,0,.6-2.56,2.43,2.43,0,0,0-1.95-1.7l-4.44-.66a.47.47,0,0,1-.36-.27l-2-4.17A2.39,2.39,0,0,0,12,1h0A2.37,2.37,0,0,0,9.83,2.4l-2,4.18a.46.46,0,0,1-.36.27l-4.43.69a2.4,2.4,0,0,0-1.94,1.7,2.53,2.53,0,0,0,.61,2.56L5,15.05a.49.49,0,0,1,.14.43l-.75,4.6a2.53,2.53,0,0,0,1,2.44,2.3,2.3,0,0,0,1.4.48,2.4,2.4,0,0,0,1.13-.29l4-2.18a.45.45,0,0,1,.45,0l4,2.16a2.33,2.33,0,0,0,2.53-.2,2.55,2.55,0,0,0,1-2.45l-.77-4.59a.51.51,0,0,1,.13-.44Zm-4.56,1.83A2.58,2.58,0,0,0,17,15.79l.77,4.6a.48.48,0,0,1-.18.48.46.46,0,0,1-.5,0l-4-2.16a2.34,2.34,0,0,0-2.24,0l-4,2.18a.46.46,0,0,1-.5,0,.47.47,0,0,1-.19-.48L7,15.82a2.58,2.58,0,0,0-.69-2.21L3.08,10.36A.49.49,0,0,1,3,9.86a.48.48,0,0,1,.39-.34l4.43-.68A2.4,2.4,0,0,0,9.58,7.47l2-4.19A.46.46,0,0,1,12,3a.46.46,0,0,1,.43.27l2,4.18a2.43,2.43,0,0,0,1.81,1.36l4.44.66a.45.45,0,0,1,.38.33.48.48,0,0,1-.12.51Z" />
    </svg>,
    <svg
      fill="none"
      height="64"
      viewBox="0 0 24 24"
      width="64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 8H16M16 12H11M16 16H11M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        d="M8 8H8.001"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        d="M8 12H8.001"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
      <path
        d="M8 16H8.001"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      />
    </svg>,
  ];

  return (
    <div className="admin-panel-container">
      <button className="admin-panel-button" onClick={() => {}}>
        {icons[index]}
        {children}
      </button>
    </div>
  );
};

export default AdminPanelButton;
