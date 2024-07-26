import Logo from './Logo';
import styles from './Sidebar.module.css';

export default function Sidebar({children}: {children: React.ReactNode}) {
  return (
    <aside className={styles.sidebar}>
      <Logo />
      {children}
    </aside>

    
  );
}
