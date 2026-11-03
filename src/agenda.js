export function eventMinutes(time){
 const match=String(time).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
 if(!match)return null;
 let hour=Number(match[1]);const minute=Number(match[2]||0);const period=match[3]?.toUpperCase();
 if(minute>59||hour>23||(period&&(hour<1||hour>12)))return null;
 if(period){hour%=12;if(period==='PM')hour+=12;}
 return hour*60+minute;
}
export function groupAgenda(events){
 const sorted=events.map((event,index)=>({event,index,minutes:eventMinutes(event.time)})).sort((a,b)=>(a.minutes??Infinity)-(b.minutes??Infinity)||a.index-b.index);
 const groups=[];
 for(const {event,minutes} of sorted){
  const hour=minutes===null?'other':Math.floor(minutes/60);
  let group=groups.find(group=>group.hour===hour);
  if(!group){group={hour,label:hour==='other'?'':`${hour%12||12} ${hour>=12?'PM':'AM'}`,events:[]};groups.push(group);}
  group.events.push(event);
 }
 return groups;
}
export function formatMinutes(m){const h=Math.floor(m/60),mm=m%60;return `${h%12||12}:${String(mm).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
export function formatDuration(m){const h=Math.floor(m/60),mm=m%60;return h?`${h}h${mm?` ${mm}m`:''}`:`${mm}m`}
// Groups interleaved with the free gaps between them.
export function agendaTimeline(events){
 const groups=groupAgenda(events),items=[];
 groups.forEach((group,i)=>{
  if(i>0){
   const prev=groups[i-1];
   const prevEnd=Math.max(...prev.events.map(e=>eventMinutes(e.end)??(eventMinutes(e.time)??0)+60));
   const nextStart=Math.min(...group.events.map(e=>eventMinutes(e.time)??Infinity));
   if(Number.isFinite(nextStart)&&nextStart-prevEnd>=15)items.push({type:'gap',start:prevEnd,end:nextStart});
  }
  items.push({type:'group',group});
 });
 return items;
}
// Demo busy schedules for friends (minutes from midnight), nudged per day so each day looks different.
const friendBusyBase={mayachen:[[12*60+30,13*60+30],[16*60+30,17*60+30]],alexr:[[11*60,12*60],[15*60,15*60+45]],sofiapark:[[11*60+15,12*60+45],[15*60+45,16*60+30]]};
export function friendBusy(handle,day){const shift=(((day*37)%5)-2)*20;return (friendBusyBase[handle]||[]).map(([a,b])=>[a+shift,b+shift])}
// Splits a gap into segments, flagging where every selected friend is also free.
export function sharedSegments(start,end,handles,day){
 if(!handles.length)return [];
 const busy=handles.flatMap(h=>friendBusy(h,day)).map(([a,b])=>[Math.max(a,start),Math.min(b,end)]).filter(([a,b])=>b>a).sort((x,y)=>x[0]-y[0]);
 const segs=[];let cursor=start;
 for(const [a,b] of busy){if(a>cursor)segs.push({start:cursor,end:a,shared:true});if(b>cursor){segs.push({start:Math.max(a,cursor),end:b,shared:false});cursor=b}}
 if(cursor<end)segs.push({start:cursor,end,shared:true});
 return segs.filter(s=>s.end-s.start>0);
}
