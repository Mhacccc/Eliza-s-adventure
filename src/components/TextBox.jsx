import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import "./TextBox.css";

export default function TextBox() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

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
    <AnimatePresence>
      {visible && (
        <motion.div
          id="textbox" // 👈 animate the actual textbox
          key="textbox"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.30, ease: "easeOut" }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
