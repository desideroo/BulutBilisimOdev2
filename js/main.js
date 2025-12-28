// SEPETLE İLGİLİ KODLAR 
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

cartIcon.onclick = () =>{
    cart.classList.add("active");
};

closeCart.onclick = () =>{
    cart.classList.remove("active");
};

// SEPETİN DÜZGÜN ÇALIŞMASI
if (document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready)
}
else{
    ready();
}


function ready()
{
    //SEPETTEN ÜRÜN SİLME
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    console.log(removeCartButtons);
    for(var i = 0; i < removeCartButtons.length; i++)
    {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    // MİKTAR DEĞİŞTİRME
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for(var i = 0; i < quantityInputs.length; i++)
    {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    // SEPETE ÜRÜN EKLEME
    var addCart = document.getElementsByClassName("add-cart");
    for(var i = 0; i < addCart.length; i++)
    {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    //SATIN AL BUTONU
    document.getElementsByClassName("btn-buy")[0].addEventListener("click",buyButtonClicked);
}
// SATIN AL BUTONU FONKSİYON
function buyButtonClicked()
{
    alert("Siparişiniz Alındı.");
    var cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes())
    {
        cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
}

//SEPETTEN ÜRÜN SİLME FONKSİYON 
function removeCartItem(event)
{
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}
//MİKTAR DEĞİŞTİRME FONKSİYON
function quantityChanged(event)
{
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0)
    {
        input.value = 1;
    }
    updateTotal();
}
//SEPETE ÜRÜN EKLEME FONKSİYON
function addCartClicked(event)
{
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
    addProductToCart(title, price, productImg);
    updateTotal();
}
function addProductToCart(title, price, productImg)
{
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
   var cartItems = document.getElementsByClassName("cart-content")[0];
   var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
   for(var i = 0; i < cartItemsNames.length; i++)
   {
    if(cartItemsNames[i].innerText == title)
    {
        alert("Bu ürünü zaten sepete eklediniz.");
        return;
    }
   }

   //SEPET İÇERİĞİ KISMI
var cartBoxContent = `
<img src="${productImg}" alt="" class="cart-img">
<div class="detail-box">
    <div class="cart-product-title">${title}</div>
    <div class="cart-price">${price}</div>
    <input type = "number" value = "1" class ="cart-quantity">
</div>
<i class='bx bxs-trash-alt cart-remove' ></i>`;
cartShopBox.innerHTML = cartBoxContent;
cartItems.append(cartShopBox);
cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click", removeCartItem);
cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change", quantityChanged);
}

// TOPLAM FİYAT GÜNCELLEME FONKSİYONU
function updateTotal(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for(var i = 0; i < cartBoxes.length; i++)
    {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("TL", ""));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }

        document.getElementsByClassName("total-price")[0].innerText = total + "TL"; 
    }

    // ANLIK SAAT BİLGİSİ 

    const clock=document.querySelector('.clock');


    const tick = () =>{
    const now =new Date();
    const hours=now.getHours();
    const minutes=now.getMinutes();
    const seconds=now.getSeconds();


   const html =
   `
   <span>${hours}</span> :
   <span>${minutes}</span> :
   <span>${seconds}</span> 
   `
   clock.innerHTML=html;


};


setInterval(tick, 10);


// ÜRÜN FİLTRELEME İÇİN KODLAR 
    document.addEventListener('DOMContentLoaded', function() {
        var filterButtons = document.querySelectorAll('.filter-button-group button');
        var items = document.querySelectorAll('.product-box');
    
        function updateActiveClass(selectedButton) {
            filterButtons.forEach(button => {
                button.classList.remove('active-filter-btn');
            });
            selectedButton.classList.add('active-filter-btn');
        }
    
 
        function filterItems(filter) {
            items.forEach(item => {
                if (filter === '*' || item.classList.contains(filter)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    

        filterButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var filter = this.getAttribute('data-filter').replace('.', '');
                updateActiveClass(this);   
                filterItems(filter);
            });
        });
    });    