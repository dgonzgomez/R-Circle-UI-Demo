import React,{useEffect,useRef} from 'react';
import {View,StyleSheet} from 'react-native';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {spotFor,timing,legend,pinIcons,pinIconFor,YOU,campusEvents,discoveries,utilitySpots,utilityIcons,daysAway} from './campusData';
import {eventMinutes} from './agenda';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`
.rc-map .leaflet-container{background:#e9eee6;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif}
.rc-map .leaflet-tile-pane{filter:saturate(.7) brightness(1.03)}
.rc-gpin{position:relative;transform:translate(-15px,-40px);width:30px;height:40px;cursor:pointer}
.rc-gpin .drop{position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:var(--c);border:2px solid #fff;box-shadow:0 3px 8px rgba(20,30,20,.35);box-sizing:border-box}
.rc-gpin svg{position:absolute;left:7px;top:6px;width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.rc-photo{transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;cursor:pointer}
.rc-photo .ph{width:38px;height:38px;border-radius:12px;border:3px solid #fff;background-size:cover;background-position:center;box-shadow:0 4px 10px rgba(20,30,20,.35)}
.rc-photo .tip{width:10px;height:10px;background:#fff;transform:rotate(45deg);margin-top:-7px;box-shadow:2px 2px 3px rgba(20,30,20,.15)}
.rc-photo .badge{position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:8px;background:#8a6bb8;border:2px solid #fff;display:flex;align-items:center;justify-content:center}
.rc-photo .badge svg{width:9px;height:9px;stroke:#fff;fill:none;stroke-width:2.4}
.rc-photo .wrap{position:relative}
.rc-util{display:flex;align-items:center;justify-content:center}.rc-util svg{width:19px;height:19px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.rc-util.printer{background:#4f7ea0}.rc-util.market{background:#c0794a}
.rc-gpin.now .drop{animation:rcPulse 1.6s ease-in-out infinite}
@keyframes rcPulse{0%,100%{box-shadow:0 0 0 0 rgba(217,96,63,.5),0 3px 8px rgba(20,30,20,.35)}50%{box-shadow:0 0 0 9px rgba(217,96,63,0),0 3px 8px rgba(20,30,20,.35)}}
.rc-friend{transform:translate(-50%,-50%);width:34px;height:34px;border-radius:17px;border:3px solid #fff;box-shadow:0 3px 10px rgba(30,40,30,.3);background-size:cover;display:flex;align-items:center;justify-content:center;font:16px Georgia,serif;color:#503d32;cursor:pointer}
.rc-you{transform:translate(-50%,-50%);width:16px;height:16px;border-radius:8px;background:#547b91;border:3px solid #fff;box-shadow:0 0 0 8px rgba(84,123,145,.2)}
.rc-legend{position:absolute;left:12px;bottom:330px;z-index:500;display:flex;flex-direction:column;gap:5px;padding:9px 11px;border-radius:14px;background:rgba(255,255,255,.86);backdrop-filter:blur(12px);box-shadow:0 4px 14px rgba(30,40,30,.12);font:500 9px -apple-system,BlinkMacSystemFont,sans-serif;color:#233d32}
.rc-legend span{display:flex;align-items:center;gap:6px}.rc-legend i{width:8px;height:8px;border-radius:4px;display:inline-block}
.leaflet-control-attribution{font-size:8px!important;background:rgba(255,255,255,.7)!important}
`;

const HOME=[33.9741,-117.32985],HOME_ZOOM=16.35;
export default function RealCampusMap({events=[],people=[],onEvent,onPlace,onFriend,onDiscovery,onSpot,filter='All',bottomInset=0,recenter=0,focus=null}){
 const host=useRef(null),map=useRef(null),layer=useRef(null);
 const cb=useRef({});cb.current={onEvent,onPlace,onFriend,onDiscovery,onSpot};
 useEffect(()=>{
  if(!document.getElementById('rc-map-css')){const st=document.createElement('style');st.id='rc-map-css';st.textContent=css;document.head.appendChild(st)}
  const m=L.map(host.current,{center:HOME,zoom:HOME_ZOOM,zoomSnap:.25,minZoom:15,maxZoom:19,zoomControl:false,attributionControl:true,maxBounds:[[33.964,-117.337],[33.983,-117.315]],maxBoundsViscosity:1,inertiaDeceleration:5000,inertiaMaxSpeed:900});
  // Esri World Street Map: free basemap with UCR's buildings already labeled, no API key needed.
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',{maxZoom:19,maxNativeZoom:19,attribution:'Tiles © Esri · Buildings © OpenStreetMap contributors'}).addTo(m);
  L.marker(YOU,{icon:L.divIcon({className:'',html:'<div class="rc-you"></div>',iconSize:[0,0]}),interactive:false}).addTo(m);
  layer.current=L.layerGroup().addTo(m);map.current=m;
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
   const html=`<div class="rc-friend" style="background-color:${esc(p.color)};${p.avatar?`background-image:url('${esc(p.avatar)}')`:''}">${p.avatar?'':esc(p.initial)}</div>`;
   L.marker(off,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:p.name,zIndexOffset:500}).on('click',()=>cb.current.onFriend?.(p)).addTo(g)});
  if(show('Discoveries'))discoveries.forEach(d=>{const html=`<div class="rc-photo"><div class="wrap"><div class="ph" style="background-image:url('${esc(d.img)}')"></div><div class="badge"><svg viewBox="0 0 24 24">${pinIcons.design}</svg></div></div><div class="tip"></div></div>`;
   L.marker(d.pos,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:`${d.title}, discovered by ${d.by}`,zIndexOffset:300}).on('click',()=>cb.current.onDiscovery?.(d)).addTo(g)});
  if(show('Discoveries'))utilitySpots.forEach(u=>{const html=`<div class="rc-photo"><div class="wrap"><div class="ph rc-util ${u.kind}"><svg viewBox="0 0 24 24">${utilityIcons[u.kind==='printer'?'printer':'shopping-basket']}</svg></div><div class="badge"><svg viewBox="0 0 24 24">${pinIcons.design}</svg></div></div><div class="tip"></div></div>`;
   L.marker(u.pos,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:`${u.title}, ${u.place}`,zIndexOffset:250}).on('click',()=>cb.current.onSpot?.(u)).addTo(g)});
  const used={};
  const mapEvents=[...events,...campusEvents.filter(c=>!events.some(e=>e.title===c.title))];
  if(focus&&!mapEvents.some(e=>e.title===focus.event.title))mapEvents.push(focus.event);
  if(show('Spots'))mapEvents.forEach(e=>{const pos=e.pos||spotFor(e.place);if(!pos)return;const start=eventMinutes(e.time);if(start===null)return;const t=timing(e,start,eventMinutes(e.end));if((t.key==='past'||daysAway(e)>30)&&e.title!==focus?.event.title)return;
   const k=pos.join();const n=used[k]=(used[k]||0)+1;const at=[pos[0]-(n-1)*.00028,pos[1]];
   const html=`<div class="rc-gpin ${t.key}" style="--c:${t.color}"><div class="drop"></div><svg viewBox="0 0 24 24">${pinIcons[pinIconFor(e)]}</svg></div>`;
   L.marker(at,{icon:L.divIcon({className:'',html,iconSize:[0,0]}),title:`${e.title}, ${t.label}`,zIndexOffset:1000+(t.key==='now'?400:t.key==='today'?300:t.key==='week'?200:0)}).on('click',()=>cb.current.onEvent?.(e)).addTo(g)});
 },[events,people,filter,focus]);
 return <View style={StyleSheet.absoluteFillObject}>
  <div ref={host} className="rc-map" style={{position:'absolute',inset:0}}/>
  <div className="rc-legend" style={{bottom:330+bottomInset}}>{legend.map(([c,l])=><span key={l}><i style={{background:c}}/>{l}</span>)}</div>
 </View>;
}
