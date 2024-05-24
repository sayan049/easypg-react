import React from "react";
import "../designs/messfind.css";

const ToggleSwitch = ({isChecked,handleToggle}) => {
  // const [isChecked, setIsChecked] = useState(true);

  // const handleToggle = () => {
  //   setIsChecked(!isChecked);
  // };

  return (
    <div className={`toggle-container ${isChecked ? "checked" : ""} blue`}>
      <input
        type="checkbox"
        className={`toggle-checkbox ${isChecked ? "toggled-once" : ""}`}
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className="toggle-track">
        <div className={`toggle-thumb ${isChecked ? "toggled-once" : ""}`} />
      </div>
    </div>
  );
};

export default ToggleSwitch;

