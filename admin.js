/* ─── DEFAULT SEED DATA (mirrors the storefront's starting catalog) ─── */
const defaultProducts=[
  {id:1,name:"Classic White Tee",price:15,oldPrice:22,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",category:"apparel",desc:"A timeless wardrobe staple. Soft combed cotton, relaxed fit, suitable for any occasion.",badge:"",stock:24},
  {id:2,name:"Moto Jacket",price:89,oldPrice:120,image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",category:"apparel",desc:"Premium faux leather moto jacket with asymmetric zipper. A statement layer for any season.",badge:"Best Seller",stock:12},
  {id:3,name:"Runner Sneakers",price:65,oldPrice:90,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",category:"shoes",desc:"Lightweight performance sneakers with responsive cushioning. From the gym to the streets.",badge:"New",stock:18},
  {id:4,name:"Floral Midi Dress",price:44,oldPrice:60,image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600",category:"apparel",desc:"Effortless summer dress in airy fabric. Floral print, adjustable straps, midi length.",badge:"",stock:9},
  {id:5,name:"Brimmed Cap",price:18,oldPrice:25,image:"https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600",category:"accessories",desc:"Adjustable structured cap in washed canvas. One size fits all.",badge:"",stock:30},
  {id:6,name:"Canvas Backpack",price:38,oldPrice:55,image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",category:"accessories",desc:"Durable canvas backpack with laptop sleeve, multiple pockets, and padded straps.",badge:"Sale",stock:0},
  {id:7,name:"Chronograph Watch",price:95,oldPrice:140,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",category:"accessories",desc:"Minimalist chronograph with stainless case, sapphire crystal glass, and genuine leather strap.",badge:"",stock:7},
  {id:8,name:"Oversize Hoodie",price:42,oldPrice:58,image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",category:"apparel",desc:"Ultra-soft French terry hoodie. Relaxed oversize fit with ribbed cuffs and hem.",badge:"",stock:20},
  {id:9,name:"Aviator Sunglasses",price:28,oldPrice:40,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",category:"accessories",desc:"Classic metal aviator frames with UV400 polarized lenses. Timeless and durable.",badge:"",stock:15},
  {id:10,name:"Pebbled Leather Tote",price:75,oldPrice:105,image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",category:"accessories",desc:"Full-grain pebbled leather tote with interior pockets, zip top, and gold hardware.",badge:"Limited",stock:0},
  {id:11,name:"Slim Chinos",price:48,oldPrice:68,image:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",category:"apparel",desc:"Clean-cut chinos in stretch cotton twill. Slim through the hip and thigh, tapered leg.",badge:"",stock:16},
  {id:12,name:"Chelsea Boots",price:110,oldPrice:150,image:"https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600",category:"shoes",desc:"Classic Chelsea boots in full-grain leather with elastic side panels and stacked heel.",badge:"",stock:5},
];

const ADMIN_USER='admin', ADMIN_PASS='admin123';
const PRODUCTS_KEY='bunnit-products';
const ORDERS_KEY='bnshop-orders';

/* ─── DATA HELPERS (shared localStorage with the storefront) ─── */
function loadProducts(){
  let list=JSON.parse(localStorage.getItem(PRODUCTS_KEY));
  if(!list){list=defaultProducts;localStorage.setItem(PRODUCTS_KEY,JSON.stringify(list));}
  return list;
}
function saveProducts(list){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(list));}
function loadOrders(){return JSON.parse(localStorage.getItem(ORDERS_KEY))||[];}
function saveOrders(list){localStorage.setItem(ORDERS_KEY,JSON.stringify(list));}

/* ─── AUTH ─── */
function checkAuth(){
  if(sessionStorage.getItem('bnshop-admin-auth')==='true'){
    document.getElementById('adminLogin').style.display='none';
    document.getElementById('adminShell').classList.add('active');
    renderAll();
  }else{
    document.getElementById('adminLogin').style.display='flex';
    document.getElementById('adminShell').classList.remove('active');
  }
}
document.getElementById('adminLoginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const u=document.getElementById('loginUser').value.trim();
  const p=document.getElementById('loginPass').value;
  const err=document.getElementById('loginError');
  if(u===ADMIN_USER&&p===ADMIN_PASS){
    sessionStorage.setItem('bnshop-admin-auth','true');
    err.textContent='';
    checkAuth();
  }else{
    err.textContent='Incorrect username or password.';
  }
});
function adminLogout(){
  sessionStorage.removeItem('bnshop-admin-auth');
  document.getElementById('loginUser').value='';
  document.getElementById('loginPass').value='';
  checkAuth();
}

/* ─── VIEW ROUTING ─── */
function showView(view){
  document.querySelectorAll('.admin-view').forEach(v=>v.classList.remove('active'));
  document.querySelectorAll('.admin-nav-link').forEach(l=>l.classList.remove('active'));
  document.getElementById('view-'+view).classList.add('active');
  document.querySelector(`.admin-nav-link[data-view="${view}"]`).classList.add('active');
  renderAll();
}

function renderAll(){
  renderDashboard();
  renderProducts();
  renderOrders();
}

/* ─── DASHBOARD ─── */
function renderDashboard(){
  const products=loadProducts();
  const orders=loadOrders();
  document.getElementById('statProducts').textContent=products.length;
  document.getElementById('statNewOrders').textContent=orders.filter(o=>o.status==='Pending').length;
  const uniqueCustomers=new Set(orders.map(o=>o.phone||o.customerName));
  document.getElementById('statCustomers').textContent=uniqueCustomers.size;
  const revenue=orders.reduce((s,o)=>s+o.total,0);
  document.getElementById('statRevenue').textContent='$'+revenue.toFixed(2);
  document.getElementById('statOutOfStock').textContent=products.filter(p=>p.stock<=0).length;

  const recent=[...orders].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  document.getElementById('recentOrdersBody').innerHTML=recent.length?recent.map(o=>`
    <tr>
      <td>#${o.id}</td>
      <td>${escapeHtml(o.customerName)}</td>
      <td>${formatDate(o.date)}</td>
      <td>$${o.total.toFixed(2)}</td>
      <td><span class="badge ${o.status==='Completed'?'completed':'pending'}">${o.status}</span></td>
    </tr>`).join(''):`<tr><td colspan="5" style="text-align:center;color:var(--text-light);padding:24px;">No orders yet.</td></tr>`;
}

/* ─── PRODUCTS ─── */
function renderProducts(){
  const search=(document.getElementById('productSearch').value||'').toLowerCase();
  const cat=document.getElementById('productCategoryFilter').value;
  let list=loadProducts();
  if(cat!=='all')list=list.filter(p=>p.category===cat);
  if(search)list=list.filter(p=>p.name.toLowerCase().includes(search));

  const body=document.getElementById('productsBody');
  document.getElementById('productsEmpty').style.display=list.length?'none':'block';
  body.innerHTML=list.map(p=>`
    <tr>
      <td><img class="table-thumb" src="${p.image}" alt=""></td>
      <td class="table-name">${escapeHtml(p.name)}</td>
      <td class="table-cat">${p.category}</td>
      <td>$${p.price.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td><span class="badge ${p.stock>0?'instock':'outofstock'}">${p.stock>0?'In Stock':'Out of Stock'}</span></td>
      <td>
        <div class="row-actions">
          <button class="row-btn" title="Edit" onclick="openProductForm(${p.id})">✎</button>
          <button class="row-btn danger" title="Delete" onclick="deleteProduct(${p.id})">🗑</button>
        </div>
      </td>
    </tr>`).join('');
}
document.getElementById('productSearch').addEventListener('input',renderProducts);
document.getElementById('productCategoryFilter').addEventListener('change',renderProducts);

function openProductForm(id){
  const form=document.getElementById('productForm');
  form.reset();
  if(id){
    const p=loadProducts().find(x=>x.id===id);
    document.getElementById('productFormTitle').textContent='Edit Product';
    document.getElementById('pf-id').value=p.id;
    document.getElementById('pf-name').value=p.name;
    document.getElementById('pf-category').value=p.category;
    document.getElementById('pf-price').value=p.price;
    document.getElementById('pf-oldprice').value=p.oldPrice||'';
    document.getElementById('pf-stock').value=p.stock;
    document.getElementById('pf-badge').value=p.badge||'';
    document.getElementById('pf-image').value=p.image;
    document.getElementById('pf-desc').value=p.desc;
  }else{
    document.getElementById('productFormTitle').textContent='Add Product';
    document.getElementById('pf-id').value='';
  }
  document.getElementById('productFormModal').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeProductForm(e){
  if(e&&e.target!==document.getElementById('productFormModal'))return;
  document.getElementById('productFormModal').classList.remove('open');
  document.body.style.overflow='';
}
document.getElementById('productForm').addEventListener('submit',e=>{
  e.preventDefault();
  const id=document.getElementById('pf-id').value;
  const list=loadProducts();
  const data={
    name:document.getElementById('pf-name').value.trim(),
    category:document.getElementById('pf-category').value,
    price:parseFloat(document.getElementById('pf-price').value)||0,
    oldPrice:parseFloat(document.getElementById('pf-oldprice').value)||0,
    stock:parseInt(document.getElementById('pf-stock').value)||0,
    badge:document.getElementById('pf-badge').value.trim(),
    image:document.getElementById('pf-image').value.trim(),
    desc:document.getElementById('pf-desc').value.trim(),
  };
  if(id){
    const idx=list.findIndex(p=>p.id===parseInt(id));
    list[idx]={...list[idx],...data};
    showToast('Product updated');
  }else{
    const newId=list.length?Math.max(...list.map(p=>p.id))+1:1;
    list.push({id:newId,...data});
    showToast('Product added');
  }
  saveProducts(list);
  closeProductForm();
  renderProducts();
  renderDashboard();
});
function deleteProduct(id){
  if(!confirm('Delete this product? This cannot be undone.'))return;
  saveProducts(loadProducts().filter(p=>p.id!==id));
  renderProducts();
  renderDashboard();
  showToast('Product deleted');
}

/* ─── ORDERS ─── */
function renderOrders(){
  const search=(document.getElementById('orderSearch').value||'').toLowerCase();
  const statusFilter=document.getElementById('orderStatusFilter').value;
  let list=loadOrders().sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(statusFilter!=='all')list=list.filter(o=>o.status===statusFilter);
  if(search)list=list.filter(o=>o.customerName.toLowerCase().includes(search)||String(o.id).includes(search));

  const body=document.getElementById('ordersBody');
  document.getElementById('ordersEmpty').style.display=list.length?'none':'block';
  body.innerHTML=list.map(o=>`
    <tr>
      <td>#${o.id}</td>
      <td>${escapeHtml(o.customerName)}</td>
      <td>${escapeHtml(o.phone)}</td>
      <td>${formatDate(o.date)}</td>
      <td>$${o.total.toFixed(2)}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatus(${o.id},this.value)">
          <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
          <option value="Completed" ${o.status==='Completed'?'selected':''}>Completed</option>
        </select>
      </td>
      <td>
        <div class="row-actions">
          <button class="row-btn" title="View address" onclick="showToast('${escapeHtml(o.address).replace(/'/g,"\\'")}')">📍</button>
        </div>
      </td>
    </tr>`).join('');
}
document.getElementById('orderSearch').addEventListener('input',renderOrders);
document.getElementById('orderStatusFilter').addEventListener('change',renderOrders);

function updateOrderStatus(id,status){
  const list=loadOrders();
  const idx=list.findIndex(o=>o.id===id);
  if(idx>-1){list[idx].status=status;saveOrders(list);}
  renderDashboard();
  renderOrders();
  showToast('Order #'+id+' marked '+status);
}

/* ─── UTIL ─── */
function escapeHtml(str){
  const d=document.createElement('div');
  d.textContent=str||'';
  return d.innerHTML;
}
function formatDate(iso){
  const d=new Date(iso);
  return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
}
let toastTimer;
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

checkAuth();