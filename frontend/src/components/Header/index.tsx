import { useState, useEffect } from 'react';
import logo from '../../assets/images/SportGear.png';
import { FiShoppingCart, FiUser, FiAlignJustify } from 'react-icons/fi';
import ModalLogin from '../ModalLogin';
import Link from '../Link';
import styles from './Header.module.scss';

interface HeaderProps {
  isAdmin?: boolean;
}

export default function Header({ isAdmin = false }: HeaderProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const isAdminUser = localStorage.getItem('isAdmin') === 'true';

  const storageProducts = localStorage.getItem('cartProducts');
  const cartProducts = storageProducts ? JSON.parse(storageProducts) : [];
  const totalProductsInCart = cartProducts.length;

  const handleLogOut = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    localStorage.removeItem('isAdmin');
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    setIsUserLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, [isModalOpen]);

  const RegularHeader = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Link redirect="/">
              <img className={styles.logo} src={logo} alt="" />
            </Link>
          </div>
          <div className={styles.linksWrapper}>
            <Link texto="Produtos" redirect="/products" />
            <Link texto="Sobre" redirect="/sobre" />
          </div>

          <nav className={styles.navWrapper}>
            <ul className={styles.iconsWrapper}>
              <li>
                <a href="/cart" className={styles.countWrapper}>
                  <FiShoppingCart />
                  {totalProductsInCart > 0 && (
                    <span className={styles.cartItemCount}>
                      {totalProductsInCart}
                    </span>
                  )}
                </a>
              </li>
              <li>
                <div className={styles.alignMenuItems}>
                  {isUserLoggedIn ? (
                    <div className={styles.alignMenuItems}>
                      <Link
                        className={styles.alignMenuItems}
                        redirect="/editprofile"
                      >
                        <FiUser />
                        <span>Minha conta</span>
                      </Link>
                      <Link redirect="/requests">
                        <span>Meus pedidos</span>
                      </Link>
                      {isAdminUser && (
                        <Link redirect="/admin">
                          <span>Painel Administrativo</span>
                        </Link>
                      )}
                      <Link onClick={handleLogOut} redirect="/">
                        Sair
                      </Link>
                    </div>
                  ) : (
                    <button onClick={() => setIsModalOpen(true)}>Login</button>
                  )}
                </div>
              </li>
              <ModalLogin isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
            </ul>
            <ul className={styles.iconsWrapperMobile}>
              <li onClick={() => setShowMobileMenu(!showMobileMenu)}>
                <FiAlignJustify />
              </li>
            </ul>
          </nav>
        </header>
        {showMobileMenu && (
          <div className={styles.mobileMenu}>
            <ul>
              <li>
                <Link texto="Produtos" redirect="/loja" />
              </li>
              <li>
                <Link texto="Sobre" redirect="/sobre" />
              </li>
            </ul>
          </div>
        )}
      </>
    );
  };

  const AdminHeader = () => {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Link redirect="/">
              <img className={styles.logo} src={logo} alt="" />
            </Link>
          </div>
          <nav className={styles.navWrapper}>
            <ul className={styles.iconsWrapper}>
              <li>Painel Administrativo</li>
              <li>
                <a href="/">Sair</a>
              </li>
            </ul>
          </nav>
        </header>
      </>
    );
  };

  return <>{isAdmin ? <AdminHeader /> : <RegularHeader />}</>;
}