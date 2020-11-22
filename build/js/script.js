'use strict';
(() => {
  const navigation = document.querySelector(`.page-header__nav`);
  const menuToggle = document.querySelector(`.toggle`);

  const removeClass = () => {
    menuToggle.classList.remove(`toggle--nojs`);
    navigation.classList.remove(`page-header__nav--nojs`);
  };

  removeClass();

  const toggleMenu = () => {
    menuToggle.classList.toggle(`toggle--active`);
    navigation.classList.toggle(`page-header__nav--active`);
  };

  menuToggle.addEventListener(`click`, toggleMenu);
})();
