import { useContext, useEffect } from "react";
import "./switch.css";
import { SwitchContext } from "../../contexts/SwitchContext";
import { Tooltip } from "react-tooltip";

function Switch() {
  const { darkMode, setDarkMode } = useContext(SwitchContext);

  // Load theme from localStorage on first load
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setDarkMode(saved === "true");
    }
  }, []);

  // Apply theme to body + save
  useEffect(() => {
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <>
      <div
        className="wrapper"
        data-tooltip-id="modebtn"
        data-tooltip-content="Switch Theme"
      >
        <input
          type="checkbox"
          className="switch"
          aria-label="Toggle theme"
          checked={!darkMode}
          onChange={() => setDarkMode(prev => !prev)}
        />
      </div>

      <Tooltip
        id="modebtn"
        place="left"
        className="tooltip-mode"
      />
    </>
  );
}

export default Switch;