import {
	contentArray
}
from "./content.js";


// BUTTONS NAVEGATION VAR
let cartPage = document.querySelector(".cart-page");
let buttonCart = document.querySelector(".boton-cart");
let buttonMain = document.querySelector(".cart-nav__back");

// BOTONES NAVEGACIÓN FUNCTIONES Y LISTENERS
buttonCart.addEventListener("click", function() {
	changePage(cartPage);
});
buttonMain.addEventListener("click", function() {
	changePage(cartPage);
});

function changePage(page) {
	if (window.getComputedStyle(page).display == "block") {
		page.style.display = "none";
	} else if (window.getComputedStyle(page).display == "none") {
		page.style.display = "block";
	}
}

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

let subtotalPrice = 0;
let cartArray = [];
let arrayPrintedCart = [];

// PAGES VAR
let menu = document.querySelector(".menu"); //
let cart = document.querySelector(".cart");

// BUTTON SEND
let buttonSend = document.querySelector(".enviar-pedido");


// LOAD THE DATA INTO THE MENU PAGE
function start() {
	contentArray.forEach(function(objectItem) { //TAKE EACH DATA //
		let item = printData(objectItem, menu); // PRINT THE DATA AND SET EACH ITEM TO MANU ITEM

		trigerCount(item);
		prepareToOpenPopUp(item);
	});
	let clearCartButton = document.querySelector("div.cart-nav__clear"); // CLEAR THE ENTIRE CART
	clearCartButton.addEventListener("click", function() { // CLEAR CART EVENT LISTENER
		clearCart();
	});
}

function trigerCount(item) {
	let plusButton = item.querySelector(".menu__item-amount-plus");
	let minusButton = item.querySelector(".menu__item-amount-minus");
	plusButton.addEventListener("click", function() { // EVENT LISTENER TO INTERACT WITH + BUTTONS
		addItem(this);
	});
	minusButton.addEventListener("click", function() { // EVENT LISTENER TO INTERACT WITH - BUTTONS
		removeItem(this);
	});
}



//////////////////////////////////////////////
function prepareToOpenPopUp(item) {
	let popUpHTML;
	let itemImg = item.querySelector(".menu__item-img-container");
	itemImg.addEventListener("click", function() {
		let object = getObject(itemImg, contentArray);
		popUpHTML = printPopUp(object);
		activatePopUpCounter(popUpHTML)
		backToMenu(popUpHTML)
	});
}

function backToMenu(popUpHTML) {
	let itemBackgd = popUpHTML.querySelector(".menu__popup-background")
	itemBackgd.addEventListener("click", function() {
		popUpHTML.remove();
	});
}

function activatePopUpCounter(popUpHTML) {
	let itemPlusButton = popUpHTML.querySelector(".menu__item-amount-plus");
	itemPlusButton.addEventListener("click", function() {
		addItem(popUpHTML);
	});

	let itemMinusButton = popUpHTML.querySelector(".menu__item-amount-minus");
	itemMinusButton.addEventListener("click", function() {
		removeItem(popUpHTML);
	});
}

function printPopUp(item) {
	let popUp = document.createElement("div"); // CREATE A DIV
	popUp.setAttribute("data-content_id", `${item.id}`); // ADD ATTRIBUTE
	popUp.className = "menu__popup"; // ADD CLASS
	popUp.innerHTML = `
	<div class="menu__popup-area">
		<div class="menu__popup-img__container">
			<img class="menu__popup-img" src="${item.imgSrc}" alt="">
		</div>
		<div class="menu__popup-text">
			<h3 class="menu__popup-title">${item.title}</h3>
			<p class="menu__popup-desc">${item.description}</p>
			<p class="menu__popup-det__desc">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
		</div>
		<div class="menu__popup__price">
			<div class="menu__popup-price">${item.price}</div>
			<div class="menu__popup-count" data-content_id='${item.id}'>
				<div class="menu__item-amount-minus">
					<h3>-</h3>
				</div>
				<h3 class="menu__item-amount-count">${item.count}</h3>
				<div class="menu__item-amount-plus">
					<h3>+</h3>
				</div>
			</div>
		</div>
	</div>
	<div class="menu__popup-background"></div>
	`;
	document.body.prepend(popUp);
	return popUp;
}


//////////////////////////////////////////////
// FUNCTION TO PRINT AN ITEM IN THE MAIN MENU PAGE IN START PAGE

function printData(objectItem, page) { // 
	let item = document.createElement("div"); // CREATE A DIV
	item.setAttribute("data-content_id", `${objectItem.id}`); // ADD ATTRIBUTE
	item.className = "menu__item"; // ADD CLASS
	item.innerHTML = `
		<div class="menu__item-img-container">
			<img class="menu__item-img" src="${objectItem.imgSrc}" alt="">
		</div>

	  <div class="menu__item-text">
	    <h3 class="menu__item-price">${objectItem.price + ".00"}</h3>
	    <h3 class="menu__item-title">${objectItem.title}</h3>
	    <p class="menu__item-desc">${objectItem.description}</p>

	    <div class="menu__item-amount" data-content_id='${objectItem.id}'>
	      <div class="menu__item-amount-minus">
	        <h3>-</h3>
	      </div>

	      <h3 class="menu__item-amount-count">${"0" + objectItem.count}</h3>

	      <div class="menu__item-amount-plus">
	        <h3>+</h3>
	      </div>
	    </div>

	  </div>
		`; // ADD ALL THE ELEMNTS WITH THEIR RESPECTIVE ID'S
	page.appendChild(item); // ADD THE DIV TO THE MENU
	return item;
}



// GET OBJECT SELECTED ITEMS'S
function getObject(element, arrayPlatos) {
	let objectDish;
	let elementId;
	if (element.parentNode.getAttribute("data-content_id")) {
		elementId = element.parentNode.getAttribute("data-content_id");
		objectDish = arrayPlatos.find(objectItem => objectItem.id == elementId)
	} else {
		elementId = element.getAttribute("data-content_id");
		objectDish = arrayPlatos.find(objectItem => objectItem.id == elementId)
	}
	return objectDish;
}

//////////////////////////////////////////////

// SUM COUNT IN CASE +
function addItem(element) {

	let objectItem = getObject(element, contentArray);
	console.log(objectItem);
	if (isItemInCart(objectItem)) { // ASK IF IT'S IN THE CART TO KNOW IF WE SHOULD ADD IT OR NOT

		objectItem.count++
		updateCount(objectItem);
	} else { // IS IT'S NOT

		objectItem.count++
		cartArray.push(objectItem);
		updateCount(objectItem);
		printItemCart(objectItem)
	}
	getPrice(objectItem, true)
}

// SUBSTRACT COUNT IN CASE -
function removeItem(element) {
	let objectItem = getObject(element, contentArray);

	if (objectItem.count == 1) {

		objectItem.count--
		updateCount(objectItem);
		removeFromCartArray(objectItem);
		removeFromCart(objectItem);
		getPrice(objectItem, false)
	} else if (objectItem.count == 0) {} else {

		objectItem.count--
		updateCount(objectItem);
		getPrice(objectItem, false)
	}
}
//////////////////////////////////////////////
// ASK IF THE ITEM IS ON THE CART
function isItemInCart(objectItem) {
	if (cartArray.find(cartItem => cartItem.id == objectItem.id)) {
		return true;
	}
	return false;
}

// UPDATE THE COUNT IN CART AND MENU
function updateCount(itemToUpdate) {
	// MENU cartArray[i]
	let countContentArray = document.querySelectorAll(".menu__item-amount-count");
	countContentArray.forEach((countItem, i) => {
		if (countItem.parentNode.getAttribute("data-content_id") == itemToUpdate.id) {
			if (itemToUpdate.count < 10) {
				countItem.textContent = "0" + itemToUpdate.count;
			} else {
				countItem.textContent = itemToUpdate.count;
			}
		}
	});
	// CART
	let countCartArray = document.querySelectorAll(".cart__item-amount-count");
	countCartArray.forEach((countItem, i) => {
		if (countItem.parentNode.getAttribute("data-content_id") == itemToUpdate.id) {
			if (itemToUpdate.count < 10) {
				countItem.textContent = "0" + itemToUpdate.count;
			} else {
				countItem.textContent = itemToUpdate.count;
			}

		}
	});
}
//////////////////////////////////////////////
// REMOVE ITEM FROM ARRAY CART IN CASE 0
function removeFromCartArray(objectItem) {
	let indexItem = cartArray.indexOf(objectItem);
	cartArray.splice(indexItem, 1);
}

// REMOVE ITEM FROM HTML CART IN CASE 0
function removeFromCart(objectItem) {
	let element = document.querySelector(`.cart__item[data-content_id="${objectItem.id}"]`);
	element.remove();
}

//////////////////////////////////////////////

// PRINT HTML ITEM IN CART
function printItemCart(dataToPrint) {
	let cartItem = document.createElement("div");
	cartItem.className = "cart__item";
	cartItem.setAttribute("data-content_id", `${dataToPrint.id}`);
	cartItem.innerHTML = `
		<div class="cart__item-img-container">
			<img class="cart__item-img" src="${dataToPrint.imgSrc}" alt="">
		</div>
		<div class="cart__item-text">
			<h3 class="cart__item-price">${dataToPrint.price + ".00"}</h3>
			<h3 class="cart__item-title">${dataToPrint.title}</h3>
			<p class="cart__item-desc">${dataToPrint.description}</p>
			<div class="cart__item-amount" data-content_id='${dataToPrint.id}'>
				<div class="cart__item-amount-minus">
					<h3>-</h3>
				</div>
				<h3 class="cart__item-amount-count">${"0" + dataToPrint.count}</h3>
				<div class="cart__item-amount-plus">
					<h3>+</h3>
				</div>
			</div>
		</div>
		`;
	cart.appendChild(cartItem);
	let plusButtonCart = cartItem.querySelector(".cart__item-amount-plus");
	let minusButtonCart = cartItem.querySelector(".cart__item-amount-minus");
	plusButtonCart.addEventListener("click", function() { // EVENT LISTENER TO INTERACT WITH + BUTTONS
		addItem(this);
	});
	minusButtonCart.addEventListener("click", function() { // EVENT LISTENER TO INTERACT WITH - BUTTONS
		removeItem(this);
	});
}

//////////////////////////////////////
//////////////////////////////////////
///////////////// PRICE///////////////
function getPrice(objectItem, identifierAdd, identifierClear) {
	let subtotalPrice = getSubtotalPrice(objectItem, identifierAdd, identifierClear);
	let taxFeesPrice = getTaxFeesPrice(subtotalPrice);
	let deliveryPrice = getDeliveryPrice(subtotalPrice);
	getTotalPrice(subtotalPrice, taxFeesPrice, deliveryPrice);
}

// SUBTOTAL GET
function getSubtotalPrice(item, identifierAdd, identifierClear) {

	if (identifierAdd && subtotalPrice >= 0) {
		subtotalPrice += item.price;
	} else if ((!identifierAdd) && subtotalPrice > 0 && !(identifierClear)) {
		subtotalPrice -= item.price;
	} else if (identifierClear) {
		subtotalPrice -= item.price * item.count;
	}
	printSubtotalPrice(subtotalPrice);
	return subtotalPrice;
}

// SUBTOTAL PRINT
function printSubtotalPrice(subtotalPrice) {
	let subtotalPriceDOM = document.querySelector(".summary__subtotal__price");
	switch (subtotalPrice.toString().split("").length) {
		case 1:
			subtotalPriceDOM.textContent = "0" + subtotalPrice + ".00";
			break;
		case 2:
			subtotalPriceDOM.textContent = subtotalPrice + ".00";
			break;
		case 3:
		case 4:
			subtotalPriceDOM.textContent = subtotalPrice + ".00";
			break;
		default:
	}
}


// TAX FEES GET
function getTaxFeesPrice(subtotalPrice, identifier) {
	let taxFeesPrice = Math.round(((subtotalPrice / 100) * 15) * 100) / 100;
	printTaxFeesPrice(taxFeesPrice);
	return taxFeesPrice;
}
// TAX FEES PRINT
function printTaxFeesPrice(taxFeesPrice) {
	let taxFeesPriceDOM = document.querySelector(".summary__tax-fees__price");
	taxFeesPriceDOM.textContent = taxFeesPrice;
}


// DELIVERY GET
function getDeliveryPrice(subtotalPrice, identifier) {
	let deliveryPrice;
	if (subtotalPrice === 0) {
		deliveryPrice = 0;
	} else if (subtotalPrice < 50) {
		deliveryPrice = 5;
	} else {
		deliveryPrice = 0;
	}
	printDeliveryPrice(deliveryPrice);
	return deliveryPrice;
}
// DELIVERY PRINT
function printDeliveryPrice(deliveryPrice) {
	let deliveryPriceDOM = document.querySelector(".summary__delivery__price");
	if (deliveryPrice == 0) {
		deliveryPriceDOM.textContent = "Free";
	} else if (deliveryPrice < 50) {
		deliveryPriceDOM.textContent = deliveryPrice;
	}
}

// TOTAL PRICE GET
function getTotalPrice(subtotalPrice, taxFeesPrice, deliveryPrice) {
	let totalPrice = subtotalPrice + taxFeesPrice + deliveryPrice;
	printTotalPrice(totalPrice);
}
// TOTAL PRICE PRINT
function printTotalPrice(totalPrice) {
	let totalPriceDOM = document.querySelector(".summary__total__price");
	totalPriceDOM.textContent = totalPrice;
}

///////////////// CLEAR CART /////////////////

function clearCart() {
	let lengthCartArray = cartArray.length;
	for (var i = 0; i < lengthCartArray; i++) {
		removeFromCart(cartArray[i]);
		getPrice(cartArray[i], false, true);
		cartArray[i].count = 0;
		updateCount(cartArray[i]);
	}
	cartArray = [];
}

/////////////// SEND ARRAY CART //////////////
let cartString = "Articulos: ";

window.constructorString = function() {
	let cartItemTitles = getCartData(cartArray, "title");
	let cartItemCount = getCartData(cartArray, "count");
	let price = document.querySelector(".summary__total__price").textContent;
	let name = document.querySelector(".ask-name__input").value;

	for (var i = 0; i < cartItemTitles.length; i++) {
		if (i == (cartItemTitles.length - 1)) {
			cartString += `${cartItemCount[i]} x ${cartItemTitles[i]}. Total price : $${price}.`
		} else {
			cartString += `${cartItemCount[i]} x ${cartItemTitles[i]}, `
		}
	}
	cartString += ` Name: ${name}`
}

function getCartData(array, data) {
	let cartItemData = []
	for (var i = 0; i < cartArray.length; i++) {
		cartItemData.push(eval(`cartArray[i].${data}`));
	}
	return cartItemData;
}

window.openWindowWhatsapp = function() {
	window.open(`https://wa.me/34642021401?text=${cartString}`);
}



///////////////// CATEGORIZE /////////////////

window.printCategory = function(category) {
	let categoryName = category.getAttribute(`data-category`);
	let categoryItemsArray = getCategoryItems(categoryName);
	let categoryActivated = category.getAttribute(`data-activated`);
	resetActivatedCategory();
	if (categoryActivated == "inactive") {

		clearPage(menu);
		categoryItemsArray.forEach((categoryItem, i) => {
			let itemHTML = printData(categoryItem, menu);
			trigerCount(itemHTML);
			prepareToOpenPopUp(itemHTML);
		});
		setInColor(categoryActivated, category)
		category.setAttribute(`data-activated`, "active");
	} else if (categoryActivated == "active") {
		clearPage(menu);
		contentArray.forEach((contentItem, i) => {
			let itemHTML = printData(contentItem, menu);
			trigerCount(itemHTML);
			prepareToOpenPopUp(itemHTML)
		});
		setInColor(categoryActivated, category)
		category.setAttribute(`data-activated`, "inactive");
	}
}

function resetActivatedCategory() {
	document.querySelectorAll(".clasification__item").forEach((item, i) => {
		item.setAttribute(`data-activated`, "inactive");
		item.style.backgroundColor = "rgb(255, 255, 255)";
	});
}

function setInColor(activation, category) {
	if (activation == "inactive") {
		category.style.backgroundColor = "#f6ac9d";
	}
}

function getCategoryItems(categoryName) {
	let categoryArray;
	for (var i = 0; i < contentArray.length; i++) {
		categoryArray = contentArray.filter(contentItem => contentItem.type[i] == categoryName); // FILTER IN CONTENT ONLY THE ONES THAT HAS THE SAME TYPE AS SELECTED CATEGORY
		if (categoryArray.length > 0) { // IF THE RESULTED ARRAY HAS ANY ELEMENT
			return categoryArray;
		}
	}
}

function clearPage(page) {
	let pageContent = Array.from(page.childNodes);
	pageContent.forEach((item, i) => {
		item.remove()
	});
}





// function startCategorization() {
// 	let categories = Array.from(document.querySelectorAll(".clasification__item"));
// 	let categoryTurnedOn = false;
//
// 	categories.forEach((item, i) => {
// 		let categoryName = item.getAttribute(`data-category`); //GET ALL CATEGORIES PRESENT ON HTML
// 		let categoryButton = document.querySelector(`[data-category="${categoryName}"]`) //GET ALL HTML BUTTONS FOR CATEGORIES
//
// 		categoryButton.addEventListener("click", function() {
// 			let categoryArray = getItemsCategory(categoryName, categories); //GET AN ARRAY WITH ALL THE ITEMS PERTENECIENTES TO THE CATEGORY
//
// 			if (categoryTurnedOn) { // TOGGLE THE CATEGORY BUTTON
// 				categoryTurnedOn = false;
// 				changeColorCategoryButton(categoryTurnedOn, categoryButton); // TOGGLE THE CATEGORY BUTTON COLOR
// 				showAllItems(categoryArray, categoryName); // SHOW ALL THE ITEMS
// 			} else {
// 				categoryTurnedOn = true;
// 				changeColorCategoryButton(categoryTurnedOn, categoryButton);
// 				hideAlienItems(categoryArray, categoryName);
// 			}
// 		});
// 	});
// }
//
// function getItemsCategory(categoryName, categories) {
// 	let categoryArray; // CREATE VARIABLE FOR THE ARRAY
// 	for (let i = 0; i < categories.length; i++) { // LOOP THROUGH ALL THE CATEGORIES ON EACH ITEM(i)
// 		categoryArray = contentArray.filter(contentItem => contentItem.type[i] == categoryName); // FILTER IN CONTENT ONLY THE ONES THAT HAS THE SAME TYPE AS SELECTED CATEGORY
// 		if (categoryArray.length > 0) { // IF THE REOULTED ARRAY HAS ANY ELEMENT
// 			return categoryArray;
// 		}
// 	}
// }
//
// function hideAlienItems(categoryArray, categoryName) {
// 	let itemsHTML = Array.from(document.querySelectorAll(`.menu__item`)); // FIND ALL HTML DISHES
// 	let alienItems = []; // CREATE VARIABLE FOR THE ARRAY OF NON SELECTED DISHES
// 	itemsHTML.forEach((itemHTML, i) => { // LOOP THROUGH ALL DISHES IN EXISTANCE
// 		itemHTML.style.display = "none"; // HIDE ALL OF THEM
// 		for (let i = 0; i < categoryArray.length; i++) { // LOOP THOUGHT ALL SELECTED ITEMS
// 			if (itemHTML.getAttribute("data-content_id") == categoryArray[i].id) { // CHECK EACH HTML ITEM, IF IT HAS THE SANE ID AS THE SELECTED ONES
// 				itemHTML.style.display = "flex"; // IF IT HAS --> MAKE IT APPEAR
// 			}
// 		}
// 	});
// }
//
// function showAllItems() {
// 	let itemsHTML = Array.from(document.querySelectorAll(`.menu__item`)); // FIND ALL HTML DISHES
// 	itemsHTML.forEach((itemHTML, i) => { // SHOW THEM ALL
// 		itemHTML.style.display = "flex";
// 	});
// }
//
// function changeColorCategoryButton(categoryTurnedOn, categoryButton) {
// 	if (categoryTurnedOn) { // IF THE CATEGORY IS SELECTED
// 		categoryButton.style.backgroundColor = "grey"; // COLOR --> GREY
// 	} else { // IF NOT
// 		categoryButton.style.backgroundColor = "white"; // COLOR --> WHITE
// 	}
// }









start();