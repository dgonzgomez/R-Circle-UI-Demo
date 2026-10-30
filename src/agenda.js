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
