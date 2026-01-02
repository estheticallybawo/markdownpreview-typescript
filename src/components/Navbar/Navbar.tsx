import { Link } from "react-router-dom";
import { Button } from "../ui/button.tsx";
import { BookText } from "lucide-react";
import ThemeToggle from "../ThemeToggle/ThemeToggle.tsx";
import styles from "./Navbar.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <BookText className={styles.icon} />
        <h1 className={styles.logo}>Markdown Preview</h1>
      </div>
      <div className={styles.right}>
        <Link to="/">
          <Button variant="ghost">Home</Button>
        </Link>
        <Link to="/api-demo">
          <Button variant="ghost">API Demo</Button>
        </Link>
        <Link to="/error-test">
          <Button variant="outline">Error Test</Button>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;