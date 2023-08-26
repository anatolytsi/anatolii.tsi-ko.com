import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

import NavItem from "./NavItem";
import styles from './Navbar.module.scss';
import Link from "next/link";

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Resume", href: "/resume" },
  { text: "Portfolio", href: "/portfolio" },
];

const Navbar = () => {
  const { data: session } = useSession();
  const [navActive, setNavActive] = useState(false);
  const [clickCounter, setClickCounter] = useState(0);
  const showLogin = useRef(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [transparent, setTransparent] = useState(true);

  const changeNavbarTransparent = () => {
      if (window.scrollY >= 95) {
          setTransparent(false);
      } else {
          setTransparent(true);
      }
  };
  
  useEffect(() => {
    if (clickCounter > 5) {
      showLogin.current = true;
    }
  }, [clickCounter])

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (navActive && ref.current && !ref.current.contains(event.target)) {
        setNavActive(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navActive]);

  useEffect(() => {
    window.addEventListener('scroll', changeNavbarTransparent);

    return () => {
      window.removeEventListener('scroll', changeNavbarTransparent);
    };
  });

  const renderAuthButtons = () => {
    if (session) {
      return (
        <div
          className={styles.item}
          onClick={() => {signOut()}}
        >
          Logout
        </div>
      );
    } else {
      if (showLogin.current) {
        return (
          <Link 
            href='/api/auth/signin'
            className={styles.item}
          >
            Login
          </Link>
        );
      } else {
        return (<></>);
      }
    }
  }

  return (
    <header className={styles.header} onClick={() => {setClickCounter(clickCounter + 1)}}>
      <nav className={`${styles.nav} ${transparent ? styles.transparent : ''}`}>
        <div
          onClick={() => setNavActive(prevNavActive => !prevNavActive)}
          className={`${navActive ? styles.active : ""} ${styles.bar}`}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={`${navActive ? styles.active : ""} ${styles.list}`} ref={ref}>
          {MENU_LIST.map((menu, idx) => (
            <NavItem active={menu.href === router.pathname} {...menu} key={idx} closeNav={() => setNavActive(false)}/>
          ))}
          {renderAuthButtons()}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
