import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Platform,StyleSheet,Text,View} from 'react-native';
import {Check,Coffee,Sparkles,Trees,Mail,Plus} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
import {LinearGradient} from 'expo-linear-gradient';
import {agendaTimeline,formatDuration,formatMinutes,sharedSegments,eventMinutes} from './agenda';

// Counts the shown duration toward its new value so it changes smoothly as friends are toggled.
function useCountTo(target,duration=750){
 const [value,setValue]=useState(target),from=useRef(target);
 useEffect(()=>{const start=from.current,t0=Date.now();let raf;const tick=()=>{const p=Math.min(1,(Date.now()-t0)/duration),v=Math.round(start+(target-start)*(1-Math.pow(1-p,3)));from.current=v;setValue(v);if(p<1)raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(raf)},[target]);
 return value;
}
function Duration({minutes,color}){const shown=useCountTo(minutes),h=Math.floor(shown/60),m=shown%60;return <View style={styles.duration}>{h>0&&<><Text style={[styles.durNum,{color}]}>{h}</Text><Text style={[styles.durUnit,{color}]}>h</Text></>}{(m>0||!h)&&<><Text style={[styles.durNum,{color},h>0&&{marginLeft:5}]}>{m}</Text><Text style={[styles.durUnit,{color}]}>m</Text></>}</View>}
// Battery-style level: fills in from the right edge, width = share of the gap you're all free.
const FILL=['rgba(126,170,140,0)','rgba(126,170,140,0.45)','rgba(104,152,120,0.7)'],FILL_AT=[0,.4,1];
function BatteryFill({fraction}){
 const level=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(level,{toValue:fraction,duration:750,easing:Easing.out(Easing.cubic),useNativeDriver:false}).start()},[fraction]);
 const width=level.interpolate({inputRange:[0,1],outputRange:['0%','100%']});
 const fill={position:'absolute',top:0,bottom:0,left:0,right:0};
 return <Animated.View pointerEvents="none" style={{position:'absolute',top:0,bottom:0,right:0,width,opacity:level.interpolate({inputRange:[0,.05,1],outputRange:[0,1,1]})}}>
  {Platform.OS==='web'?<View style={[fill,{backgroundImage:`linear-gradient(90deg, ${FILL.map((c,i)=>`${c} ${FILL_AT[i]*100}%`).join(', ')})`}]}/>:<LinearGradient colors={FILL} locations={FILL_AT} start={{x:0,y:.5}} end={{x:1,y:.5}} style={fill}/>}
 </Animated.View>;
}
export function GapBlock({start,end,day,friends,onGap}){
 const segs=sharedSegments(start,end,friends.map(f=>f.handle),day);
 const shared=segs.filter(s=>s.shared);
 const names=friends.map(f=>f.name.split(' ')[0]);
 const withNames=names.length<=1?names.join(''):`${names.slice(0,-1).join(', ')} & ${names[names.length-1]}`;
 const best=shared.slice().sort((a,b)=>(b.end-b.start)-(a.end-a.start))[0];
 const hasShared=!!best,picking=friends.length>0;
 const title=!picking?'Free':hasShared?`Free with ${withNames}`:`No shared time with ${withNames}`;
 const sub=hasShared?`Together ${formatMinutes(best.start)} – ${formatMinutes(best.end)}`:`${formatMinutes(start)} – ${formatMinutes(end)}`;
 const ink=hasShared?'#233d32':'#7d8877';
 const sharedTotal=shared.reduce((n,x)=>n+x.end-x.start,0);
 const range=hasShared?`${formatMinutes(best.start)} – ${formatMinutes(best.end)}`:`${formatMinutes(start)} – ${formatMinutes(end)}`;
 const locked=picking&&sharedTotal===0; // no shared time with the selected friends, so nothing to plan
 return <Pressable accessibilityRole="button" disabled={locked} accessibilityState={{disabled:locked}} accessibilityLabel={`${title}, ${formatDuration(picking?sharedTotal:end-start)}, ${sub}`} onPress={()=>onGap?.({range,start:best?best.start:start,end:best?best.end:end,invitees:friends,person:friends.length===1?friends[0]:null})}>
  <View style={[styles.gap,{minHeight:Math.min(180,60+(end-start)*.6)},hasShared&&styles.gapShared]}>
   <BatteryFill fraction={picking?sharedTotal/(end-start):0}/>
   <View style={{flex:1}}><Text style={[styles.title,{color:ink}]} numberOfLines={1}>{title}</Text><Text style={[styles.details,hasShared&&{color:'#557a62'}]}>{sub}</Text></View>
   <Duration minutes={picking?sharedTotal:end-start} color={hasShared?'#233d32':'#8b9585'}/>
  </View>
 </Pressable>;
}

function InvitationBlock({event,onOpen,onAccept,onDecline}){
 const hour=Math.floor((eventMinutes(event.time)??0)/60);
 return <GlassSurface style={styles.invitation}>
  <Pressable accessibilityRole="button" accessibilityLabel={`Invitation from ${event.invitedBy.name}: ${event.title}, ${event.time}`} onPress={()=>onOpen(event)}>
   <View style={{flexDirection:'row',alignItems:'center',gap:7,marginBottom:14}}><Mail size={13} color="#996338"/><Text style={styles.inviteLabel}>Invitation</Text></View>
   <View style={{flexDirection:'row',alignItems:'center',gap:12}}>
    <View style={styles.hour}><Text style={[styles.hourNumber,{color:'#795130'}]}>{hour%12||12}</Text><Text style={[styles.period,{color:'#996338'}]}>{hour>=12?'PM':'AM'}</Text></View>
    <View style={[styles.avatar,{backgroundColor:event.invitedBy.color}]}><Text style={styles.initial}>{event.invitedBy.initial}</Text></View>
    <View style={{flex:1}}><Text style={styles.title}>{event.title}</Text><Text style={[styles.details,{color:'#8b6b50'}]}>{event.invitedBy.name} invited you</Text><Text style={[styles.details,{color:'#8b6b50'}]}>{event.time} · {event.place}</Text></View>
   </View>
  </Pressable>
  <View style={{flexDirection:'row',gap:8,marginTop:17}}>
   <Pressable accessibilityRole="button" accessibilityLabel="Accept Vraj's invitation" onPress={()=>onAccept(event)} style={styles.accept}><Plus size={13} color="white"/><Text style={{fontSize:11,fontWeight:'500',color:'white'}}>Accept</Text></Pressable>
   <Pressable accessibilityRole="button" accessibilityLabel="Decline Vraj's invitation" onPress={()=>onDecline(event)} style={styles.decline}><Text style={{fontSize:11,color:'#795130'}}>Decline</Text></Pressable>
  </View>
 </GlassSurface>;
}

export default function AgendaBlocks({events,onOpen,day,friends=[],onGap,onAccept,onDecline}){
 return <View style={{gap:8,marginTop:6}}>{agendaTimeline(events).map(item=>item.type==='gap'?<GapBlock key={`gap-${item.start}`} {...item} day={day} friends={friends} onGap={onGap}/>:item.type==='invitation'?<InvitationBlock key={`invite-${item.event.title}`} event={item.event} onOpen={onOpen} onAccept={onAccept} onDecline={onDecline}/>:<GlassSurface key={item.group.hour} style={styles.block}>
 <View style={styles.hour}><Text style={styles.hourNumber}>{item.group.hour==='other'?'':item.group.hour%12||12}</Text><Text style={styles.period}>{item.group.hour==='other'?'':item.group.hour>=12?'PM':'AM'}</Text></View>
 <View style={{flex:1}}>{item.group.events.map((event,index)=>{const Icon=event.kind==='coffee'?Coffee:event.kind==='walk'?Trees:Sparkles;return <Pressable key={`${event.title}-${event.time}-${index}`} accessibilityRole="button" accessibilityLabel={`${event.title}, ${event.time}`} onPress={()=>onOpen(event)} style={[styles.event,index>0&&styles.divider]}><View style={styles.icon}><Icon size={16} color="#41604b"/></View><View style={{flex:1}}><Text style={styles.title}>{event.title}</Text><Text style={styles.details}>{event.time} · {event.place.split(' · ')[0]}</Text></View></Pressable>})}</View>
 </GlassSurface>)}</View>;
}

export function FriendPicker({people,selected,onToggle}){
 return <View style={{marginTop:26}}>
  <View style={styles.pickerHeader}><Text style={styles.eyebrow}>FRIENDS</Text></View>
  <GlassSurface style={styles.pickerCard}>{people.map((p,i)=>{const on=selected.includes(p.handle);return <Pressable key={p.handle} accessibilityRole="checkbox" accessibilityState={{checked:on}} accessibilityLabel={`Compare free time with ${p.name}`} onPress={()=>onToggle(p.handle)} style={[styles.friendRow,i>0&&styles.divider]}>
   <View style={[styles.avatar,{backgroundColor:p.color}]}><Text style={styles.initial}>{p.initial}</Text></View>
   <View style={{flex:1}}><Text style={styles.title}>{p.name}</Text><Text style={styles.details}>{p.where||'On campus'}</Text></View>
   <View style={[styles.check,on&&styles.checkOn]}>{on&&<Check size={11} color="white"/>}</View>
  </Pressable>})}</GlassSurface>
 </View>;
}

const styles=StyleSheet.create({invitation:{padding:17,borderRadius:22,backgroundColor:'#f3dfc6d9',borderColor:'#d4a978',borderLeftWidth:4},inviteLabel:{fontSize:10,fontWeight:'600',color:'#996338'},accept:{flex:1,minHeight:34,borderRadius:17,backgroundColor:'#80583a',alignItems:'center',justifyContent:'center',flexDirection:'row',gap:6},decline:{minHeight:34,paddingHorizontal:18,borderRadius:17,backgroundColor:'#ffffff60',alignItems:'center',justifyContent:'center'},block:{borderRadius:20,paddingHorizontal:14,flexDirection:'row',gap:12},hour:{width:27,alignItems:'center',justifyContent:'center'},hourNumber:{fontSize:19,fontWeight:'500',color:'#233d32'},period:{fontSize:8,color:'#819078',marginTop:3},event:{minHeight:60,flexDirection:'row',alignItems:'center',gap:9,paddingVertical:10},icon:{width:28,height:28,borderRadius:10,backgroundColor:'#ffffff40',alignItems:'center',justifyContent:'center'},title:{fontSize:12,fontWeight:'500',color:'#233d32'},details:{fontSize:9,color:'#819078',marginTop:5,lineHeight:13},divider:{borderTopWidth:1,borderTopColor:'#ffffff80'},
 gap:{minHeight:60,borderRadius:20,paddingHorizontal:16,flexDirection:'row',alignItems:'center',gap:12,overflow:'hidden',backgroundColor:'rgba(31,46,36,0.05)',borderWidth:1,borderColor:'rgba(255,255,255,0.55)',borderStyle:'dashed'},gapShared:{borderStyle:'solid',borderColor:'rgba(255,255,255,0.8)',backgroundColor:'rgba(255,255,255,0.22)',boxShadow:'inset 0px 1px 1px rgba(255,255,255,0.9), 0px 6px 20px rgba(62,110,78,0.10)'},duration:{flexDirection:'row',alignItems:'baseline'},durNum:{fontSize:19,fontWeight:'500'},durUnit:{fontSize:8,marginLeft:2,color:'#819078'},
 pickerHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},eyebrow:{fontSize:8,letterSpacing:1.35,fontWeight:'500',color:'#929a86'},hint:{fontSize:9,color:'#5f8268'},pickerCard:{borderRadius:20,paddingHorizontal:14},friendRow:{flexDirection:'row',alignItems:'center',gap:11,paddingVertical:11},avatar:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#ffffffee'},initial:{fontSize:14,color:'#233d32'},check:{width:20,height:20,borderRadius:10,borderWidth:1.5,borderColor:'#c3cbb8',alignItems:'center',justifyContent:'center'},checkOn:{backgroundColor:'#3f6a50',borderColor:'#3f6a50'}});
