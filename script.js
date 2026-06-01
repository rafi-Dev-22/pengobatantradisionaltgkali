/* ═══════════════════════════════════════
   Pengobatan Tradisional TGK ALI
   script.js — Semua fungsi JavaScript
   ═══════════════════════════════════════ */

// ── JADWAL ──
const jadwal = [
  { hari:"Senin",  inggris:"Monday",    sesi:[{buka:"11:00",tutup:"14:00"},{buka:"20:00",tutup:"23:59"}], libur:false },
  { hari:"Selasa", inggris:"Tuesday",   sesi:[{buka:"11:00",tutup:"14:00"},{buka:"20:00",tutup:"23:59"}], libur:false },
  { hari:"Rabu",   inggris:"Wednesday", sesi:[{buka:"11:00",tutup:"14:00"}], libur:false, catatan:"Malam Libur" },
  { hari:"Kamis",  inggris:"Thursday",  sesi:[{buka:"11:00",tutup:"14:00"},{buka:"20:00",tutup:"23:59"}], libur:false },
  { hari:"Jumat",  inggris:"Friday",    sesi:[], libur:true },
  { hari:"Sabtu",  inggris:"Saturday",  sesi:[{buka:"11:00",tutup:"14:00"},{buka:"20:00",tutup:"23:59"}], libur:false },
  { hari:"Minggu", inggris:"Sunday",    sesi:[{buka:"11:00",tutup:"14:00"},{buka:"20:00",tutup:"23:59"}], libur:false },
];
const hariMap = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function toMenit(j) { const [h,m]=j.split(':').map(Number); return h*60+m; }

function renderJadwal() {
  const grid = document.getElementById('jadwalGrid');
  const now = new Date();
  const hariIni = hariMap[now.getDay()];
  const nm = now.getHours()*60+now.getMinutes();
  let html='';
  jadwal.forEach(j => {
    const isHariIni = j.inggris===hariIni;
    let cls = isHariIni?'hari-ini':'';
    if(j.libur) cls='libur';
    const badge = isHariIni?'<span class="badge-hari-ini">Hari ini</span>':'';
    let jamHtml;
    if(j.libur) {
      jamHtml='<div class="jadwal-jam libur-txt">🔒 Libur</div>';
    } else {
      let s=j.sesi.map(s=>`<div class="jadwal-sesi">🕐 ${s.buka} – ${s.tutup==="23:59"?"Selesai":s.tutup}</div>`).join('');
      if(j.catatan) s+=`<div style="font-size:0.72rem;color:#e65100;margin-top:3px;">⚠ ${j.catatan}</div>`;
      jamHtml=`<div class="jadwal-jam" style="text-align:right;">${s}</div>`;
    }
    html+=`<div class="jadwal-card ${cls}"><div class="jadwal-hari">${j.hari} ${badge}<small>${j.inggris}</small></div>${jamHtml}</div>`;
    if(isHariIni) updateStatusBar(j,nm);
  });
  grid.innerHTML=html;
}

function updateStatusBar(j,nm) {
  const dot=document.getElementById('statusDot');
  const teks=document.getElementById('statusTeks');
  const sub=document.getElementById('statusSub');
  const jamSkrg=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  if(j.libur) {
    dot.className='status-dot tutup';
    teks.textContent='🔒 Hari ini Libur';
    sub.textContent='Jumat & Malam Rabu tidak ada praktik';
    return;
  }
  let sesiAktif=null, sesiBerikut=null;
  for(const s of j.sesi) {
    const bM=toMenit(s.buka), tM=s.tutup==="23:59"?1440:toMenit(s.tutup);
    if(nm>=bM&&nm<tM){sesiAktif=s;break;}
    if(nm<bM&&!sesiBerikut) sesiBerikut=s;
  }
  if(sesiAktif) {
    dot.className='status-dot buka';
    teks.textContent=sesiAktif.buka.startsWith('20')?'✅ Sedang Buka (Sesi Malam)':'✅ Sedang Buka (Sesi Siang)';
    sub.textContent='Tutup pukul '+(sesiAktif.tutup==="23:59"?"Selesai":sesiAktif.tutup)+' · Sekarang '+jamSkrg;
  } else if(sesiBerikut) {
    dot.className='status-dot tutup';
    teks.textContent='⏳ Belum Buka — '+(sesiBerikut.buka.startsWith('20')?'Sesi Malam':'Sesi Siang')+' pukul '+sesiBerikut.buka;
    sub.textContent='Sekarang '+jamSkrg;
  } else {
    dot.className='status-dot tutup';
    teks.textContent='🔒 Sudah Tutup Hari Ini';
    sub.textContent='Sesi siang buka lagi besok pukul 11:00';
  }
}
renderJadwal();

// ── GALERI ──
const fotoList=[];
function tambahFoto(input) {
  Array.from(input.files).forEach(file=>{
    const r=new FileReader();
    r.onload=e=>{fotoList.push(e.target.result);renderGaleri();};
    r.readAsDataURL(file);
  });
  input.value='';
}
function renderGaleri() {
  const grid=document.getElementById('galeriGrid');
  let html=`<div class="foto-item" onclick="document.getElementById('inputFoto').click()"><div class="foto-placeholder-icon">📷</div><div class="foto-placeholder-txt">Tambah foto</div></div>`;
  fotoList.forEach((src,i)=>{
    html+=`<div class="foto-item" onclick="bukaFoto(${i})"><img src="${src}" alt="Foto ${i+1}"><div class="foto-overlay" style="font-size:2rem;color:#fff;">🔍</div></div>`;
  });
  grid.innerHTML=html;
}
function bukaFoto(i) { document.getElementById('modalImg').src=fotoList[i]; document.getElementById('modalFoto').classList.add('aktif'); }
function tutupModal() { document.getElementById('modalFoto').classList.remove('aktif'); }

// ── MAPS ──
function terapkanMaps() {
  let raw=document.getElementById('inputMaps').value.trim();
  if(raw.includes('maps.app.goo.gl')||raw.includes('goo.gl')) {
    alert('Link pendek tidak bisa digunakan.\n\nCara yang benar:\n1. Buka Google Maps di PC/laptop\n2. Cari lokasi Anda\n3. Klik Bagikan\n4. Pilih tab Sematkan peta\n5. Klik SALIN HTML\n6. Tempel kode iframe di sini');
    return;
  }
  const match=raw.match(/src="([^"]+)"/);
  const url=match?match[1]:raw;
  if(url&&url.includes('google.com/maps')) {
    document.getElementById('mapsFrame').src=url;
    document.getElementById('mapsPlaceholder').style.display='none';
    alert('Peta berhasil diperbarui!');
  } else {
    alert('Kode tidak valid. Harus kode iframe dari Google Maps -> Bagikan -> Sematkan peta.');
  }
}
function bukaGMaps() {
  const alamat=document.getElementById('inputAlamat').value||document.getElementById('tampilAlamat').textContent||'Banda Aceh';
  window.open('https://www.google.com/maps/search/'+encodeURIComponent(alamat),'_blank');
}
function simpanAlamat() {
  document.getElementById('tampilAlamat').textContent=document.getElementById('inputAlamat').value||'-';
  document.getElementById('tampilLandmark').textContent=document.getElementById('inputLandmark').value||'-';
  document.getElementById('tampilPos').textContent=document.getElementById('inputPos').value||'-';
  alert('Alamat berhasil disimpan!');
}

// ── KONTAK ──
const kontakData = {
  wa: {
    val: "+62 858-3685-9030",
    link: (v) => `https://wa.me/${v.replace(/\D/g, "")}`,
  },
  ig: {
    val: "@_azkiya411",
    link: (v) => `https://instagram.com/${v.replace("@", "")}`,
  },
  tt: { val: "-", link: (v) => `https://tiktok.com/${v}` },
  tel: { val: "085836859030", link: (v) => `tel:${v.replace(/\s/g, "")}` },
};
const judulKontak = {wa:'WhatsApp',ig:'Instagram',tt:'TikTok',tel:'Nomor Telepon'};
let editTarget='';
function bukaEditKontak(key,e) {
  e.stopPropagation();
  editTarget=key;
  document.getElementById('editJudul').textContent='Edit '+judulKontak[key];
  document.getElementById('editLabel').textContent='Masukkan '+judulKontak[key];
  document.getElementById('editInput').value=kontakData[key].val==='-'?'':kontakData[key].val;
  document.getElementById('editOverlay').classList.add('aktif');
}
function simpanKontak() {
  const val=document.getElementById('editInput').value.trim()||'-';
  kontakData[editTarget].val=val;
  document.getElementById('tampil'+editTarget.charAt(0).toUpperCase()+editTarget.slice(1)).textContent=val;
  tutupEdit();
}
function tutupEdit() { document.getElementById('editOverlay').classList.remove('aktif'); }
function bukaLink(key,e) {
  if(e.target.classList.contains('btn-edit-kontak')) return;
  const v=kontakData[key].val;
  if(!v||v==='-') return;
  window.open(kontakData[key].link(v),'_blank');
}
function bukaWA() {
  const v=kontakData.wa.val;
  if(!v||v==='-') { alert('Nomor WhatsApp belum diisi. Klik tombol Edit pada kartu WhatsApp.'); return; }
  window.open('https://wa.me/'+v.replace(/\D/g,''),'_blank');
}

// ── EDIT STATS ──
function bukaEditStats() {
  document.getElementById('editPasien').value=document.getElementById('statPasien').textContent;
  document.getElementById('editRating').value=document.getElementById('statRating').textContent.replace('★ ','');
  document.getElementById('editNama').value=document.getElementById('footerNama').textContent;
  document.getElementById('editStatsOverlay').classList.add('aktif');
}
function simpanStats() {
  document.getElementById('statPasien').textContent=document.getElementById('editPasien').value;
  document.getElementById('statRating').textContent='★ '+document.getElementById('editRating').value;
  const nama=document.getElementById('editNama').value;
  document.getElementById('footerNama').textContent=nama;
  document.querySelectorAll('.nav-brand-text').forEach(el=>{el.childNodes[0].textContent=nama;});
  tutupEditStats();
}
function tutupEditStats() { document.getElementById('editStatsOverlay').classList.remove('aktif'); }

// ── HAMBURGER ──
function toggleMenu() {
  const m=document.getElementById('mobileMenu');
  m.style.display=m.style.display==='block'?'none':'block';
}

// ── REVEAL ──
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible');});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(r=>obs.observe(r));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});
