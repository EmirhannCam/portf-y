document.addEventListener('DOMContentLoaded',()=>{
	// Prevent reload jumping to last in-page anchor
	const inPageHashes=new Set(['#hizmetler','#portfolyo','#referanslar','#hakkimizda','#iletisim','#top']);
	if(inPageHashes.has(location.hash)){
		history.replaceState(null,'',location.pathname+location.search);
		window.scrollTo(0,0);
	}

	const navToggle=document.querySelector('.nav-toggle');
	const nav=document.querySelector('#primary-nav');
	const backdrop=document.querySelector('#backdrop');
	function setNavOpen(open){
		if(!nav) return;
		nav.classList.toggle('open',open);
		navToggle?.setAttribute('aria-expanded',String(open));
		if(backdrop){
			backdrop.hidden=!open;
		}
		if(!(document.querySelector('#lightbox') && !document.querySelector('#lightbox')?.hasAttribute('hidden'))){
			document.body.classList.toggle('nav-open',open);
		}
	}
	if(navToggle&&nav){
		navToggle.addEventListener('click',()=>{
			setNavOpen(!nav.classList.contains('open'));
		});
	}
	backdrop?.addEventListener('click',()=>setNavOpen(false));
	document.addEventListener('keydown',e=>{ if(e.key==='Escape') setNavOpen(false); });
	window.addEventListener('resize',()=>{ if(window.innerWidth>640) setNavOpen(false); });

	// Dark mode toggle
	const themeToggle=document.querySelector('#themeToggle');
	const root=document.documentElement;
	function applyTheme(theme){
		root.setAttribute('data-theme',theme);
		if(themeToggle){
			themeToggle.setAttribute('aria-pressed',String(theme==='dark'));
			themeToggle.textContent=theme==='dark'?'🌙':'☀️';
		}
		localStorage.setItem('theme',theme);
	}
	const preferred=(localStorage.getItem('theme'))|| (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
	applyTheme(preferred);
	if(themeToggle){
		themeToggle.addEventListener('click',()=>{
			applyTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
		});
	}

	// Smooth scroll (and avoid adding hash)
	document.querySelectorAll('a[href^="#"]').forEach(a=>{
		a.addEventListener('click',e=>{
			const targetId=a.getAttribute('href');
			if(!targetId||targetId==="#") return;
			const el=document.querySelector(targetId);
			if(!el) return;
			e.preventDefault();
			el.scrollIntoView({behavior:'smooth',block:'start'});
			// clear hash so refresh doesn't jump
			history.replaceState(null,'',location.pathname+location.search);
			setNavOpen(false);
		});
	});

	// Reveal on scroll
	const revealEls=[...document.querySelectorAll('[data-reveal]')];
	const io=new IntersectionObserver(entries=>{
		entries.forEach(entry=>{
			if(entry.isIntersecting){
				entry.target.classList.add('revealed');
				io.unobserve(entry.target);
			}
		});
	},{threshold:0.2});
	revealEls.forEach(el=>io.observe(el));

	// Portfolio data with multiple images per item for slider
	const portfolioItems=[
		{ id:1, title:'Villa Kiralama', category:'web', tags:['Web','Next.js','SEO'], images:['assets/images/villa1.jpg','assets/images/villa2.jpg','assets/images/villa3.jpg','assets/images/villa4.jpg','assets/images/villa5.jpg','assets/images/villa6.jpg','assets/images/villa7.jpg']},
		{ id:2, title:'Eğitici Mobil Uygulama ', category:'mobil', tags:['UI','React Native'], images:['assets/images/eğitim1.jpg','assets/images/eğitim2.jpg','assets/images/eğitim3.jpg','assets/images/eğitim4.jpg','assets/images/eğitim5.jpg','assets/images/eğitim6.jpg','assets/images/eğitim7.jpg'] },
		{ id:3, title:'Logo Revizyonu', category:'logo', tags:['Vektörel','3D'], images:['assets/images/logo1.jpg','assets/images/logo2.jpg','assets/images/logo3.jpg','assets/images/logo4.jpg'] },
		{ id:4, title:'BE Health Online Randevu', category:'web', tags:['Web','js','SEO'], images:['assets/images/sağlık1.jpg','assets/images/sağlık2.jpg','assets/images/sağlık3.jpg','assets/images/sağlık4.jpg','assets/images/sağlık5.jpg','assets/images/sağlık6.jpg'] },
		{ id:2, title:'Oyunlara Özel Mobil Uygulama ', category:'mobil', tags:['UI','React Native'], images:['assets/images/basket1.jpg','assets/images/basket2.jpg','assets/images/basket3.jpg','assets/images/basket4.jpg','assets/images/basket5.jpg','assets/images/basket6.jpg'] },
		{ id:5, title:'Sosyal Medya Yönetimi', category:'dijital', tags:['Meta Ads','SEO Optimizasyon'], images:['assets/images/sosyal1.jpg','assets/images/sosyal2.jpg','assets/images/sosyal3.jpg'] },
		{ id:6, title:'Oto Kurtarıcı', category:'web', tags:['Web','js','SEO'], images:['assets/images/otokurtarma1.jpg','assets/images/otokurtarma2.jpg','assets/images/otokurtarma3.jpg','assets/images/otokurtarma4.jpg','assets/images/otokurtarma5.jpg','assets/images/otokurtarma6.jpg','assets/images/otokurtarma7.jpg'] },
		{ id:7, title:'Drone Kuaför Çekimi', category:'drone', tags:['4K'], images:['assets/images/berber1.jpg','assets/images/berber2.jpg','assets/images/berber3.jpg','assets/images/berber4.jpg','assets/images/berber5.jpg','assets/images/berber6.jpg'] },
		{ id:8, title:'Online Diyetisyen', category:'web', tags:['Web','UI/UX'], images:['assets/images/diyet1.jpg','assets/images/diyet2.jpg','assets/images/diyet3.jpg','assets/images/diyet4.jpg','assets/images/diyet5.jpg','assets/images/diyet6.jpg','assets/images/diyet7.jpg' ,'assets/images/diyet8.jpg'] },
	];
	const grid=document.querySelector('#portfolioGrid');
	function sliderTemplate(images, title){
		const dots=images.map((_,i)=>`<button class="slider-dot" aria-label="${title} ${i+1}"></button>`).join('');
		const slides=images.map(src=>`<div class="slide"><img src="${src}" alt="${title}"/></div>`).join('');
		return `
			<div class="slider">
				<div class="slider-track">${slides}</div>
				<div class="slider-controls">
					<button class="slider-btn prev" aria-label="Önceki">‹</button>
					<button class="slider-btn next" aria-label="Sonraki">›</button>
				</div>
				<div class="slider-dots">${dots}</div>
			</div>
		`;
	}
	function render(items){
		if(!grid) return;
		grid.innerHTML=items.map(item=>`
			<li class="portfolio-item" data-category="${item.category}">
				${sliderTemplate(item.images,item.title)}
				<div class="content">
					<h3>${item.title}</h3>
					<p class="meta">${item.tags.join(' · ')}</p>
				</div>
			</li>
		`).join('');
		initSliders();
	}
	render(portfolioItems);

	function initSliders(){
		document.querySelectorAll('.slider').forEach(slider=>{
			const track=slider.querySelector('.slider-track');
			const slides=[...slider.querySelectorAll('.slide')];
			const dots=[...slider.querySelectorAll('.slider-dot')];
			const prev=slider.querySelector('.prev');
			const next=slider.querySelector('.next');
			let idx=0;
			function update(){
				track.style.transform=`translateX(-${idx*100}%)`;
				dots.forEach((d,i)=>d.classList.toggle('is-active',i===idx));
			}
			function go(i){
				idx=(i+slides.length)%slides.length;
				update();
			}
			dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
			prev?.addEventListener('click',()=>go(idx-1));
			next?.addEventListener('click',()=>go(idx+1));
			slides.forEach((s,i)=>{
				s.addEventListener('click',()=>openLightbox(slides.map(x=>x.querySelector('img')?.src||''),i, slider.closest('.portfolio-item')?.querySelector('h3')?.textContent||''));
			});
			update();
		});
	}

	// Filtering
	const chips=[...document.querySelectorAll('.chip')];
	chips.forEach(chip=>{
		chip.addEventListener('click',()=>{
			chips.forEach(c=>c.classList.remove('is-active'));
			chip.classList.add('is-active');
			const f=chip.dataset.filter;
			if(!f||f==='all') return render(portfolioItems);
			render(portfolioItems.filter(i=>i.category===f));
		});
	});

	// Lightbox with caption
	const lightbox=document.querySelector('#lightbox');
	const lbImg=lightbox?.querySelector('.lightbox-image');
	const lbPrev=lightbox?.querySelector('.lightbox-prev');
	const lbNext=lightbox?.querySelector('.lightbox-next');
	const lbClose=lightbox?.querySelector('.lightbox-close');
	let lbSources=[]; let lbIndex=0; let lbTitle="";
	function openLightbox(sources,index,title){
		lbSources=sources.filter(Boolean);
		lbIndex=index; lbTitle=title||'';
		updateLightbox();
		lightbox?.removeAttribute('hidden');
		document.body.classList.add('nav-open');
	}
	function closeLightbox(){
		lightbox?.setAttribute('hidden','');
		if(!(nav && nav.classList.contains('open'))){
			document.body.classList.remove('nav-open');
		}
	}
	function updateLightbox(){ if(lbImg){ lbImg.src=lbSources[lbIndex]||''; lbImg.alt = lbTitle || 'Büyük görsel'; }
		let caption=document.querySelector('.lightbox-caption');
		if(!caption){
			caption=document.createElement('div');
			caption.className='lightbox-caption';
			lightbox?.appendChild(caption);
		}
		caption.textContent = lbTitle ? `${lbTitle} – ${lbIndex+1}/${lbSources.length}` : `${lbIndex+1}/${lbSources.length}`;
	}
	lbPrev?.addEventListener('click',()=>{lbIndex=(lbIndex-1+lbSources.length)%lbSources.length;updateLightbox();});
	lbNext?.addEventListener('click',()=>{lbIndex=(lbIndex+1)%lbSources.length;updateLightbox();});
	lbClose?.addEventListener('click',closeLightbox);
	lightbox?.addEventListener('click',e=>{ if(e.target===lightbox) closeLightbox(); });
	document.addEventListener('keydown',e=>{
		if(lightbox && lightbox.hasAttribute('hidden')) return;
		if(e.key==='Escape') closeLightbox();
		if(e.key==='ArrowLeft') lbPrev?.click();
		if(e.key==='ArrowRight') lbNext?.click();
	});

	// Testimonials auto-rotate
	const tList=document.querySelector('#testimonialList');
	if(tList){
		let idx=0; const items=[...tList.querySelectorAll('.testimonial')];
		setInterval(()=>{
			items[idx].classList.remove('is-active');
			idx=(idx+1)%items.length;
			items[idx].classList.add('is-active');
		},4000);
	}

	// Scroll-spy for active nav
	const sections=['#hizmetler','#portfolyo','#referanslar','#hakkimizda','#iletisim'].map(id=>document.querySelector(id)).filter(Boolean);
	const navLinks=[...document.querySelectorAll('.nav a')];
	const spy=new IntersectionObserver(entries=>{
		entries.forEach(entry=>{
			const id='#'+entry.target.id;
			const link=navLinks.find(a=>a.getAttribute('href')===id);
			if(link){
				if(entry.isIntersecting){
					navLinks.forEach(a=>a.classList.remove('is-active'));
					link.classList.add('is-active');
				}
			}
		});
	},{rootMargin:'-50% 0px -45% 0px'});
	sections.forEach(s=>spy.observe(s));

	// Back-to-top button
	const backToTop=document.querySelector('#backToTop');
	if(backToTop){
		window.addEventListener('scroll',()=>{
			const show=window.scrollY>400;
			backToTop.toggleAttribute('hidden',!show);
			backToTop.classList.toggle('is-visible',show);
		});
		backToTop.addEventListener('click',()=>{
			window.scrollTo({top:0,behavior:'smooth'});
		});
	}

	// Contact form handling
	const form=document.querySelector('#contactForm');
	const statusEl=document.querySelector('.form-status');
	if(form){
		form.addEventListener('submit',async e=>{
			const action=form.getAttribute('action');
			if(action && action.includes('formspree.io')){
				return; // native submit
			}
			e.preventDefault();
			const data=Object.fromEntries(new FormData(form));
			if(!data.name||!data.email||!data.subject||!data.message){
				if(statusEl) statusEl.textContent='Lütfen tüm alanları doldurun.';
				return;
			}
			try{
				if(statusEl) statusEl.textContent='Gönderiliyor...';
				await new Promise(r=>setTimeout(r,800));
				if(statusEl) statusEl.textContent='Mesajınız alındı. En kısa sürede dönüş yapacağız.';
				form.reset();
			}catch(err){
				if(statusEl) statusEl.textContent='Bir hata oluştu. Lütfen tekrar deneyin.';
			}
		});
	}

	// Year
	const year=document.querySelector('#year');
	if(year) year.textContent=String(new Date().getFullYear());
});

// Paketler için veri yapısı
const packageCategories = [
  {
    name: "Web Paketleri",
    items: [
      {
        title: "Kurumsal Web Sitesi",
        price: "₺ 15.000 +",
        features: ["Responsive Tasarım","SEO Optimizasyonu","5-10 Sayfa","İletişim Formu","Google Analytics","3 Ay Destek"]
      },
      {
        title: "E-Ticaret Sitesi",
        price: "₺ 25.000 +",
        features: ["Responsive Tasarım","SEO Optimizasyonu","Ürün Kataloğu","Ödeme Sistemi","Stok Yönetimi","6 Ay Destek"]
      },
      {
        title: "Özel Proje",
        price: "₺ 50.000 +",
        features: ["Özel Tasarım","Gelişmiş Özellikler","API Entegrasyonu","Admin Paneli","Mobil Uygulama","12 Ay Destek"]
      }
    ]
  },
  {
    name: "Drone Çekim Paketleri",
    items: [
      {
        title: "Temel Drone Çekimi",
        price: "₺ 5.000 +",
        features: ["3-4 Saat Çekim","Full HD Video","Düzenleme Dahil","Teslimat: 2 Gün"]
      },
      {
        title: "Profesyonel Drone Çekimi",
        price: "₺ 8.000 +",
        features: ["4-5 Saat Çekim","4K Video","Kurgu ve Montaj","Teslimat: 3 Gün"]
      },
      {
        title: "Kurumsal Drone Çekimi",
        price: "₺ 12.000 +",
        features: ["Tüm Gün Çekim","4K Video","Kurgu, Montaj, Renk","Teslimat: 5 Gün"]
      }
    ]
  },
  {
    name: "Logo Tasarım Paketleri",
    items: [
      {
        title: "Temel Logo Tasarımı",
        price: "₺ 2.500 +",
        features: ["2 Tasarım Alternatifi","Vektörel Teslim","Renk Seçenekleri","Teslimat: 2 Gün"]
      },
      {
        title: "Profesyonel Logo Tasarımı",
        price: "₺ 6.000 +",
        features: ["5 Tasarım Alternatifi","Vektörel Teslim","Kurumsal Kimlik","Teslimat: 5 Gün"]
      },
      {
        title: "Kurumsal Logo Tasarımı",
        price: "₺ 10.000 +",
        features: ["10 Tasarım Alternatifi","Vektörel Teslim","Kurumsal Kimlik Seti","Teslimat: 7 Gün"]
      }
    ]
  }
];

const packagesGrid = document.querySelector('.packages-grid.modern-packages');
let currentCategory = 0;
function animatePackageText(card, newTitle, newPrice, newFeatures) {
  const titleEl = card.querySelector('.package-title');
  const priceEl = card.querySelector('.package-price');
  const featuresEl = card.querySelector('.package-features');
  if (!titleEl || !priceEl || !featuresEl) return;
  titleEl.classList.add('fade-out');
  priceEl.classList.add('fade-out');
  featuresEl.classList.add('fade-out');
  setTimeout(() => {
    titleEl.textContent = newTitle;
    priceEl.textContent = newPrice;
    featuresEl.innerHTML = newFeatures.map(f => `<li>${f}</li>`).join('');
    titleEl.classList.remove('fade-out');
    priceEl.classList.remove('fade-out');
    featuresEl.classList.remove('fade-out');
  }, 350);
}
function renderPackages(categoryIdx) {
  if (!packagesGrid) return;
  const cat = packageCategories[categoryIdx];
  const cards = packagesGrid.querySelectorAll('.package-card');
  if (cards.length === cat.items.length) {
    cat.items.forEach((item, i) => {
      animatePackageText(cards[i], item.title, item.price, item.features);
      const badge = cards[i].querySelector('.package-badge');
      if (i === 1 && !badge) {
        const span = document.createElement('span');
        span.className = 'package-badge';
        span.textContent = 'Popüler';
        cards[i].prepend(span);
      } else if (i !== 1 && badge) {
        badge.remove();
      }
    });
  } else {
    packagesGrid.innerHTML = cat.items.map((item, i) => `
      <div class="package-card${i === 1 ? ' popular' : ''}" data-reveal>
        ${i === 1 ? '<span class="package-badge">Popüler</span>' : ''}
        <div class="package-gradient"></div>
        <h3 class="package-title">${item.title}</h3>
        <div class="package-price">${item.price}</div>
        <ul class="package-features">
          ${item.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <a class="btn primary" href="#iletisim">Teklif Al</a>
      </div>
    `).join('');
  }
  let catTitle = document.querySelector('.packages-category-title');
  if (!catTitle) {
    catTitle = document.createElement('div');
    catTitle.className = 'packages-category-title';
    packagesGrid.parentElement.insertBefore(catTitle, packagesGrid);
  }
  catTitle.textContent = cat.name;
}
renderPackages(currentCategory);
setInterval(() => {
  currentCategory = (currentCategory + 1) % packageCategories.length;
  renderPackages(currentCategory);
}, 10000);

