"use strict";
//==========================================
import {
  setBasketLocalStorage,
  getBasketLocalStorage,
  checkingRelevanceValueBasket,
} from "./utils.js";

import {
  COUNT_SHOW_CARDS_CLICK,
  //ERROR_SERVER,
  NO_PRODUCTS_IN_THIS_CATEGORY,
} from "./constants.js";

const cards = document.querySelector(".cards");
const btnShowCards = document.querySelector(".show-cards");
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];

// Загрузка товаров
getProducts();

// Обработка клика по кнопке "В корзину"
cards.addEventListener("click", handleCardClick);

// Получение товаров
async function getProducts() {
  if (!productsData.length) {
    const res = await fetch("/products.json");
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    productsData = await res.json();
  }

  renderStartPage(productsData);
}

function renderStartPage(data) {
  if (!data || !data.length) {
    showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
    return;
  }

  const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
  createCards(arrCards);

  checkingRelevanceValueBasket(data);

  const basket = getBasketLocalStorage();
  checkingActiveButtons(basket);
}

function sliceArrCards() {
  if (shownCards >= productsData.length) return;

  countClickBtnShowCards++;
  const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;

  const arrCards = productsData.slice(shownCards, countShowCards);
  createCards(arrCards);
  shownCards = cards.children.length;

  if (shownCards >= productsData.length) {
    btnShowCards.classList.add("none");
  }
}

function handleCardClick(event) {
  const targetButton = event.target.closest(".buy-btn");
  if (!targetButton) return;

  const card = targetButton.closest(".product-item");
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();

  if (basket.includes(id)) return;

  basket.push(id);
  setBasketLocalStorage(basket);
  checkingActiveButtons(basket);
}

function checkingActiveButtons(basket) {
  const buttons = document.querySelectorAll(".buy-btn");

  buttons.forEach((btn) => {
    const card = btn.closest(".product-item");
    const id = card.dataset.productId;
    const isInBasket = basket.includes(id);

    btn.disabled = isInBasket;
    btn.classList.toggle("active", isInBasket);
    btn.textContent = isInBasket ? "В корзине" : "Купить";
  });
}

// Рендер карточки
function createCards(data) {
  data.forEach((card) => {
    const { id, img, title, rate, price } = card;

    const cardItem = `<div class="product-item" data-product-id="${id}">
            <div class="product-item-image">
            <a href="/card.html?id=${id}" >
            <img
                src="./images/${img}"
                alt="${title}"
            />
        </a>
            </div>

            <div class="product-item-info">
            <a href="/card.html?id=${id}" class="product-item-name">${title}</a>
              <div class="product-item-price">${price}₽</div>
            </div>
            <div class="product-rate">
              <div class="rate">
                <img src="images/star.svg" alt="оценка" />
                <a href="/card.html?id=${id}" class="rate">${rate}</a>
              </div>
              
              <button class="buy-btn">Купить</button>
            </div>
          </div>`;

    // `
    //             <div class="card" data-product-id="${id}">
    //                 <div class="card__top">
    //                     <a href="/card.html?id=${id}" class="card__image">
    //                         <img
    //                             src="./images/${img}"
    //                             alt="${title}"
    //                         />
    //                     </a>

    //                 </div>
    //                 <div class="card__bottom">
    //                     <div class="card__prices">

    //                         <div class="card__price card__price--common">${price}</div>
    //                     </div>
    //                     <a href="/card.html?id=${id}" class="card__title">${title}</a>
    //                     <button class="card__add">В корзину</button>
    //                 </div>
    //             </div>
    //         `;
    cards.insertAdjacentHTML("beforeend", cardItem);
  });
}
