import styles from "./MessageBox.module.css";
import { useContext, useEffect, useState } from "react";
import Logo from "./Logo";
import TypingAnimation from "./TypingAnimation";
import { MessageContext } from "../context/MessageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

// Performance Issue: If the text history becomes large, it might be more
// efficient to store it in a more complex data structure or consider using
// the __useReducer__ hook for more sophisticated state management.
export default function MessageBox() {
  const { messages } = useContext(MessageContext);
  const [messageIndex, setMessageIndex] = useState<number>(0);

  console.log("length:", messages.length, "index:", messageIndex);

  // Updates messageIndex when a new message is added.
  useEffect(() => {
    // Ignore the last message.
    setMessageIndex(messages.length - 2); 
  }, [messages.length]);

  const nextMessageIndex = () => {
    // Ignore the last message.
    setMessageIndex((prev) => (prev === messages.length - 2 ? prev : prev + 1));
  };

  const prevMessageIndex = () => {
    // Ignore the last message.
    setMessageIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleClick = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "chevron-right") {
      nextMessageIndex();
    } else if (target.dataset.icon === "chevron-left") {
      prevMessageIndex();
    }
  };

  return (
    <div className={styles.container}>
      {/* header */}
      <div className={styles.header}>
        <Logo width="160px" color="black" />
        <div className={styles.navigate}>
          <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} onClick={handleClick}/>
          <span>
            {messageIndex + 1}/{messages.length - 1}
          </span>
          <FontAwesomeIcon icon={faChevronRight} className={styles.icon} onClick={handleClick}/>
        </div>
      </div>
      {/* body */}
      <div className={styles.body}>
        {/* Ignore the last message. */}
        {messageIndex >= 0 && messages[messageIndex].user && (
          <p className={`${styles.message} ${styles.user}`}>
            <FontAwesomeIcon icon={faCircleUser} className={styles.icon} />
            {messages[messageIndex].user}
          </p>
        )}
        <p className={`${styles.message} ${styles.ai}`}>
          <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
          {/* Ignore the last message. */}
          {messageIndex >= 0 && messages[messageIndex].ai && messages[messageIndex].ai}
          <TypingAnimation />
        </p>
      </div>
    </div>
  );
}
