const listings = [
  {id:1,address:'214 Valencia Road',city:'West Palm Beach, FL 33401',case:'50-2025-CA-008142',tag:'BEST VALUE',photo:'photo-1',judgment:328400,market:612000,bid:245000,date:'Jul 8 · 9:00 AM',score:94,beds:'4 bd · 3 ba',sqft:'2,412 sq ft',upside:367000,week:true,value:true,saved:true},
  {id:2,address:'8679 Via Brilliante',city:'Wellington, FL 33411',case:'50-2025-CA-009617',tag:'NEW LISTING',photo:'photo-2',judgment:449100,market:748000,bid:336000,date:'Jul 9 · 9:00 AM',score:89,beds:'5 bd · 4 ba',sqft:'3,180 sq ft',upside:412000,week:true,value:true,saved:false},
  {id:3,address:'1920 Lake Avenue',city:'Lake Worth Beach, FL 33460',case:'50-2024-CA-011293',tag:'HIGH INTEREST',photo:'photo-3',judgment:271800,market:465000,bid:204000,date:'Jul 14 · 9:00 AM',score:86,beds:'3 bd · 2 ba',sqft:'1,784 sq ft',upside:261000,week:false,value:true,saved:true},
  {id:4,address:'481 Seabreeze Lane',city:'Delray Beach, FL 33483',case:'50-2025-CA-004871',tag:'TITLE REVIEW',photo:'photo-4',judgment:537000,market:885000,bid:402000,date:'Jul 16 · 9:00 AM',score:81,beds:'4 bd · 3 ba',sqft:'2,875 sq ft',upside:483000,week:false,value:false,saved:false},
  {id:5,address:'7380 Pine Park Drive',city:'Boynton Beach, FL 33437',case:'50-2025-CA-006022',tag:'NEW LISTING',photo:'photo-5',judgment:301250,market:520000,bid:226000,date:'Jul 7 · 9:00 AM',score:84,beds:'3 bd · 2 ba',sqft:'1,965 sq ft',upside:294000,week:true,value:true,saved:false}
];

let selectedFilter='all', displayCount=3, selectedListing=null, calendarOffset=0;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

function card(l){
  const risk=l.tag==='TITLE REVIEW'?'tag-risk':'';
  return `<article class="property-card" data-id="${l.id}" tabindex="0" aria-label="View ${l.address}">
    <div class="property-photo ${l.photo}"><span class="property-tag ${risk}">${l.tag}</span><button class="save-button ${l.saved?'saved':''}" data-save="${l.id}" aria-label="Save property">${l.saved?'♥':'♡'}</button></div>
    <div class="property-info"><div class="property-top"><div><span class="property-case">CASE ${l.case}</span><h3>${l.address}</h3><span class="property-location">${l.city}</span></div><span class="deal-score">${l.score}</span></div>
    <div class="property-stats"><div><span>FINAL JUDGMENT</span><strong>${money(l.judgment)}</strong></div><div><span>EST. MARKET</span><strong>${money(l.market)}</strong></div><div><span>OPENING BID</span><strong>${money(l.bid)}</strong></div></div>
    <div class="property-footer"><span class="auction-date"><b>●</b> Auction ${l.date}</span><span class="upside">+${money(l.upside)} potential</span></div></div></article>`
}

function renderListings(){
  const q=$('#searchInput').value.trim().toLowerCase();
  let rows=listings.filter(l=>(selectedFilter==='all'||l[selectedFilter])&&(!q||`${l.address} ${l.city} ${l.case}`.toLowerCase().includes(q)));
  $('#listingsGrid').innerHTML=rows.slice(0,displayCount).map(card).join('')||'<div style="padding:35px;text-align:center;color:#7e8a83;background:white;border-radius:12px">No matches yet. Try a city, ZIP, or case number.</div>';
  $('#loadMoreBtn').style.display=rows.length>displayCount?'block':'none';
  wireCards();
}

function wireCards(){
  $$('.property-card').forEach(el=>{el.addEventListener('click',e=>{if(!e.target.closest('[data-save]'))openDetail(+el.dataset.id)});el.addEventListener('keydown',e=>{if(e.key==='Enter')openDetail(+el.dataset.id)})});
  $$('[data-save]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();toggleSave(+btn.dataset.save)}));
}

function toggleSave(id){const l=listings.find(x=>x.id===id);l.saved=!l.saved;$('#savedCount').textContent=listings.filter(x=>x.saved).length;showToast(l.saved?'Property saved to your watchlist':'Removed from saved properties');renderListings();if(selectedListing?.id===id)$('#modalSave').textContent=l.saved?'♥':'♡'}

function openDetail(id){
  const l=listings.find(x=>x.id===id);selectedListing=l;
  $('#modalPhoto').className=`modal-photo ${l.photo}`;$('#modalTag').textContent=l.tag;$('#modalTitle').textContent=l.address;$('#modalLocation').textContent=l.city;$('#modalCase').textContent=`CASE ${l.case}`;$('#modalScore').textContent=l.score;$('#modalUpside').textContent=`${money(l.upside)} potential upside`;$('#modalSave').textContent=l.saved?'♥':'♡';
  $('#modalMetrics').innerHTML=`<div><span>Final judgment</span><strong>${money(l.judgment)}</strong></div><div><span>Est. market value</span><strong>${money(l.market)}</strong></div><div><span>Opening bid</span><strong>${money(l.bid)}</strong></div><div><span>Property</span><strong>${l.beds} · ${l.sqft}</strong></div>`;
  openModal('#detailModal');
}
function openModal(sel){$(sel).hidden=false;document.body.style.overflow='hidden'}
function closeModals(){$$('.modal-backdrop').forEach(x=>x.hidden=true);document.body.style.overflow=''}

function renderCalendar(){
  const base=new Date(2026,6+calendarOffset,1), year=base.getFullYear(),month=base.getMonth();
  $('#calendarTitle').textContent=base.toLocaleDateString('en-US',{month:'long',year:'numeric'});
  const mondayStart=(base.getDay()+6)%7, days=new Date(year,month+1,0).getDate(),prevDays=new Date(year,month,0).getDate();let html='';
  for(let i=0;i<42;i++){let n,muted=false;if(i<mondayStart){n=prevDays-mondayStart+i+1;muted=true}else if(i>=mondayStart+days){n=i-mondayStart-days+1;muted=true}else n=i-mondayStart+1;const auction=!muted&&month===6&&[7,8,9,14,16,21,23,29].includes(n),cancel=!muted&&month===6&&n===21,today=!muted&&month===6&&n===1;html+=`<button class="calendar-day ${muted?'muted':''} ${auction?'has-auction':''} ${cancel?'cancelled':''} ${today?'today':''}" data-day="${n}" ${muted?'disabled':''}>${n}</button>`}
  $('#calendarGrid').innerHTML=html;
  $$('.calendar-day:not(.muted)').forEach(d=>d.addEventListener('click',()=>{$$('.calendar-day').forEach(x=>x.classList.remove('selected'));d.classList.add('selected');showToast(d.classList.contains('has-auction')?`${d.textContent} ${$('#calendarTitle').textContent}: auction listings available`:'No auctions currently scheduled for this date')}));
}

function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2600)}
function recalc(){const arv=+$('#arvInput').value||0,repair=+$('#repairInput').value||0,cost=+$('#costInput').value||0;$('#maxBid').textContent=money(Math.max(0,arv*.7-repair-cost))}

$$('.filter').filter(x=>x.dataset.filter).forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedFilter=b.dataset.filter;displayCount=3;renderListings()}));
$$('.view-btn').forEach(b=>b.addEventListener('click',()=>{$$('.view-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#listingsGrid').classList.toggle('compact',b.dataset.view==='compact')}));
$('#searchInput').addEventListener('input',renderListings);
$('#loadMoreBtn').addEventListener('click',()=>{displayCount=10;renderListings()});
$('#moreFiltersBtn').addEventListener('click',()=>{const a=$('#activeFilters');a.hidden=!a.hidden;a.innerHTML='<button>Under $500k ×</button><button>Score 80+ ×</button><span>Demo filters applied</span>';showToast(a.hidden?'Advanced filters cleared':'Showing investor-focused filters')});
$('#prevMonth').addEventListener('click',()=>{calendarOffset--;renderCalendar()});$('#nextMonth').addEventListener('click',()=>{calendarOffset++;renderCalendar()});
$('#newAnalysisBtn').addEventListener('click',()=>openModal('#analysisModal'));$('#analyzeBtn').addEventListener('click',()=>{closeModals();if(selectedListing){$('#arvInput').value=selectedListing.market;$('#repairInput').value=65000;$('#costInput').value=32000;recalc()}openModal('#analysisModal')});
['#arvInput','#repairInput','#costInput'].forEach(s=>$(s).addEventListener('input',recalc));
$('#analysisForm').addEventListener('submit',e=>{e.preventDefault();closeModals();showToast('Analysis saved to your deal room')});
$('#modalSave').addEventListener('click',()=>toggleSave(selectedListing.id));
$('#driveReportBtn').addEventListener('click',()=>showToast('Drive report added to your request queue'));
$('#upgradeBtn').addEventListener('click',()=>openModal('#plansModal'));$$('.planSelect').forEach(b=>b.addEventListener('click',()=>{closeModals();showToast('Plan selected — checkout would open next')}));
$$('[data-close]').forEach(b=>b.addEventListener('click',closeModals));$$('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModals()}));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals();if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();$('#searchInput').focus()}});
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{$$('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');const names={auctions:'Auction calendar',map:'Area intelligence',analysis:'Deal analyzer',saved:'Saved opportunities'};if(b.dataset.page==='discover'){showToast('Discover dashboard')}else if(b.dataset.page==='analysis'){openModal('#analysisModal')}else {document.querySelector(b.dataset.page==='map'?'.map-card':b.dataset.page==='auctions'?'.calendar-card':'.listings-panel').scrollIntoView({behavior:'smooth'});showToast(`${names[b.dataset.page]} view`);}}));
$('#calendarViewBtn').addEventListener('click',()=>{document.querySelector('.calendar-card').classList.add('highlight');showToast('38 auctions scheduled in July')});$('#expandMapBtn').addEventListener('click',()=>{document.querySelector('.map-card').scrollIntoView({behavior:'smooth'});showToast('Interactive county map centered')});
$$('.map-pin').forEach(pin=>{const show=()=>{const tip=$('#mapTooltip');tip.hidden=false;tip.innerHTML=`<strong>${pin.dataset.area}</strong><br>${pin.dataset.score}/100 area score`;tip.style.left=`calc(${pin.style.left} - 20px)`;tip.style.top=`calc(${pin.style.top} - 46px)`};pin.addEventListener('mouseenter',show);pin.addEventListener('focus',show);pin.addEventListener('mouseleave',()=>$('#mapTooltip').hidden=true);pin.addEventListener('blur',()=>$('#mapTooltip').hidden=true);pin.addEventListener('click',()=>showToast(`${pin.dataset.area}: ${pin.dataset.score}/100 investment area score`))});
$('#profileBtn').addEventListener('click',()=>showToast('Investor profile menu'));$('.icon-button').addEventListener('click',()=>showToast('2 auction status updates'));$('#miniMap').addEventListener('mouseleave',()=>$('#mapTooltip').hidden=true);

renderListings();renderCalendar();recalc();
