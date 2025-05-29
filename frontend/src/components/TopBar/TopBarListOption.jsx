import "./TopBarListOption.css";
const TopBarListOption = ({ first, last, children, onClick }) => {
  let style = first
    ? { borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }
    : last
    ? { borderBottomRightRadius: "10px", borderBottomLeftRadius: "10px" }
    : {};
  return (
    <div className="list-option" style={style} onClick={onClick}>
      {children === "Zarządzaj profilem" && (
        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="10" r="3" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><path d="M17 17C17 14.7909 14.7614 13 12 13C9.23858 13 7 14.7909 7 17" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><rect height="18" rx="3" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="3"/></svg>
      )}
      {children === "Historia zamówień" && (
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 6.60324C13.6667 5.33178 17.5 3.74246 21 6.60324V19C17.5 16.1392 13.6667 17.7285 12 19M12 6.60324C10.3333 5.33178 6.5 3.74246 3 6.60324V19C6.5 16.1392 10.3333 17.7285 12 19M12 6.60324V19"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      )}
      {children === "Ustawienia" && (
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 21H10L9.44904 18.5206C8.7879 18.2618 8.17573 17.9053 7.63028 17.4689L5.20573 18.232L3.20573 14.7679L5.07828 13.0503C5.02673 12.7077 5 12.357 5 12C5 11.643 5.02673 11.2923 5.07828 10.9496L3.20573 9.23204L5.20574 5.76794L7.6303 6.53106C8.17575 6.09467 8.78791 5.73819 9.44904 5.47935L10 3H14L14.551 5.47935C15.2121 5.73819 15.8242 6.09466 16.3697 6.53104L18.7942 5.76794L20.7942 9.23204L18.9217 10.9496C18.9733 11.2922 19 11.643 19 12C19 12.357 18.9733 12.7078 18.9217 13.0504L20.7942 14.7679L18.7942 18.232L16.3697 17.4689C15.8243 17.9053 15.2121 18.2618 14.551 18.5206L14 21Z"
            stroke="black"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
          <circle cx="12" cy="12" r="3" stroke="black" stroke-width="2" />
        </svg>
      )}

      <span>{children}</span>
    </div> /*przerzucic to po prostu do top bara*/
  );
};
export default TopBarListOption;
