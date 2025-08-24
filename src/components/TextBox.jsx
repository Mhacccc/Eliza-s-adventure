import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"
import "./TextBox.css";

export default function TextBox() {
  const [visible, setVisible] = useState(false);
  const [dialogues, setDialogues] = useState([]); // multiple texts
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // function to show dialogues
    window.showDialog = (msg) => {
      if (typeof msg === "string") {
        setDialogues([msg]); // single string -> wrap in array
      } else if (Array.isArray(msg)) {
        setDialogues(msg); // array of dialogues
      }
      setCurrentIndex(0);
      setVisible(true);
    };

    window.hideDialog = () => setVisible(false);

    return () => {
      delete window.showDialog;
      delete window.hideDialog;
    };
  }, []);

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1); // next line
    } else {
      setVisible(false); // close after last line
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="textbox"
          key="textbox"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.30, ease: "easeOut" }}
        >
          <p id="dialogue" className="ui-text">{dialogues[currentIndex]}</p>
          <div className="btn-container">
            <button
              id="close"
              type="button"
              className="ui-close-btn"
              onClick={handleNext}
            >
              {currentIndex < dialogues.length - 1 ? "Next" : "Close"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
