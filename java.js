const products=[
  {id:1,name:"Classic White Tee",price:15,oldPrice:22,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",category:"apparel",desc:"A timeless wardrobe staple. Soft combed cotton, relaxed fit, suitable for any occasion.",badge:""},
  {id:2,name:"Moto Jacket",price:89,oldPrice:120,image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",category:"apparel",desc:"Premium faux leather moto jacket with asymmetric zipper. A statement layer for any season.",badge:"Best Seller"},
  {id:3,name:"Runner Sneakers",price:65,oldPrice:90,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",category:"shoes",desc:"Lightweight performance sneakers with responsive cushioning. From the gym to the streets.",badge:"New"},
  {id:4,name:"Floral Midi Dress",price:44,oldPrice:60,image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",category:"apparel",desc:"Effortless summer dress in airy fabric. Floral print, adjustable straps, midi length.",badge:""},
  {id:5,name:"Brimmed Cap",price:18,oldPrice:25,image:"https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600",category:"accessories",desc:"Adjustable structured cap in washed canvas. One size fits all.",badge:""},
  {id:6,name:"Canvas Backpack",price:38,oldPrice:55,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",category:"accessories",desc:"Durable canvas backpack with laptop sleeve, multiple pockets, and padded straps.",badge:"Sale"},
  {id:7,name:"Chronograph Watch",price:95,oldPrice:140,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",category:"accessories",desc:"Minimalist chronograph with stainless case, sapphire crystal glass, and genuine leather strap.",badge:""},
  {id:8,name:"Oversize Hoodie",price:42,oldPrice:58,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",category:"apparel",desc:"Ultra-soft French terry hoodie. Relaxed oversize fit with ribbed cuffs and hem.",badge:""},
  {id:9,name:"Aviator Sunglasses",price:28,oldPrice:40,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",category:"accessories",desc:"Classic metal aviator frames with UV400 polarized lenses. Timeless and durable.",badge:""},
  {id:10,name:"Pebbled Leather Tote",price:75,oldPrice:105,image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",category:"accessories",desc:"Full-grain pebbled leather tote with interior pockets, zip top, and gold hardware.",badge:"Limited"},
  {id:11,name:"Slim Chinos",price:48,oldPrice:68,image:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",category:"apparel",desc:"Clean-cut chinos in stretch cotton twill. Slim through the hip and thigh, tapered leg.",badge:""},
  {id:12,name:"Chelsea Boots",price:110,oldPrice:150,image:"https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600",category:"shoes",desc:"Classic Chelsea boots in full-grain leather with elastic side panels and stacked heel.",badge:""},
];

let cart=JSON.parse(localStorage.getItem('bunnit-cart'))||[];
let wishlist=JSON.parse(localStorage.getItem('bunnit-wishlist'))||[];
let currentFilter='all';
let currentPage='home';
let modalProduct=null;

function saveCart(){localStorage.setItem('bunnit-cart',JSON.stringify(cart));}
function saveWishlist(){localStorage.setItem('bunnit-wishlist',JSON.stringify(wishlist));}

function updateCartBadge(){
  const total=cart.reduce((s,i)=>s+i.qty,0);
  const badge=document.getElementById('cartBadge');
  badge.textContent=total;
  badge.style.display=total>0?'flex':'none';
}

function navigate(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const links=document.querySelectorAll('.nav-link');
  links.forEach(l=>{if(l.textContent.toLowerCase().includes(page)||
    (page==='home'&&l.textContent==='Home')||
    (page==='shop'&&l.textContent==='Shop')||
    (page==='cart'&&l.textContent.includes('Cart'))||
    (page==='wishlist'&&l.textContent==='Wishlist')||
    (page==='login'&&l.textContent==='Login'))l.classList.add('active');});
  currentPage=page;
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='home')renderHome();
  if(page==='shop')renderShop();
  if(page==='cart')renderCart();
  if(page==='wishlist')renderWishlist();
}

function productCard(p,showWishBtn=true){
  const inWish=wishlist.includes(p.id);
  return `
  <div class="product-card" onclick="openModal(${p.id})">
    <div class="product-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      ${p.badge?`<div class="product-badge">${p.badge}</div>`:''}
      ${showWishBtn?`<button class="product-wishlist-btn ${inWish?'wishlisted':''}" onclick="toggleWishlist(event,${p.id})">${inWish?'♥':'♡'}</button>`:''}
    </div>
    <div class="product-info">
      <div class="product-category">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="product-pricing">
        <div class="price">$${p.price}</div>
        ${p.oldPrice?`<div class="price-old">$${p.oldPrice}</div>`:''}
      </div>
      <button class="add-to-cart" onclick="addToCart(event,${p.id})">Add to Cart</button>
    </div>
  </div>`;
}

function renderHome(){
  const filtered=currentFilter==='all'?products:products.filter(p=>p.category===currentFilter);
  const show=filtered.slice(0,8);
  document.getElementById('homeProducts').innerHTML=show.map(p=>productCard(p)).join('');
  document.querySelectorAll('#homeFilters .filter-btn').forEach(b=>{
    b.onclick=()=>{
      currentFilter=b.dataset.filter;
      document.querySelectorAll('#homeFilters .filter-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderHome();
    };
  });
}

let shopFilter='all';
function renderShop(search=''){
  let list=products;
  if(shopFilter!=='all')list=list.filter(p=>p.category===shopFilter);
  if(search)list=list.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.category.toLowerCase().includes(search.toLowerCase()));
  document.getElementById('shopProducts').innerHTML=list.length?list.map(p=>productCard(p)).join(''):`<div class="no-results">No products found for "<strong>${search}</strong>"</div>`;
  document.getElementById('shopCount').textContent=list.length+' products';
  document.querySelectorAll('#shopFilters .filter-btn').forEach(b=>{
    b.onclick=()=>{
      shopFilter=b.dataset.filter;
      document.querySelectorAll('#shopFilters .filter-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      renderShop(document.getElementById('searchInput').value);
    };
  });
}

document.getElementById('searchInput').addEventListener('input',e=>renderShop(e.target.value));

function renderCart(){
  const list=document.getElementById('cartItemsList');
  const summary=document.getElementById('cartSummary');
  if(!cart.length){
    list.innerHTML=`<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty.</p><button class="btn-primary" style="margin-top:20px;" onclick="navigate('shop')">Start Shopping</button></div>`;
    summary.style.display='none';return;
  }
  summary.style.display='block';
  list.innerHTML=`<div class="cart-items-list">`+cart.map((item,i)=>`
  <div class="cart-item">
    <img src="${item.image}" alt="${item.name}">
    <div class="cart-item-info">
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">$${item.price}</div>
      <div class="cart-item-actions">
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${i},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${i})" title="Remove">🗑</button>
      </div>
    </div>
  </div>`).join('')+'</div>';
  const sub=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const tax=sub*.1;
  document.getElementById('summarySubtotal').textContent='$'+sub.toFixed(2);
  document.getElementById('summaryTax').textContent='$'+tax.toFixed(2);
  document.getElementById('summaryTotal').textContent='$'+(sub+tax).toFixed(2);
}

function changeQty(index,delta){
  cart[index].qty=Math.max(1,cart[index].qty+delta);
  saveCart();updateCartBadge();renderCart();
}
function removeFromCart(index){
  cart.splice(index,1);saveCart();updateCartBadge();renderCart();
  showToast('🗑 Item removed');
}

function renderWishlist(){
  if(!wishlist.length){
    document.getElementById('wishlistProducts').innerHTML=`<div class="wishlist-empty" style="grid-column:1/-1;text-align:center;padding:60px 0;"><div style="font-size:56px;margin-bottom:16px;">♡</div><p>Your wishlist is empty.</p><button class="btn-primary" style="margin-top:20px;" onclick="navigate('shop')">Discover Products</button></div>`;
    return;
  }
  const wishlisted=products.filter(p=>wishlist.includes(p.id));
  document.getElementById('wishlistProducts').innerHTML=wishlisted.map(p=>productCard(p)).join('');
}

function addToCart(e,id){
  e&&e.stopPropagation();
  const p=products.find(x=>x.id===id);
  const existing=cart.find(x=>x.id===id);
  if(existing)existing.qty++;
  else cart.push({...p,qty:1});
  saveCart();updateCartBadge();
  showToast('🛒 '+p.name+' added to cart!');
}

function toggleWishlist(e,id){
  e&&e.stopPropagation();
  const idx=wishlist.indexOf(id);
  if(idx>-1){wishlist.splice(idx,1);showToast('Removed from wishlist');}
  else{wishlist.push(id);showToast('Added to wishlist!');}
  saveWishlist();
  if(currentPage==='home')renderHome();
  else if(currentPage==='shop')renderShop(document.getElementById('searchInput').value);
  else if(currentPage==='wishlist')renderWishlist();
}

function openModal(id){
  const p=products.find(x=>x.id===id);
  modalProduct=p;
  document.getElementById('modalImg').src=p.image;
  document.getElementById('modalCat').textContent=p.category;
  document.getElementById('modalName').textContent=p.name;
  document.getElementById('modalPrice').textContent='$'+p.price;
  document.getElementById('modalOld').textContent=p.oldPrice?'$'+p.oldPrice:'';
  document.getElementById('modalDesc').textContent=p.desc;
  const inWish=wishlist.includes(p.id);
  const wb=document.getElementById('modalWishBtn');
  wb.textContent=inWish?'♥':'♡';
  wb.style.color=inWish?'var(--accent)':'';
  document.getElementById('modalCartBtn').onclick=()=>{addToCart(null,p.id);};
  wb.onclick=()=>{toggleWishlist(null,p.id);const i2=wishlist.includes(p.id);wb.textContent=i2?'♥':'♡';wb.style.color=i2?'var(--accent)':'';};
  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(e){
  if(e&&e.target!==document.getElementById('productModal')&&!e.target.classList.contains('modal-close'))return;
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow='';
}

let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  const m=document.getElementById('toastMsg');
  m.textContent=msg.replace(/^[^\w\s]*\s/,'');
  document.getElementById('toastIcon').textContent=msg.match(/^[^\w\s]+/)?.[0]||'';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

const darkBtn=document.getElementById('darkToggle');
if(localStorage.getItem('bunnit-theme')==='dark'){
  document.body.classList.add('dark');darkBtn.textContent='☀️';}
darkBtn.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  const dark=document.body.classList.contains('dark');
  localStorage.setItem('bunnit-theme',dark?'dark':'light');
  darkBtn.textContent=dark?'☀️':'🌙';
});

function openMobileNav(){document.getElementById('mobileNav').classList.add('open');}
function closeMobileNav(){document.getElementById('mobileNav').classList.remove('open');}

function openQR(){
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const tax=total*.1;
  const grand=(total+tax).toFixed(2);
  document.getElementById('qrAmount').textContent='$'+grand;
  // Generate QR via QR Server API — encodes payment info
  const payload=encodeURIComponent('BunnitStore|ABA|000123456789|USD|'+grand);
  document.getElementById('qrCodeImg').src='https://api.qrserver.com/v1/create-qr-code/?size=188x188&margin=0&data='+payload;
  document.getElementById('qrOverlay').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeQR(){
  document.getElementById('qrOverlay').classList.remove('open');
  document.body.style.overflow='';
}
function closeQROutside(e){
  if(e.target===document.getElementById('qrOverlay'))closeQR();
}
function confirmPayment(){
  closeQR();
  cart=[];saveCart();updateCartBadge();renderCart();
  showToast('Payment confirmed! Order on its way.');
}

updateCartBadge();
renderHome();