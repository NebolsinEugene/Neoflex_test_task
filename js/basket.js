"use strict";
//==========================================
import { ERROR_SERVER, NO_ITEMS_CART } from "./constants.js";
import {
  //showErrorMessage,
  setBasketLocalStorage,
  getBasketLocalStorage,
  checkingRelevanceValueBasket,
} from "./utils.js";

const cart = document.querySelector(".cart");
let productsData = [];

getProducts();
cart.addEventListener("click", delProductBasket);

async function getProducts() {
  if (!productsData.length) {
    const res = await fetch("/products.json");
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    productsData = await res.json();
  }

  loadProductBasket(productsData);
}

function loadProductBasket(data) {
  cart.textContent = "";

  if (!data || !data.length) {
    showErrorMessage(ERROR_SERVER);
    return;
  }

  checkingRelevanceValueBasket(data);
  const basket = getBasketLocalStorage();

  if (!basket || !basket.length) {
    showErrorMessage(NO_ITEMS_CART);
    return;
  }

  const findProducts = data.filter((item) => basket.includes(String(item.id)));

  if (!findProducts.length) {
    showErrorMessage(NO_ITEMS_CART);
    return;
  }

  renderProductsBasket(findProducts);
}

function delProductBasket(event) {
  const targetButton = event.target.closest(".cart__del-card");
  if (!targetButton) return;

  const card = targetButton.closest(".cart__product");
  const id = card.dataset.productId;
  const basket = getBasketLocalStorage();

  const newBasket = basket.filter((item) => item !== id);
  setBasketLocalStorage(newBasket);

  getProducts();
}
// Находим элементы на странице
const btnMinus = document.querySelector('[data-action="minus"]');
const btnPlus = document.querySelector('[data-action="plus"]');
const counter = document.querySelector("[data-counter]");

window.addEventListener("click", function (event) {
  if (event.target.dataset.action === "plus");
  const counterWrapper = event.target.closest(".cart__block-btns");
  console.log(counterWrapper);
  const counter = counterWrapper.querySelector("[data-counter]");
  console.log(counter);
  counter.innerText = ++counter.innerText;
});

function renderProductsBasket(arr) {
  arr.forEach((card) => {
    const { id, img, title, price } = card;

    const cardItem = `
        <div class="cart__product" data-product-id="${id}">
            <div class="cart__info">
                <img src="./images/${img}" alt="${title}">
                <div class="cart__title">${title}<br>
                <div class="cart__price">
                ${price}₽
            </div>
                </div>
            </div>
            
            <div class="cart__block-btns">
                <div class="cart__minus"data-action="minus">
                <img src="/images/-.svg" alt="">
</div>

                <div class="cart__count" data-counter>1</div>

                <div class="cart__plus"data-action="plus">
                <img src="/images/+.svg" alt=""></div>
            </div>
          
            
            <div class="cart__del-card">
            <img src="/images/del-btn.svg" alt="Удалить"></div>
        </div>
        `;

    cart.insertAdjacentHTML("beforeend", cardItem);
  });
}
