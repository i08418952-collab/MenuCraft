'use strict';
/* ================= Yordamchilar ================= */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9);
const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const setp=(o,p,v)=>{const ks=p.split('.'),l=ks.pop();ks.reduce((a,k)=>a[k],o)[l]=v};
const KEY='menucraft.v1';

const TEMPLATES=[
  {k:'modern',n:'Modern',t:{primary:'#2563eb',bg:'#ffffff',text:'#111827',font:'Poppins'}},
  {k:'minimal',n:'Minimal',t:{primary:'#111827',bg:'#fafafa',text:'#111827',font:'Inter'}},
  {k:'dark',n:'Dark Restaurant',t:{primary:'#f5a524',bg:'#141414',text:'#f4f4f5',font:'Montserrat'}},
  {k:'elegant',n:'Elegant',t:{primary:'#9f1239',bg:'#fffdf8',text:'#2b2024',font:'Playfair Display'}},
  {k:'fastfood',n:'Fast Food',t:{primary:'#dc2626',bg:'#fff7ed',text:'#1f2937',font:'Montserrat'}},
  {k:'coffee',n:'Coffee Shop',t:{primary:'#7c4a2d',bg:'#f5ede4',text:'#3a2a20',font:'Poppins'}},
  {k:'luxury',n:'Luxury',t:{primary:'#c9a24b',bg:'#0f0f12',text:'#f1ece1',font:'Playfair Display'}},
  {k:'asian',n:'Asian Food',t:{primary:'#b91c1c',bg:'#fefaf3',text:'#1c1917',font:'Roboto'}},
  {k:'fresh',n:'Fresh',t:{primary:'#15803d',bg:'#f6fbf4',text:'#14301f',font:'Inter'}}
];
const FONTS=['Inter','Poppins','Montserrat','Roboto','Playfair Display'];
const TAGS=['','NEW','POPULAR','SPICY','VEGAN','SALE'];
const SIZES={A4:[210,297,14],A5:[148,210,10],Letter:[216,279,14]};
const STYLES=['classic','poster','bars','board'];
const CURS=['UZS','USD','EUR','RUB'];
const ICONS=[['🍕','Pitsa'],['🍝','Pasta'],['🍔','Burger'],['🌭','Fast food'],['🍟','Gazak / fri'],['🥗','Salat'],['🍲',"Sho'rva"],['🥩',"Go'sht / steyk"],['🍗','Tovuq'],['🍣','Sushi'],['🍜',"Lag'mon"],['🍚','Guruch / osh'],['🥟','Manti / somsa'],['🥖','Non'],['🍳','Nonushta'],['🍰','Desert'],['🍦','Muzqaymoq'],['🥤','Ichimliklar'],['☕','Kofe'],['🍵','Choy'],['🍹','Kokteyl'],['🍽','Boshqa']];
const ICON_RULES=[[/pits|pizz/,'🍕'],[/past|spag|makaron/,'🍝'],[/burg/,'🍔'],[/hot.?dog|fast/,'🌭'],[/kartosh|fri\b|snack|gazak/,'🍟'],[/salat|salad/,'🥗'],[/sho.?rva|soup|\bsup/,'🍲'],[/go.?sht|steyk|steak|kabob|shashlik|barbekyu/,'🥩'],[/tovuq|chicken/,'🍗'],[/sushi|roll/,'🍣'],[/lag.?mon|noodle|ramen/,'🍜'],[/plov|\bosh\b|guruch/,'🍚'],[/manti|somsa|samsa/,'🥟'],[/\bnon\b|bread|nonlar|bakery/,'🥖'],[/nonushta|breakfast/,'🍳'],[/desert|shirin|cake|tort|dessert/,'🍰'],[/muzqaymoq|ice.?cream/,'🍦'],[/kofe|coffee|kapuch|latte/,'☕'],[/choy|tea\b/,'🍵'],[/kokteyl|cocktail/,'🍹'],[/ichim|drink|sharbat|juice|limonad|beverage/,'🥤']];
function iconFor(c){
  if(c&&c.icon)return c.icon;
  const n=((c&&c.name)||'').toLowerCase();
  for(const [re,e] of ICON_RULES)if(re.test(n))return e;
  return '🍽';
}

/* ---- Xavfsizlik: kiruvchi ma'lumotlarni (saqlangan, import, havola) tozalash ---- */
const HEX=/^#[0-9a-f]{6}$/i;
const okHex=(v,d)=>typeof v==='string'&&HEX.test(v)?v:d;
const pick=(v,list,d)=>list.includes(v)?v:d;
const okImg=v=>typeof v==='string'&&v.length<700000&&/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+\/=]+$/i.test(v)?v:'';
const cleanId=v=>String(v==null?'':v).replace(/[^a-z0-9]/gi,'').slice(0,12)||uid();
const str=(v,n)=>typeof v==='string'?v.slice(0,n):'';

function blank(){return{name:'',tagline:'',phone:'',address:'',instagram:'',telegram:'',currency:'UZS',logo:'',
  theme:{template:'modern',primary:'#2563eb',bg:'#ffffff',text:'#111827',font:'Poppins',layout:'list',shape:'rounded',style:'classic'},
  qr:{url:'',dark:'#12211d',light:'#ffffff',frame:'MENYUNI SKANERLANG'},
  pdf:{size:'A4',orient:'portrait',mode:'flow',images:true},categories:[]}}

function normalize(m){
  const b=blank();m=m&&typeof m==='object'?m:{};
  const th=m.theme&&typeof m.theme==='object'?m.theme:{},q=m.qr&&typeof m.qr==='object'?m.qr:{},pd=m.pdf&&typeof m.pdf==='object'?m.pdf:{};
  return{
    name:str(m.name,80),tagline:str(m.tagline,120),phone:str(m.phone,40),address:str(m.address,160),instagram:str(m.instagram,60),telegram:str(m.telegram,60),
    currency:pick(m.currency,CURS,'UZS'),logo:okImg(m.logo),
    theme:{template:str(th.template,20)||'modern',primary:okHex(th.primary,b.theme.primary),bg:okHex(th.bg,b.theme.bg),text:okHex(th.text,b.theme.text),
      font:pick(th.font,FONTS,'Poppins'),layout:pick(th.layout,['list','card','minimal'],'list'),shape:pick(th.shape,['rounded','sq','circle'],'rounded'),style:pick(th.style,STYLES,'classic')},
    qr:{url:str(q.url,500),dark:okHex(q.dark,b.qr.dark),light:okHex(q.light,b.qr.light),frame:typeof q.frame==='string'?q.frame.slice(0,40):b.qr.frame},
    pdf:{size:pick(pd.size,Object.keys(SIZES),'A4'),orient:pick(pd.orient,['portrait','landscape'],'portrait'),mode:pick(pd.mode,['flow','pages'],'flow'),images:pd.images!==false},
    categories:(Array.isArray(m.categories)?m.categories:[]).slice(0,50).filter(c=>c&&typeof c==='object').map(c=>({
      id:cleanId(c.id),name:str(c.name,60),description:str(c.description,160),icon:pick(c.icon,ICONS.map(x=>x[0]),''),
      products:(Array.isArray(c.products)?c.products:[]).slice(0,300).filter(p=>p&&typeof p==='object').map(p=>({
        id:cleanId(p.id),name:str(p.name,100),price:Math.max(0,Number(p.price)||0),description:str(p.description,240),tag:pick(p.tag,TAGS,''),available:p.available!==false,image:okImg(p.image)}))}))
  };
}
function sample(){
  const P=(name,price,description,tag)=>({id:uid(),name,price,description,tag:tag||'',available:true,image:''});
  return normalize({name:'Cafe Roma',tagline:'Italyan restorani',phone:'+998 90 123 45 67',address:"Toshkent, Amir Temur ko'chasi 12",instagram:'@cafe_roma',telegram:'@cafe_roma',currency:'UZS',
    categories:[
      {id:uid(),name:'Pitsa',icon:'🍕',description:'Yangi pishirilgan italyan pitsalari',products:[
        P('Margherita',55000,'Pomidor sousi, mozzarella, rayhon','POPULAR'),P('Pepperoni',68000,'Pepperoni, mozzarella, pomidor sousi','SPICY'),P("To'rt pishloqli",72000,'Mozzarella, parmezan, gorgonzola, cheddar','NEW')]},
      {id:uid(),name:'Pasta',icon:'🍝',description:'',products:[
        P('Karbonara',58000,"Spagetti, bekon, tuxum sarig'i, parmezan"),P('Bolonyeze',54000,"Go'shtli sous, spagetti, parmezan")]},
      {id:uid(),name:'Ichimliklar',icon:'🥤',description:'',products:[
        P('Cappuccino',24000,''),P('Limonad',18000,'Yangi limon, yalpiz','VEGAN'),P('Cola 0.5L',10000,'')]}
    ]});
}
const num=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n||0).replace(/,/g,' ');
function money(n,c){const s=num(n);return c==='USD'?'$'+s:c==='EUR'?'€'+s:c==='RUB'?s+' RUB':s+" so'm"}
const pr=(p,m)=>p.price>0?money(p.price,m.currency):'';
const visibleProducts=(c,pdf)=>c.products.filter(p=>p.name.trim()&&(!pdf||p.available));

/* ---- Ranglar ---- */
function hexToHsl(h){const r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H=0,S=0;const L=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn;S=L>.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;H*=60}
  return[H,S*100,L*100]}
function hslToHex(h,s,l){h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),
  f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1))),x=v=>Math.round(v*255).toString(16).padStart(2,'0');
  return '#'+x(f(0))+x(f(8))+x(f(4))}
function lum(h){const c=[1,3,5].map(i=>{const v=parseInt(h.slice(i,i+2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]}
const contrastRatio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const onColor=h=>lum(h)>.4?'#111111':'#ffffff';
function palette(p){
  const [h,s,l]=hexToHsl(p);
  if(s<12)return Array(6).fill(p);
  const S=Math.max(s,48),L=Math.min(Math.max(l,38),52);
  return[0,42,84,160,205,285].map((d,i)=>i===0?p:hslToHex(h+d,S,L));
}

/* ================= Holat ================= */
let state;
try{const raw=localStorage.getItem(KEY);state=raw?normalize(JSON.parse(raw)):sample()}catch(e){state=sample()}
let tab='biz',view='online',LINK='',FILTER={q:'',cat:'all'},linkTok=0;

let saveT;
function save(){
  clearTimeout(saveT);
  saveT=setTimeout(()=>{
    try{localStorage.setItem(KEY,JSON.stringify(state));setStatus('<b>✓</b> Brauzerda saqlandi')}
    catch(e){setStatus("Xotira to'ldi. Rasmlar sonini kamaytiring yoki zaxira nusxa oling")}
  },350);
}
function setStatus(h){$('#status').innerHTML=h}
let pvT;
function changed(){
  setStatus('Saqlanmoqda...');save();
  const st=$('#stats');if(st)st.innerHTML=statsHTML();
  cancelAnimationFrame(pvT);pvT=requestAnimationFrame(refreshPreview);
  clearTimeout(changed.lt);changed.lt=setTimeout(updateLink,250);
}

/* ================= QR ================= */
function qrOK(){return typeof window.qrcode==='function'}
function qrObj(text){const qr=window.qrcode(0,text.length>900?'L':'M');qr.addData(text,'Byte');qr.make();return qr}
function qrSVG(text,dark,light){
  const qr=qrObj(text),n=qr.getModuleCount(),m=4;let d='';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))d+=`M${c+m} ${r+m}h1v1h-1z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n+m*2} ${n+m*2}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="${light}"/><path d="${d}" fill="${dark}"/></svg>`;
}
function qrPNG(text,dark,light,px){
  const qr=qrObj(text),n=qr.getModuleCount(),m=4,cell=Math.max(1,Math.floor(px/(n+m*2)));
  const size=cell*(n+m*2),cv=document.createElement('canvas');cv.width=cv.height=size;
  const x=cv.getContext('2d');x.fillStyle=light;x.fillRect(0,0,size,size);x.fillStyle=dark;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(qr.isDark(r,c))x.fillRect((c+m)*cell,(r+m)*cell,cell,cell);
  return new Promise(res=>cv.toBlob(res,'image/png'));
}
function paintQR(root=document){
  $$('.qr-slot',root).forEach(el=>{
    if(!qrOK()){el.innerHTML=`<div class="qr-miss">${window.__qrFailed?'QR kutubxonasi yuklanmadi (internet kerak)':'QR yuklanmoqda...'}</div>`;return}
    if(!LINK){el.innerHTML='';return}
    try{el.innerHTML=qrSVG(LINK,state.qr.dark,state.qr.light)}
    catch(e){el.innerHTML='<div class="qr-miss" style="color:#b42318">Havola QR uchun juda uzun</div>'}
  });
}

/* ================= Havola (QR nimaga olib boradi) ================= */
const ascii=s=>s.replace(/[^\x00-\x7F]/g,c=>encodeURIComponent(c));
function cleanUrl(u){u=u.trim();if(!u)return '';if(!/^[a-z][a-z0-9+.-]*:\/\//i.test(u)&&!/^(mailto|tel):/i.test(u))u='https://'+u;try{return new URL(u).href}catch(e){return ascii(u)}}
const b64e=u=>{let s='';u.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')};
const b64d=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return Uint8Array.from(atob(s),c=>c.charCodeAt(0))};
async function pipe(u8,S,kind){const st=new Blob([u8]).stream().pipeThrough(new S(kind));return new Uint8Array(await new Response(st).arrayBuffer())}
async function encodeMenu(m){
  const slim=JSON.parse(JSON.stringify(m));
  delete slim.logo;delete slim.qr;delete slim.pdf;
  slim.categories.forEach(c=>{delete c.id;c.products.forEach(p=>{delete p.image;delete p.id})});
  const bytes=new TextEncoder().encode(JSON.stringify(slim));
  if(window.CompressionStream){try{return 'z'+b64e(await pipe(bytes,CompressionStream,'deflate-raw'))}catch(e){}}
  return 'j'+b64e(bytes);
}
async function decodeMenu(s){
  try{
    const k=s[0],u=b64d(s.slice(1));
    const bytes=k==='z'?await pipe(u,DecompressionStream,'deflate-raw'):u;
    return normalize(JSON.parse(new TextDecoder().decode(bytes)));
  }catch(e){return null}
}
async function updateLink(){
  const tok=++linkTok,custom=cleanUrl(state.qr.url);
  let link=custom;
  if(!custom)link=ascii(location.href.split('#')[0])+'#m='+await encodeMenu(state);
  if(tok!==linkTok)return;
  LINK=link;paintQR();paintLinkInfo();
}
function paintLinkInfo(){
  const el=$('#linkInfo');if(!el)return;
  const custom=state.qr.url.trim(),host=location.hostname;
  let h='';
  if(!qrOK()&&window.__qrFailed)h+='<div class="warn">QR kutubxonasi yuklanmadi. Internetni tekshirib, sahifani yangilang.</div>';
  if(!custom){
    if(location.protocol==='file:'||host==='localhost'||host==='127.0.0.1')
      h+='<div class="warn"><b>Muhim:</b> hozir fayl sizning kompyuteringizda ochilgan, shuning uchun QR telefonda ishlamaydi. <code>index.html</code> ni internetga joylang (masalan, Netlify Drop yoki GitHub Pages), keyin saytni shu manzilda qayta ochib QR ni yuklab oling. Yoki tayyor sayt havolasini yuqoridagi maydonga yozing.</div>';
    else h+='<div class="okmsg">QR menyuning o\'zini havola ichida saqlaydi. Menyuni o\'zgartirsangiz, QR ni qayta yuklab oling.</div>';
    if(LINK.length>1800)h+='<div class="warn">Havola juda uzun ('+LINK.length+' belgi), QR zich bo\'lib skanerlash qiyin bo\'lishi mumkin. Mahsulotlar sonini kamaytiring yoki saytingizga joylab, havolani maydonga yozing.</div>';
  }else h+='<div class="okmsg">QR siz kiritgan havolaga olib boradi. Menyuni o\'zgartirsangiz QR ni qayta chop etish shart emas.</div>';
  const d=state.qr.dark,l=state.qr.light;
  if(lum(d)>=lum(l))h+='<div class="warn">QR ranglari teskari (qoramtir fon, och naqsh). Ko\'p telefonlar buni o\'qiy olmaydi. Naqshni to\'q, fonni och qiling.</div>';
  else if(contrastRatio(d,l)<4)h+='<div class="warn">QR rangi va foni orasidagi farq kam, skanerlash qiyin bo\'lishi mumkin. Naqshni to\'qroq qiling.</div>';
  el.innerHTML=h;
}

/* ================= Menyu ko'rinishi ================= */
function themeStyle(t){return `--p:${t.primary};--bg:${t.bg};--tx:${t.text};--f:'${t.font}',system-ui,sans-serif`}
const badge=t=>t?`<span class="bd">${esc(t)}</span>`:'';
function showImg(p,m,o){return p.image&&(m.theme.style!=='classic'||m.theme.layout!=='minimal')&&(!o||!o.pdf||m.pdf.images)}

function itemHTML(p,m){
  const t=m.theme,off=p.available?'':' off',img=p.image&&t.layout!=='minimal';
  const d=p.description?`<div class="mi-d">${esc(p.description)}</div>`:'';
  const na=p.available?'':'<div class="mi-d">Hozir mavjud emas</div>';
  const price=pr(p,m);
  if(t.layout==='card'){
    return `<div class="mc${off}">${p.image?`<img src="${esc(p.image)}" alt="">`:`<div class="mc-ph">${esc((p.name||'?').trim().charAt(0).toUpperCase())}</div>`}<div class="mc-b"><div class="mi-n">${esc(p.name)}${badge(p.tag)}</div>${d}${na}<div class="mi-p">${price}</div></div></div>`;
  }
  return `<div class="mi${off}">${img?`<img class="mi-img ${t.shape}" src="${esc(p.image)}" alt="">`:''}<div class="mi-b"><div class="mi-n">${esc(p.name)}${badge(p.tag)}</div>${d}${na}</div><div class="mi-p">${price}</div></div>`;
}

function blockHTML(x,m,pal,o){
  const c=x.c,t=m.theme,st=t.style,items=x.items,col=pal[x.k%6],on=onColor(col),np=o.np?' np':'';
  const ic=esc(iconFor(c)),cd=c.description?esc(c.description):'';
  const nm=p=>`${esc(p.name)}${badge(p.tag)}`;
  const off=p=>p.available?'':' off';
  const na=(p,cls)=>p.available?'':`<div class="${cls}">Hozir mavjud emas</div>`;
  const im=(p,cls)=>showImg(p,m,o)?`<img class="${cls} ${t.shape}" src="${esc(p.image)}" alt="">`:'';
  if(st==='poster'){
    return `<section class="po-c${np}" style="--c:${col};--ct:${on}"><div class="po-h"><span class="po-ic">${ic}</span><div class="po-ht"><h2>${esc(c.name)}</h2>${cd?`<div class="po-cd">${cd}</div>`:''}</div><span class="po-no">${String(x.k+1).padStart(2,'0')}</span></div><div class="po-b">${items.map(p=>`<div class="po-i${off(p)}">${im(p,'po-im')}<div class="po-m"><div class="po-t"><span class="po-nm">${nm(p)}</span>${pr(p,m)?`<span class="po-pr">${pr(p,m)}</span>`:''}</div>${p.description?`<div class="po-d">${esc(p.description)}</div>`:''}${na(p,'po-d')}</div></div>`).join('')}</div></section>`;
  }
  if(st==='bars'){
    const max=Math.max(1,...x.all.map(p=>p.price));
    return `<section class="bs-c${np}" style="--c:${col}"><h2><span class="bs-ic" style="background:${col};color:${on}">${ic}</span>${esc(c.name)}</h2>${cd?`<div class="bs-cd">${cd}</div>`:''}${items.map(p=>`<div class="bs-i${off(p)}">${im(p,'bs-im')}<div class="bs-m"><div class="bs-t"><span class="bs-nm">${nm(p)}</span><span class="bs-pr">${pr(p,m)}</span></div>${p.price>0?`<div class="bs-bar"><i style="width:${Math.max(7,Math.round(p.price/max*100))}%"></i></div>`:''}${p.description?`<div class="bs-d">${esc(p.description)}</div>`:''}${na(p,'bs-d')}</div></div>`).join('')}</section>`;
  }
  if(st==='board'){
    return `<section class="bd-c${np}"><div class="bd-ic">${ic}</div><h2>${esc(c.name)}</h2>${cd?`<div class="bd-cd">${cd}</div>`:''}<div class="bd-l">${items.map(p=>`<div class="bd-i${off(p)}">${im(p,'bd-im')}<div class="bd-nm">${nm(p)}</div>${p.description?`<div class="bd-d">${esc(p.description)}</div>`:''}${na(p,'bd-d')}${pr(p,m)?`<div class="bd-pr">${pr(p,m)}</div>`:''}</div>`).join('')}</div></section>`;
  }
  return `<section class="mv-c"><h2>${esc(c.name)}</h2>${cd?`<div class="mv-cd">${cd}</div>`:''}${t.layout==='card'?`<div class="mg">${items.map(p=>itemHTML(p,m)).join('')}</div>`:items.map(p=>itemHTML(p,m)).join('')}</section>`;
}
function listHTML(m,o){
  o=o||{};
  const q=FILTER.q.trim().toLowerCase(),pal=palette(m.theme.primary);
  const vis=m.categories.map(c=>({c,all:visibleProducts(c,o.pdf)})).filter(x=>x.all.length).map((x,k)=>Object.assign(x,{k}));
  const shown=vis.filter(x=>o.pdf||FILTER.cat==='all'||x.c.id===FILTER.cat)
    .map(x=>Object.assign({},x,{items:(q&&!o.pdf)?x.all.filter(p=>(p.name+' '+p.description).toLowerCase().includes(q)):x.all})).filter(x=>x.items.length);
  if(!shown.length)return o.pdf?'':'<div class="mv-empty">Hech narsa topilmadi</div>';
  return shown.map((x,i)=>blockHTML(x,m,pal,{pdf:o.pdf,np:!!(o.pdf&&m.pdf.mode==='pages'&&i>0)})).join('');
}
function mountMenu(el,m,isViewer){
  const cats=m.categories.filter(c=>visibleProducts(c).length);
  if(!cats.some(c=>c.id===FILTER.cat))FILTER.cat='all';
  el.className='mv';el.style.cssText=themeStyle(m.theme);
  const contacts=[m.phone,m.address,m.instagram&&'Instagram: '+m.instagram,m.telegram&&'Telegram: '+m.telegram].filter(Boolean);
  el.innerHTML=`<div class="mv-hd">${m.logo?`<img class="mv-logo" src="${esc(m.logo)}" alt="">`:''}${isViewer?'<h1 class="mv-t">':'<div class="mv-t">'}${esc(m.name||'Menyu nomi')}${isViewer?'</h1>':'</div>'}${m.tagline?`<p>${esc(m.tagline)}</p>`:''}</div>
  <div class="mv-q"><input type="search" placeholder="Qidirish..." value="${esc(FILTER.q)}"></div>
  <div class="mv-ch"></div><div class="mv-list"></div>
  ${contacts.length?`<div class="mv-ct">${contacts.map(esc).join('<br>')}</div>`:''}<div class="mv-ft">MenuCraft bilan yaratilgan</div>`;
  const list=$('.mv-list',el),ch=$('.mv-ch',el);
  const paintChips=()=>{ch.innerHTML=`<button data-c="all" class="${FILTER.cat==='all'?'on':''}">Hammasi</button>`+cats.map(c=>`<button data-c="${esc(c.id)}" class="${FILTER.cat===c.id?'on':''}">${esc(c.name)}</button>`).join('')};
  paintChips();list.innerHTML=listHTML(m);
  $('input',el).addEventListener('input',e=>{FILTER.q=e.target.value;list.innerHTML=listHTML(m)});
  ch.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;FILTER.cat=b.dataset.c;paintChips();list.innerHTML=listHTML(m)});
}

/* ================= PDF maketi ================= */
function pageDims(){
  const [w,h,mg]=SIZES[state.pdf.size]||SIZES.A4;
  return state.pdf.orient==='landscape'?[h,w,mg]:[w,h,mg];
}
function pdfParts(m,ph){
  const contacts=[m.phone,m.address,m.instagram&&'Instagram: '+m.instagram,m.telegram&&'Telegram: '+m.telegram].filter(Boolean);
  const st=m.theme.style,vis=m.categories.filter(c=>visibleProducts(c,true).length);
  let body='';
  if(st==='classic'){
    body=vis.map((c,i)=>`<section class="pp-cat${m.pdf.mode==='pages'&&i>0?' np':''}"><h2>${esc(c.name)}</h2>${c.description?`<div class="pp-cd">${esc(c.description)}</div>`:''}${visibleProducts(c,true).map(p=>`<div class="pp-it">${m.pdf.images&&p.image?`<img src="${esc(p.image)}" alt="">`:''}<div class="pp-mn"><div class="pp-row"><span class="pp-n">${esc(p.name)}${p.tag?`<span class="pp-bd">${esc(p.tag)}</span>`:''}</span><span class="pp-dots"></span><span class="pp-pr">${pr(p,m)}</span></div>${p.description?`<div class="pp-d">${esc(p.description)}</div>`:''}</div></div>`).join('')}</section>`).join('');
  }else{
    const inner=listHTML(m,{pdf:true}),land=m.pdf.orient==='landscape';
    body=inner?`<div class="pp-info${st==='poster'&&m.pdf.mode==='flow'?' cols'+(land?3:2):''}">${inner}</div>`:'';
  }
  const icons=(st!=='classic'&&vis.length)?`<div class="pp-icons">${vis.slice(0,8).map(c=>`<span><b>${esc(iconFor(c))}</b>${esc(c.name)}</span>`).join('')}</div>`:'';
  const cover=`<section class="pp-cover${body?'':' nb'}" style="--ph:${ph}">${m.logo?`<img class="pp-logo" src="${esc(m.logo)}" alt="">`:''}<div class="pp-title">${esc(m.name)}</div>${m.tagline?`<div class="pp-tl">${esc(m.tagline)}</div>`:''}<div class="pp-orn"></div><div class="qr-slot pp-qr"></div><div class="pp-scan">Jonli menyu uchun skanerlang</div><div class="pp-sub">Menyu onlayn yangilanadi</div>${icons}${contacts.length?`<div class="pp-ct">${contacts.map(esc).join('<br>')}</div>`:''}</section>`;
  return {cover,body};
}
function sheetPreview(){
  const [w,h,mg]=pageDims(),k=3.7795,W=w*k,H=h*k,P=mg*k;
  const avail=Math.max(260,($('#stageBody').clientWidth||600)-30);
  const zoom=Math.min(.75,avail/W);
  const {cover,body}=pdfParts(state,(H-2*P)+'px');
  const st=`${themeStyle(state.theme)};width:${W}px;padding:${P}px;zoom:${zoom}`;
  return `<div class="sheet pp" style="${st};height:${H}px">${cover}</div><div class="sheet pp" style="${st};min-height:${H}px">${body||'<div class="pp-cd">Mahsulot qo\'shilmagan</div>'}</div>`;
}
function qrCardHTML(m){
  return `<div class="qc" style="${themeStyle(m.theme)}"><div class="qc-top">${esc(m.qr.frame||'MENYUNI SKANERLANG')}</div><div class="qc-q qr-slot"></div><div class="qc-n">${esc(m.name)}</div><div class="qc-s">${esc(m.tagline)}</div></div>`;
}

/* ================= Preview ================= */
function refreshPreview(){
  $$('#seg button').forEach(b=>b.classList.toggle('on',b.dataset.v===view));
  const st=$('#stageBody'),cap=$('#cap');
  if(view==='online'){
    const old=$('#phoneIn'),sc=old?old.scrollTop:0;
    st.innerHTML='<div class="phone"><div class="phone-in" id="phoneIn"></div></div>';
    mountMenu($('#phoneIn'),state);$('#phoneIn').scrollTop=sc;
    cap.textContent="Telefonda mijoz shunday ko'radi";
  }else if(view==='pdf'){
    const old=$('.sheets'),sc=old?old.scrollTop:0;
    st.innerHTML=`<div class="sheets">${sheetPreview()}</div>`;$('.sheets').scrollTop=sc;
    cap.textContent="PDF ko'rinishi (taxminiy). Sahifalar bo'linishi chop etishda aniqlanadi";
  }else{
    st.innerHTML=`<div class="qcwrap">${qrCardHTML(state)}</div>`;
    cap.textContent="Stolga qo'yish uchun QR karta";
  }
  paintQR(st);
}

/* ================= Chap panel ================= */
const inp=(label,path,o={})=>`<label class="f"><span>${label}</span><input type="${o.type||'text'}" data-p="${path}" value="${esc(get(state,path))}" ${o.ph?`placeholder="${esc(o.ph)}"`:''}></label>`;
const sel=(label,path,opts)=>`<label class="f"><span>${label}</span><select data-p="${path}">${opts.map(([v,l])=>`<option value="${esc(v)}"${String(get(state,path))===String(v)?' selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
const colr=(label,path)=>`<label class="f"><span>${label}</span><input type="color" data-p="${path}" value="${esc(get(state,path))}"></label>`;

function statsHTML(){
  const pal=palette(state.theme.primary);
  const cats=state.categories.map(c=>({c,n:visibleProducts(c).length})).filter(x=>x.n>0);
  const prods=state.categories.flatMap(c=>visibleProducts(c));
  const priced=prods.filter(p=>p.price>0).map(p=>p.price);
  const avg=priced.length?priced.reduce((a,b)=>a+b,0)/priced.length:0;
  const cur=state.currency;
  if(!prods.length)return '<div class="st-rg" style="margin:0">Mahsulot qo\'shsangiz, bu yerda menyu statistikasi paydo bo\'ladi.</div>';
  return `<div class="st-g"><div class="st-t"><b>${cats.length}</b><span>kategoriya</span></div><div class="st-t"><b>${prods.length}</b><span>mahsulot</span></div><div class="st-t"><b>${avg?num(Math.round(avg)):'-'}</b><span>o'rtacha narx (${cur})</span></div></div>
  <div class="st-bar">${cats.map((x,i)=>`<i style="flex:${x.n};background:${pal[i%6]}" title="${esc(x.c.name)}: ${x.n}"></i>`).join('')}</div>
  <div class="st-lg">${cats.map((x,i)=>`<span><i style="background:${pal[i%6]}"></i>${esc(iconFor(x.c))} ${esc(x.c.name)} · ${x.n}</span>`).join('')}</div>
  ${priced.length?`<div class="st-rg">Eng arzon: <b>${money(Math.min(...priced),cur)}</b> · Eng qimmat: <b>${money(Math.max(...priced),cur)}</b></div>`:''}`;
}
function tabBiz(){
  return `<h3>Biznes ma'lumotlari</h3><p class="hint">Bu ma'lumotlar menyu va PDF muqovasida ko'rinadi.</p>
  <div class="logo-row"><label class="logo-box">${state.logo?`<img src="${esc(state.logo)}" alt="">`:'+ Logo'}<input type="file" accept="image/*" hidden data-img="logo"></label>
  <div><b style="font-size:13px">Logotip</b><div class="note" style="margin:2px 0 6px">PNG yoki JPG</div>${state.logo?'<button class="btn sm del" data-a="rmLogo">Olib tashlash</button>':''}</div></div>
  ${inp('Biznes nomi','name',{ph:'Cafe Roma'})}
  ${inp('Qisqa tavsif','tagline',{ph:'Italyan restorani'})}
  <div class="g2">${inp('Telefon','phone',{ph:'+998 ...'})}${sel('Valyuta','currency',[['UZS',"UZS (so'm)"],['USD','USD ($)'],['EUR','EUR (€)'],['RUB','RUB']])}</div>
  ${inp('Manzil','address')}
  <div class="g2">${inp('Instagram','instagram',{ph:'@cafe_roma'})}${inp('Telegram','telegram',{ph:'@cafe_roma'})}</div>
  <button class="btn dark wide" data-a="tab" data-t="menu">Keyingisi: Menyu →</button>`;
}
function tabMenu(){
  const cats=state.categories.map((c,i)=>`<div class="cat">
    <div class="cat-h"><select class="ic-sel" data-p="categories.${i}.icon" aria-label="Ikonka"><option value="">${esc(iconFor({name:c.name}))} avto</option>${ICONS.map(([e,l])=>`<option value="${e}"${c.icon===e?' selected':''}>${e} ${esc(l)}</option>`).join('')}</select>
      <input data-p="categories.${i}.name" value="${esc(c.name)}" aria-label="Kategoriya nomi">
      <button class="ib" data-a="upCat" data-i="${i}" title="Yuqoriga">↑</button><button class="ib" data-a="downCat" data-i="${i}" title="Pastga">↓</button><button class="ib x" data-a="delCat" data-i="${i}" title="O'chirish">✕</button></div>
    <div class="cat-b"><input class="cat-d" data-p="categories.${i}.description" value="${esc(c.description)}" placeholder="Kategoriya tavsifi (ixtiyoriy)">
    ${c.products.map((p,j)=>{const b=`categories.${i}.products.${j}`;return `<div class="prod">
      <label class="thumb">${p.image?`<img src="${esc(p.image)}" alt="">`:'+ rasm'}<input type="file" accept="image/*" hidden data-img="${i},${j}"></label>
      <div class="pf"><div class="r1"><input type="text" data-p="${b}.name" value="${esc(p.name)}" placeholder="Nomi"><input type="number" min="0" step="any" data-p="${b}.price" value="${p.price}" placeholder="Narx"></div>
        <div class="r2"><input type="text" data-p="${b}.description" value="${esc(p.description)}" placeholder="Tavsif / tarkibi"></div>
        <div class="r3"><select data-p="${b}.tag">${TAGS.map(t=>`<option value="${t}"${p.tag===t?' selected':''}>${t||'Belgisiz'}</option>`).join('')}</select><label class="chk"><input type="checkbox" data-p="${b}.available"${p.available?' checked':''}> Mavjud</label></div>
        <div class="mini">${p.image?`<button class="ib" data-a="rmImg" data-i="${i}" data-j="${j}" title="Rasmni olib tashlash">🖼✕</button>`:''}<button class="ib" data-a="upProd" data-i="${i}" data-j="${j}">↑</button><button class="ib" data-a="downProd" data-i="${i}" data-j="${j}">↓</button><button class="ib x" data-a="delProd" data-i="${i}" data-j="${j}">✕</button></div>
      </div></div>`}).join('')}
    <button class="add-p" data-a="addProd" data-i="${i}">+ Mahsulot qo'shish</button></div></div>`).join('');
  return `<h3>Kategoriya va mahsulotlar</h3><p class="hint">Nomi bo'sh mahsulotlar menyuda ko'rinmaydi. O'ngdagi oynada o'zgarishlar darhol ko'rinadi.</p>
  <div class="stats" id="stats">${statsHTML()}</div>${cats}
  <button class="btn pri wide" data-a="addCat">+ Kategoriya qo'shish</button>`;
}
const STY_SVG={
  classic:'<svg viewBox="0 0 44 44"><rect width="44" height="44" rx="8" fill="#f1f4f2"/><g stroke="#41524d" stroke-width="2" stroke-linecap="round"><path d="M8 13h18M8 22h14M8 31h17"/></g><g fill="#e8590c"><circle cx="35" cy="13" r="2.4"/><circle cx="35" cy="22" r="2.4"/><circle cx="35" cy="31" r="2.4"/></g></svg>',
  poster:'<svg viewBox="0 0 44 44"><rect width="44" height="44" rx="8" fill="#f1f4f2"/><rect x="5" y="6" width="34" height="14" rx="5" fill="#e8590c"/><rect x="5" y="24" width="34" height="14" rx="5" fill="#1b8a5a"/><g stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M12 13h12M12 31h12"/></g><circle cx="33" cy="13" r="3" fill="#fff" opacity=".7"/><circle cx="33" cy="31" r="3" fill="#fff" opacity=".7"/></svg>',
  bars:'<svg viewBox="0 0 44 44"><rect width="44" height="44" rx="8" fill="#f1f4f2"/><g stroke-linecap="round" stroke-width="5"><path d="M8 13h28" stroke="#e8590c"/><path d="M8 22h20" stroke="#f2994a"/><path d="M8 31h12" stroke="#f7c08a"/></g></svg>',
  board:'<svg viewBox="0 0 44 44"><rect width="44" height="44" rx="8" fill="#f1f4f2"/><rect x="6" y="6" width="32" height="32" rx="3" fill="none" stroke="#12211d" stroke-width="1.6"/><g stroke="#41524d" stroke-width="2" stroke-linecap="round"><path d="M16 15h12M14 22h16M17 29h10"/></g><circle cx="22" cy="19" r="0" /></svg>'
};
const STY_INFO={classic:['Klassik','Toza ro\'yxat, rasmli'],poster:['Poster','Rangli bloklar, ikonkalar'],bars:['Narx shkalasi','Narxlar chiziqlarda'],board:['Taxta','Markazlashgan, ramkali']};
function tabDesign(){
  const tp=state.theme;
  return `<h3>Menyu uslubi</h3><p class="hint">Infografik uslublar onlayn menyu va PDF'da ishlaydi.</p>
  <div class="sty">${STYLES.map(k=>`<button class="stb${tp.style===k?' on':''}" data-a="style" data-k="${k}">${STY_SVG[k]}<span><b>${STY_INFO[k][0]}</b><small>${STY_INFO[k][1]}</small></span></button>`).join('')}</div>
  <h3>Shablon</h3><p class="hint">Ranglar va shrift to'plami.</p>
  <div class="tpls">${TEMPLATES.map(t=>`<button class="tpl${tp.template===t.k?' on':''}" data-a="tpl" data-k="${t.k}"><div class="sw" style="background:${t.t.bg};font-family:'${t.t.font}'"><b style="background:${t.t.primary}"></b><u style="background:${t.t.text}"></u></div><small>${t.n}</small></button>`).join('')}</div>
  <h3>Ranglar va shrift</h3>
  <div class="g3" style="margin-top:10px">${colr('Asosiy','theme.primary')}${colr('Fon','theme.bg')}${colr('Matn','theme.text')}</div>
  ${sel('Shrift','theme.font',FONTS.map(f=>[f,f]))}
  <div class="g2">${tp.style==='classic'?sel("Mahsulot ko'rinishi",'theme.layout',[['list',"Ro'yxat"],['card','Kartalar'],['minimal','Minimal (rasmsiz)']]):''}${sel('Rasm shakli','theme.shape',[['rounded','Yumaloq burchak'],['sq','Kvadrat'],['circle','Doira']])}</div>`;
}
function tabExport(){
  const q=state.qr,p=state.pdf;
  return `<h3>Hammasi tayyor</h3><p class="hint">Bitta menyudan uchta format.</p>
  <div class="box"><h4><span class="ic">🔗</span>QR qayerga olib boradi</h4>
    <label class="f"><span>Menyu havolasi (ixtiyoriy)</span><input type="text" data-p="qr.url" value="${esc(q.url)}" placeholder="https://saytingiz.uz/menu"></label>
    <p class="note" style="margin-top:-4px">Bo'sh qoldirsangiz, menyu ma'lumoti havola ichiga joylanadi (rasmlarsiz).</p>
    <div id="linkInfo"></div>
    <div class="btns"><button class="btn sm" data-a="copyLink">Havolani nusxalash</button><button class="btn sm" data-a="openLink">Menyuni ochish</button></div></div>
  <div class="box"><h4><span class="ic">▦</span>QR kod</h4>
    <div class="row"><div><div class="g2">${colr('QR rangi','qr.dark')}${colr('Fon','qr.light')}</div>${inp('Yozuv (kartada)','qr.frame')}
      <div class="btns"><button class="btn pri sm" data-a="dlPng">PNG yuklash</button><button class="btn sm" data-a="dlSvg">SVG yuklash</button></div></div>
    <div class="qr-mini qr-slot"></div></div>
    <p class="note">PNG ekran va Telegram uchun, SVG chop etish uchun (sifati yo'qolmaydi). To'q naqsh va och fon ishlating.</p></div>
  <div class="box"><h4><span class="ic">📄</span>PDF menyu</h4>
    <div class="g2">${sel("Qog'oz",'pdf.size',[['A4','A4'],['A5','A5'],['Letter','Letter']])}${sel("Yo'nalish",'pdf.orient',[['portrait','Tik'],['landscape','Yotiq']])}</div>
    ${sel('Rejim','pdf.mode',[['flow','Ixcham (ketma-ket)'],['pages','Har kategoriya yangi sahifadan']])}
    <label class="chk" style="margin-bottom:12px"><input type="checkbox" data-p="pdf.images"${p.images?' checked':''}> Mahsulot rasmlarini PDF'ga qo'shish</label>
    <button class="btn pri wide" data-a="printPdf">PDF yuklab olish</button>
    <p class="note">Chop etish oynasi ochiladi. Printer o'rniga <b>"PDF sifatida saqlash"</b> (Save as PDF) ni tanlang.</p></div>
  <div class="box"><h4><span class="ic">🍽</span>Stol uchun QR karta</h4>
    <div class="btns"><button class="btn sm" data-a="printQr1">1 ta (A5)</button><button class="btn sm" data-a="printQr4">A4 da 4 ta</button></div></div>
  <div class="box"><h4><span class="ic">💾</span>Zaxira nusxa</h4>
    <div class="btns"><button class="btn sm" data-a="backup">Zaxira nusxa olish</button><button class="btn sm" data-a="importBtn">Zaxiradan yuklash</button></div>
    <p class="note">Ma'lumotlar shu brauzerda saqlanadi. Boshqa kompyuterga ko'chirish uchun zaxira fayldan foydalaning.</p></div>`;
}
function renderPanel(){
  $$('#steps button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  $('#panelBody').innerHTML=({biz:tabBiz,menu:tabMenu,design:tabDesign,export:tabExport})[tab]();
  if(tab==='export'){paintQR($('#panelBody'));paintLinkInfo()}
}

/* ================= Hodisalar ================= */
$('#panelBody').addEventListener('input',e=>{
  const t=e.target;if(!t.dataset.p)return;
  let v=t.type==='checkbox'?t.checked:t.type==='number'?(t.value===''?0:Math.max(0,Number(t.value)||0)):t.value;
  setp(state,t.dataset.p,v);
  if(['theme.primary','theme.bg','theme.text','theme.font'].includes(t.dataset.p))state.theme.template='custom';
  if(t.dataset.p.startsWith('pdf.'))view='pdf';
  changed();
});
function readImage(file,max,png,cb){
  const fail=()=>alert("Rasmni o'qib bo'lmadi. JPG yoki PNG fayl tanlang");
  const fr=new FileReader();
  fr.onerror=fail;
  fr.onload=()=>{const im=new Image();im.onerror=fail;im.onload=()=>{
    const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;if(!w||!h)return fail();
    const k=Math.min(1,max/Math.max(w,h)),c=document.createElement('canvas');
    c.width=Math.max(1,Math.round(w*k));c.height=Math.max(1,Math.round(h*k));
    const x=c.getContext('2d');if(!png){x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height)}
    x.drawImage(im,0,0,c.width,c.height);cb(png?c.toDataURL('image/png'):c.toDataURL('image/jpeg',.75));
  };im.src=fr.result};
  fr.readAsDataURL(file);
}
$('#panelBody').addEventListener('change',e=>{
  const t=e.target;if(t.dataset.img===undefined||!t.files[0])return;
  const f=t.files[0];
  if(t.dataset.img==='logo')readImage(f,320,true,d=>{state.logo=d;renderPanel();changed()});
  else{const [i,j]=t.dataset.img.split(',').map(Number);readImage(f,380,false,d=>{if(state.categories[i]&&state.categories[i].products[j]){state.categories[i].products[j].image=d;renderPanel();changed()}})}
});
const mv=(arr,i,d)=>{const j=i+d;if(j<0||j>=arr.length)return;[arr[i],arr[j]]=[arr[j],arr[i]];renderPanel();changed()};
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
const fname=()=>(state.name||'menu').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'')||'menu';

const A={
  tab(b){tab=b.dataset.t;renderPanel()},
  view(b){view=b.dataset.v;refreshPreview()},
  addCat(){state.categories.push({id:uid(),name:'Yangi kategoriya',description:'',icon:'',products:[]});renderPanel();changed()},
  delCat(b){if(confirm("Kategoriya va undagi mahsulotlar o'chirilsinmi?")){state.categories.splice(+b.dataset.i,1);renderPanel();changed()}},
  upCat(b){mv(state.categories,+b.dataset.i,-1)},downCat(b){mv(state.categories,+b.dataset.i,1)},
  addProd(b){state.categories[+b.dataset.i].products.push({id:uid(),name:'',price:0,description:'',tag:'',available:true,image:''});renderPanel();changed()},
  delProd(b){state.categories[+b.dataset.i].products.splice(+b.dataset.j,1);renderPanel();changed()},
  upProd(b){mv(state.categories[+b.dataset.i].products,+b.dataset.j,-1)},downProd(b){mv(state.categories[+b.dataset.i].products,+b.dataset.j,1)},
  rmImg(b){state.categories[+b.dataset.i].products[+b.dataset.j].image='';renderPanel();changed()},
  rmLogo(){state.logo='';renderPanel();changed()},
  tpl(b){const t=TEMPLATES.find(x=>x.k===b.dataset.k);Object.assign(state.theme,t.t,{template:t.k});renderPanel();changed()},
  style(b){state.theme.style=pick(b.dataset.k,STYLES,'classic');renderPanel();changed()},
  copyLink(){if(!LINK)return;const ok=()=>setStatus('<b>✓</b> Havola nusxalandi'),no=()=>prompt('Havolani nusxalang:',LINK);
    try{navigator.clipboard.writeText(LINK).then(ok,no)}catch(e){no()}},
  openLink(){if(LINK)window.open(LINK,'_blank')},
  async dlPng(){if(!LINK||!qrOK())return;try{download(await qrPNG(LINK,state.qr.dark,state.qr.light,1000),fname()+'-QR.png')}catch(e){alert('Havola QR uchun juda uzun')}},
  dlSvg(){if(!LINK||!qrOK())return;try{download(new Blob([qrSVG(LINK,state.qr.dark,state.qr.light)],{type:'image/svg+xml'}),fname()+'-QR.svg')}catch(e){alert('Havola QR uchun juda uzun')}},
  printPdf(){doPrint('pdf')},printQr1(){doPrint('qr1')},printQr4(){doPrint('qr4')},
  newMenu(){if(!confirm("Yangi bo'sh menyu yaratilsinmi? Hozirgi menyu o'chadi (avval 'Zaxira nusxa' oling)."))return;
    state=normalize({name:'Yangi menyu',categories:[{id:uid(),name:'Asosiy taomlar',products:[]}]});tab='biz';FILTER={q:'',cat:'all'};renderPanel();changed()},
  backup(){download(new Blob([JSON.stringify(state)],{type:'application/json'}),'menucraft-'+fname()+'.json')},
  importBtn(){$('#importFile').click()}
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b&&A[b.dataset.a])A[b.dataset.a](b)});
$('#importFile').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  const fr=new FileReader();fr.onload=()=>{try{state=normalize(JSON.parse(fr.result));FILTER={q:'',cat:'all'};renderPanel();changed()}catch(x){alert("Fayl o'qilmadi")}};fr.readAsText(f);e.target.value='';
});
window.addEventListener('resize',()=>{if(view==='pdf')refreshPreview()});

/* telefonda "Ko'rish / Tahrirlash" tugmasi */
const fab=$('#fab');
function fabUpdate(){const r=$('.stage').getBoundingClientRect();fab.textContent=r.top<innerHeight*.5?'✎ Tahrirlash':"👁 Ko'rish"}
fab.addEventListener('click',()=>{const r=$('.stage').getBoundingClientRect();
  if(r.top<innerHeight*.5)window.scrollTo({top:0,behavior:'smooth'});else window.scrollTo({top:scrollY+r.top-70,behavior:'smooth'})});
window.addEventListener('scroll',fabUpdate,{passive:true});

/* ================= Chop etish (PDF / QR karta) ================= */
async function doPrint(kind){
  await window.__qrReady;await updateLink();
  const m=state,root=$('#printRoot'),[w,h,mg]=pageDims();
  const pn={A4:'A4',A5:'A5',Letter:'letter'}[m.pdf.size]||'A4';
  let css;
  if(kind==='pdf'){
    const {cover,body}=pdfParts(m,(h-2*mg-2)+'mm');
    root.innerHTML=`<div class="pp" style="${themeStyle(m.theme)}">${cover}${body}</div>`;
    css=`@page{size:${pn} ${m.pdf.orient};margin:${mg}mm}@media print{html,body.pr{background:${m.theme.bg}!important}}`;
  }else if(kind==='qr1'){
    root.innerHTML=`<div class="qp1">${qrCardHTML(m)}</div>`;css='@page{size:A5 portrait;margin:0}';
  }else{
    root.innerHTML=`<div class="qp4">${[1,2,3,4].map(()=>`<div>${qrCardHTML(m)}</div>`).join('')}</div>`;css='@page{size:A4 portrait;margin:0}';
  }
  $('#pageStyle').textContent=css;paintQR(root);
  document.body.classList.add('pr');
  try{await document.fonts.ready}catch(e){}
  await Promise.all($$('img',root).map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})));
  setTimeout(()=>window.print(),80);
}
window.addEventListener('afterprint',()=>{
  document.body.classList.remove('pr');
  $('#printRoot').innerHTML='';$('#pageStyle').textContent='';
});

/* ================= Ommaviy menyu rejimi (#m=...) ================= */
async function route(){
  const h=location.hash;
  if(h.startsWith('#m=')){
    const v=$('#viewer');$('#app').hidden=true;v.hidden=false;v.textContent='';
    const m=await decodeMenu(h.slice(3));
    if(m){document.title=(m.name||'Menyu')+' — Menyu';document.body.style.background=m.theme.bg;mountMenu(v,m,true)}
    else v.innerHTML='<div style="padding:40px 20px;text-align:center">Menyuni ochib bo\'lmadi. Havola to\'liq emas yoki brauzeringiz eski.</div>';
    return true;
  }
  return false;
}
window.addEventListener('hashchange',()=>location.reload());

/* ================= Boshlash ================= */
(async function init(){
  if(await route())return;
  renderPanel();refreshPreview();fabUpdate();setStatus('<b>✓</b> Brauzerda saqlanadi');
  window.__qrFailed=!(await window.__qrReady);
  await updateLink();refreshPreview();if(tab==='export')renderPanel();
})();
