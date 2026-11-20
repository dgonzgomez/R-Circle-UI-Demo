import React,{useEffect,useRef} from 'react';
import {View,StyleSheet} from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {spotFor,timing,legend,pinIcons,pinIconFor,YOU,campusEvents,discoveries,utilitySpots,utilityIcons,daysAway,buildings} from './campusData';

// Labels we draw ourselves (the basemap has none). Major ones stay visible when zoomed out.
const MAJOR=/HUB|Rivera|Bell Tower|Orbach|SRC|Botanic|Bookstore|Lecture Hall|Arts Building/;
// Photo for pins whose event has none, based on where it is.
const PLACE_PHOTOS=[[/coffee bean|\bhub\b/i,'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/UCR_Hub_View.png/640px-UCR_Hub_View.png'],[/rivera|arts/i,'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Rivera_Library.JPG/640px-Rivera_Library.JPG'],[/botanic|garden/i,'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/UCR_Botanic_Gardens.jpg/640px-UCR_Botanic_Gardens.jpg'],[/\bsrc\b|recreation|basketball/i,'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Student_Recreation_Center_%28UC_Riverside%29.jpg/640px-Student_Recreation_Center_%28UC_Riverside%29.jpg'],[/bell tower/i,'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Belltower.jpg/640px-Belltower.jpg']];
const photoFor=e=>e.img||e.image||PLACE_PHOTOS.find(([re])=>re.test(e.place||''))?.[1]||null;
import {eventMinutes} from './agenda';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`
.rc-map .leaflet-container{background:#3a4a3c;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif}
.rc-pin{transform:translate(-50%,-50%);position:relative;width:42px;height:42px;border-radius:50%;border:3px solid #fff;background:#e7ecdf center/cover no-repeat;box-shadow:0 0 0 3px var(--c),0 6px 14px rgba(30,45,30,.32);cursor:pointer;box-sizing:border-box;transition:transform .15s}
.rc-pin:hover{transform:translate(-50%,-50%) scale(1.08)}
.rc-pin.sm{width:36px;height:36px}
.rc-pin .b{position:absolute;right:-6px;bottom:-5px;width:19px;height:19px;border-radius:50%;background:var(--c);border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-sizing:border-box}
.rc-pin .b svg{width:10px;height:10px;stroke:#fff;fill:none;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.rc-pin.ic{display:flex;align-items:center;justify-content:center;background:var(--c)}
.rc-pin.ic>svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.rc-pin.now{animation:rcPulse 1.6s ease-in-out infinite}
@keyframes rcPulse{0%,100%{box-shadow:0 0 0 3px var(--c),0 0 0 3px rgba(229,121,61,.35),0 6px 14px rgba(30,45,30,.32)}50%{box-shadow:0 0 0 3px var(--c),0 0 0 12px rgba(229,121,61,0),0 6px 14px rgba(30,45,30,.32)}}
.rc-friend{transform:translate(-50%,-50%);position:relative;width:38px;height:38px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 3px #e9896d,0 5px 12px rgba(30,45,30,.3);background-size:cover;display:flex;align-items:center;justify-content:center;font:16px Georgia,serif;color:#503d32;cursor:pointer;box-sizing:border-box}
.rc-friend i{position:absolute;right:-3px;bottom:-2px;width:11px;height:11px;border-radius:6px;background:#82a16d;border:2px solid #fff}
.rc-you{transform:translate(-50%,-50%);width:16px;height:16px;border-radius:8px;background:#547b91;border:3px solid #fff;box-shadow:0 0 0 8px rgba(84,123,145,.2)}
.rc-label{transform:translate(-50%,-50%);white-space:nowrap;font:600 10px/1 -apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;letter-spacing:.2px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.85),0 0 2px rgba(0,0,0,.7);pointer-events:none}
.rc-label.major{font-size:11px}
.rc-map.zoom-far .rc-label:not(.major){display:none}
.rc-legend{position:absolute;left:12px;z-index:500;display:flex;gap:10px;padding:8px 12px;border-radius:20px;background:rgba(234,248,254,.93);border:1px solid rgba(255,255,255,.9);backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);box-shadow:0 4px 14px rgba(30,40,30,.1);font:600 10px -apple-system,BlinkMacSystemFont,sans-serif;color:#1c3d4e}
.rc-legend span{display:flex;align-items:center;gap:6px}.rc-legend i{width:8px;height:8px;border-radius:4px;display:inline-block;box-shadow:0 0 0 2px #fff}
.leaflet-control-attribution{font-size:8px!important;background:rgba(255,255,255,.7)!important}
`;

const HOME=[33.9741,-117.3283],HOME_ZOOM=18;
export default function RealCampusMap({events=[],people=[],onEvent,onPlace,onFriend,onDiscovery,onSpot,filter='All',bottomInset=0,recenter=0,focus=null}){
 const host=useRef(null),map=useRef(null),layer=useRef(null);
 const cb=useRef({});cb.current={onEvent,onPlace,onFriend,onDiscovery,onSpot};
 useEffect(()=>{
  if(!document.getElementById('rc-map-css')){const st=document.createElement('style');st.id='rc-map-css';st.textContent=css;document.head.appendChild(st)}
  const m=L.map(host.current,{center:HOME,zoom:HOME_ZOOM,zoomSnap:.25,minZoom:15,maxZoom:19,zoomControl:false,attributionControl:true,maxBounds:[[33.964,-117.337],[33.983,-117.315]],maxBoundsViscosity:1,inertiaDeceleration:5000,inertiaMaxSpeed:900});
  // Esri World Imagery: free satellite basemap, sharp down to building level.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,maxNativeZoom:19,attribution:'Imagery © Esri'}).addTo(m);
  const labels=L.layerGroup().addTo(m);
  buildings.forEach(b=>{const name=b.short||b.name;L.marker(b.pos,{icon:L.divIcon({className:'',html:`<div class="rc-label${MAJOR.test(name)?' major':''}">${esc(name)}</div>`,iconSize:[0,0]}),interactive:false,keyboard:false}).addTo(labels)});
  const zoomClass=()=>host.current?.classList.toggle('zoom-far',m.getZoom()<17.5);zoomClass();m.on('zoomend',zoomClass);
  L.marker(YOU,{icon:L.divIcon({className:'',html:'<div class="rc-you"></div>',iconSize:[0,0]}),interactive:false}).addTo(m);
  layer.current=L.layerGroup().addTo(m);map.current=m;
  // Start zoomed in on you, with your dot in the strip between the search bar and the bottom sheet.
  m.setView(m.unproject(m.project(L.latLng(YOU),HOME_ZOOM).add([0,(184+bottomInset)/2]),HOME_ZOOM),HOME_ZOOM,{animate:false});
  setTimeout(()=>m.invalidateSize(),50);
  return()=>{m.remove();map.current=null};
 },[]);
 useEffect(()=>{
  const m=map.current,pos=focus&&(focus.event.pos||spotFor(focus.event.place));
  if(!m||!pos)return;
  const z=18,shift=(184+bottomInset)/2;
  const target=m.unproject(m.project(L.latLng(pos),z).add([0,shift]),z);
  m.flyTo(target,z,{duration:.75});
 },[focus,bottomInset]);
 // Re-center on you, placing your dot in the middle of the strip between the search bar and the dock.
 useEffect(()=>{const m=map.current;if(!recenter||!m)return;const z=18.4,shift=(184+bottomInset)/2;const target=m.unproject(m.project(L.latLng(YOU),z).add([0,shift]),z);m.flyTo(target,z,{duration:.7})},[recenter]);
 useEffect(()=>{
  const g=layer.current;if(!g)return;g.clearLayers();
  const show=k=>filter==='All'||filter===k;
  if(show('Friends'))people.forEach(p=>{const pos=spotFor(p.where);if(!pos)return;const off=[pos[0]-.00018,pos[1]-.00024];
   const html=`<div class="rc-friend" style="background-color:${esc(p.color)};${p.avatar?`background-image:url('${esc(p.avatar)}')`:''}">${p.avatar?'':esc(p.initial)}<i></i></div>`;
   L.marker(off,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:p.name,zIndexOffset:500}).on('click',()=>cb.current.onFriend?.(p)).addTo(g)});
  if(show('Discoveries'))discoveries.forEach(d=>{const html=`<div class="rc-pin sm" style="--c:#8a6bb8;background-image:url('${esc(d.img)}')"><div class="b"><svg viewBox="0 0 24 24">${pinIcons.design}</svg></div></div>`;
   L.marker(d.pos,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:`${d.title}, time capsule by ${d.by}`,zIndexOffset:300}).on('click',()=>cb.current.onDiscovery?.(d)).addTo(g)});
  if(filter==='Spots')utilitySpots.forEach(u=>{const html=`<div class="rc-pin sm ic" style="--c:${u.kind==='printer'?'#4f7ea0':'#c0794a'}"><svg viewBox="0 0 24 24">${utilityIcons[u.kind==='printer'?'printer':'shopping-basket']}</svg></div>`;
   L.marker(u.pos,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:`${u.title}, ${u.place}`,zIndexOffset:250}).on('click',()=>cb.current.onSpot?.(u)).addTo(g)});
  const used={};
  const mapEvents=[...events,...campusEvents.filter(c=>!events.some(e=>e.title===c.title))];
  if(focus&&!mapEvents.some(e=>e.title===focus.event.title))mapEvents.push(focus.event);
  if(show('Spots'))mapEvents.forEach(e=>{const pos=e.pos||spotFor(e.place);if(!pos)return;const start=eventMinutes(e.time);if(start===null)return;const t=timing(e,start,eventMinutes(e.end));if((t.key==='past'||daysAway(e)>30)&&e.title!==focus?.event.title)return;
   // Fan out pins that share a spot so they don't sit on top of each other.
   const k=pos.join();const n=used[k]=(used[k]||0)+1;const ang=(n-1)*2.1;const r=n>1?.00032:0;const at=[pos[0]+Math.sin(ang)*r,pos[1]+Math.cos(ang)*r*1.2];
   const img=photoFor(e),icon=`<svg viewBox="0 0 24 24">${pinIcons[pinIconFor(e)]}</svg>`;
   const html=img?`<div class="rc-pin ${t.key}" style="--c:${t.color};background-image:url('${esc(img)}')"><div class="b">${icon}</div></div>`:`<div class="rc-pin ic ${t.key}" style="--c:${t.color}">${icon}</div>`;
   L.marker(at,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:`${e.title}, ${t.label}`,zIndexOffset:1000+(t.key==='now'?400:t.key==='today'?300:t.key==='week'?200:0)}).on('click',()=>cb.current.onEvent?.(e)).addTo(g)});
 },[events,people,filter,focus]);
 return <View style={StyleSheet.absoluteFillObject}>
  <div ref={host} className="rc-map" style={{position:'absolute',inset:0}}/>
  <div className="rc-legend" style={{bottom:330+bottomInset}}>{legend.map(([c,l])=><span key={l}><i style={{background:c}}/>{l}</span>)}</div>
 </View>;
}
