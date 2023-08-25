import Link from "next/link";

import styles from './Navbar.module.scss';

interface NavItemProps {
  text: string
  href: string
  active: boolean
  closeNav: () => void
}

const NavItem = ({ text, href, active, closeNav }: NavItemProps) => {
  return (
    <Link 
      href={href} 
      onClick={closeNav}
      className={`${styles.item} ${active ? styles.active : ''}`}
    >
      {text}
    </Link>
  );
};

export default NavItem;
