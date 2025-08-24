import { useEffect, useState } from "react";
import "./TextBox.css";

export default function TextBox() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  // Expose helpers for your Kaboom code
  useEffect(() => {
    window.showDialog = (msg) => {
      if (typeof msg === "string") setText(msg);
      setVisible(true);
    };
    window.hideDialog = () => setVisible(false);

    return () => {
      delete window.showDialog;
      delete window.hideDialog;
    };
  }, []);

  return (
    <div
      id="textbox-container"
      style={{ display: visible ? "block" : "none" }}
    >
      <div id="textbox">
        <p id="dialogue" className="ui-text">{text}</p>
        <div className="btn-container">
          <button
            id="close"
            type="button"
            className="ui-close-btn"
            onClick={() => setVisible(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
