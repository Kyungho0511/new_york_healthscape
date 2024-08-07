import { Link, useLocation } from 'react-router-dom'
import Button from './Button'
import styles from './Footbar.module.css'

export default function Footbar() {

  // router navigation logic
  const location = useLocation();
  let nextPath = "/";

  switch (location.pathname) {
    case "/":
      nextPath = "/explore";
      break;
    case "/explore":
      nextPath = "/cluster";
      break;
    case "/cluster":
      nextPath = "/";
      break;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.chatbox}>
        
      </div>
      <Link to={nextPath}> 
        <Button text="continue" color="grey" location="footbar" />
      </Link>
    </footer>
  )
}