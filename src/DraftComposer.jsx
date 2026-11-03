import React,{useRef,useState} from 'react';
import {Platform,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {CalendarDays,Check,ChevronDown,ChevronLeft,ChevronRight,Clock3,MapPin,Send,UserPlus} from 'lucide-react-native';
import {eventMinutes,formatDuration,formatMinutes} from './agenda';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';

// Google Calendar–style pickers. Day numbers follow the app: 2–31 are October, 1 is November 1.
const WD=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const dayLabel=d=>d===1?'Sun, Nov 1':`${WD[(3+d)%7]}, Oct ${d}`;
const durLabel=m=>m<60?`${m} mins`:`${+(m/60).toFixed(2)} ${m===60?'hr':'hrs'}`;
function MonthPicker({value,onPick}){
 const [month,setMonth]=useState(value===1?11:10);
 const lead=month===10?4:0,count=month===10?31:30,enabled=d=>month===10?d>=26:d===1,picked=d=>month===10?value===d&&d!==1:value===1&&d===1;
 const cells=[...Array(lead).fill(null),...Array.from({length:count},(_,i)=>i+1)];
 return <View style={styles.month}>
  <View style={[styles.row,{justifyContent:'space-between',marginBottom:10}]}><Pressable accessibilityLabel="Previous month" disabled={month===10} onPress={()=>setMonth(10)} style={styles.navBtn}><ChevronLeft size={16} color={month===10?'#c5ccbd':'#233d32'}/></Pressable><Text style={[styles.text,{fontSize:13,fontWeight:'500'}]}>{month===10?'October':'November'} 2026</Text><Pressable accessibilityLabel="Next month" disabled={month===11} onPress={()=>setMonth(11)} style={styles.navBtn}><ChevronRight size={16} color={month===11?'#c5ccbd':'#233d32'}/></Pressable></View>
  <View style={styles.grid}>{['S','M','T','W','T','F','S'].map((w,i)=><Text key={i} style={[styles.text,styles.cellHead]}>{w}</Text>)}
  {cells.map((d,i)=>d===null?<View key={`e${i}`} style={styles.cell}/>:<Pressable key={d} disabled={!enabled(d)} accessibilityRole="button" accessibilityLabel={`${month===10?'October':'November'} ${d}`} accessibilityState={{selected:picked(d),disabled:!enabled(d)}} onPress={()=>onPick(month===11?1:d)} style={styles.cell}><View style={[styles.dayDot,picked(d)&&styles.dayOn,month===10&&d===30&&!picked(d)&&styles.today]}><Text style={[styles.text,{fontSize:12,color:picked(d)?'white':enabled(d)?'#233d32':'#c3cabb'}]}>{d}</Text></View></Pressable>)}</View>
 </View>;
}
function TimeList({options,value,onPick}){
 const ref=useRef(null),idx=Math.max(0,options.findIndex(o=>o.value===value));
 return <ScrollView ref={ref} style={styles.timeList} nestedScrollEnabled showsVerticalScrollIndicator={false} onLayout={()=>ref.current?.scrollTo({y:Math.max(0,idx*38-76),animated:false})}>{options.map(o=><Pressable key={o.value} accessibilityRole="button" accessibilityState={{selected:o.value===value}} onPress={()=>onPick(o.value)} style={[styles.timeRow,o.value===value&&styles.timeOn]}><Text style={[styles.text,{fontSize:13,color:o.value===value?'#2f5a40':'#233d32',fontWeight:o.value===value?'600':'400'}]}>{o.label}</Text>{!!o.sub&&<Text style={[styles.text,{fontSize:11,color:'#8d9a85'}]}> ({o.sub})</Text>}</Pressable>)}</ScrollView>;
}
const PLACES=[{name:'Coffee Bean · HUB',sub:'2 min away'},{name:'Rivera Library',sub:'4 min away'},{name:'UCR Botanic Gardens',sub:'12 min away'},{name:'Arts Building · Room 204',sub:'6 min away'},{name:'SRC · Main entrance',sub:'8 min away'},{name:'The Habit',sub:'HUB food court'},{name:'Bell Tower lawn',sub:'3 min away'}];
function Chip({label,sub,on,onPress}){return <Pressable accessibilityRole="button" accessibilityState={{selected:on}} onPress={onPress} style={[styles.chip,on&&styles.chipOn]}><Text style={[styles.text,{fontSize:12,color:on?'white':'#233d32'}]}>{label}</Text>{!!sub&&<Text style={[styles.text,{fontSize:8,marginTop:3,color:on?'#d6e2d2':'#81917c'}]}>{sub}</Text>}</Pressable>}
function Chips({children,initial=0}){const ref=useRef(null);return <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} onLayout={()=>ref.current?.scrollTo({x:Math.max(0,initial),animated:false})} contentContainerStyle={{gap:7,paddingVertical:2,paddingRight:8}}>{children}</ScrollView>}

export default function DraftComposer({kind,person,day,people=[],onSubmit}){
 const isEvent=kind==='addEvent';
 const [title,setTitle]=useState('');
 const [body,setBody]=useState('');
 const [place,setPlace]=useState('');
 const [date,setDate]=useState(day>=26||day===1?day:30);
 const [startMin,setStartMin]=useState(12*60);
 const [length,setLength]=useState(60);
 const [panel,setPanel]=useState(null);
 const [invited,setInvited]=useState([]);
 const toggle=p=>setPanel(cur=>cur===p?null:p);
 const start=formatMinutes(startMin),end=formatMinutes(Math.min(startMin+length,24*60-1));
 const startOptions=Array.from({length:96},(_,i)=>({value:i*15,label:formatMinutes(i*15)}));
 const endOptions=Array.from({length:Math.floor((24*60-15-startMin)/15)},(_,i)=>(i+1)*15).map(l=>({value:l,label:formatMinutes(startMin+l),sub:durLabel(l)}));
 const placeMatches=PLACES.filter(x=>!place.trim()||x.name.toLowerCase().includes(place.trim().toLowerCase()));
 const invitedPeople=people.filter(p=>invited.includes(p.handle));
 const [privacy,setPrivacy]=useState('Inner circle');
 const [error,setError]=useState('');
 const send=()=>{
  if(!title.trim()){setError(isEvent?'Add an event name.':'Add a title.');return;}
  if(isEvent&&!place.trim()){setError('Pick a location.');setPanel('place');return;}
  onSubmit({title:title.trim(),body:body.trim(),place:place.trim(),day:date,time:start,end,privacy,...(isEvent&&{attendees:[person,...invitedPeople],organizer:person})});
 };
 return <View style={{gap:16,paddingTop:16}}>
 <GlassSurface style={styles.card}>
 <View style={styles.row}><View style={[styles.avatar,{backgroundColor:person.color}]}><Text style={styles.initial}>{person.initial}</Text></View><Text style={[styles.text,{fontSize:12,fontWeight:'600'}]}>@{person.handle}</Text><Text style={[styles.text,{fontSize:10,color:'#81917c'}]}>now</Text></View>
 <TextInput autoFocus value={title} onChangeText={value=>{setTitle(value);setError('')}} placeholder={isEvent?'Event name':kind==='discovery'?'What did you find?':'Title'} placeholderTextColor="#81917c" multiline style={styles.title}/>
 <TextInput value={body} onChangeText={setBody} placeholder={isEvent?'Add details…':'Write something…'} placeholderTextColor="#8d9a85" multiline style={styles.body}/>
 {isEvent&&<View style={{gap:14,paddingTop:13}}>
 <Pressable accessibilityRole="button" accessibilityLabel={`Date, ${dayLabel(date)}`} onPress={()=>toggle('date')} style={styles.fieldRow}><CalendarDays size={17} color="#768b72"/><Text style={[styles.text,styles.when,panel==='date'&&styles.whenOn]}>{dayLabel(date)}</Text></Pressable>
 {panel==='date'&&<MonthPicker value={date} onPick={d=>{setDate(d);setPanel(null)}}/>}
 <View style={styles.fieldRow}><Clock3 size={17} color="#768b72"/>
  <Pressable accessibilityRole="button" accessibilityLabel={`Start time, ${start}`} onPress={()=>toggle('start')}><Text style={[styles.text,styles.when,panel==='start'&&styles.whenOn]}>{start}</Text></Pressable>
  <Text style={[styles.text,{color:'#8d9a85',fontSize:13}]}>–</Text>
  <Pressable accessibilityRole="button" accessibilityLabel={`End time, ${end}`} onPress={()=>toggle('end')}><Text style={[styles.text,styles.when,panel==='end'&&styles.whenOn]}>{end}</Text></Pressable>
  <Text style={[styles.text,{fontSize:11,color:'#8d9a85',marginLeft:'auto'}]}>{durLabel(length)}</Text>
 </View>
 {panel==='start'&&<TimeList options={startOptions} value={startMin} onPick={v=>{setStartMin(v);setLength(l=>Math.min(l,24*60-15-v));setPanel(null)}}/>}
 {panel==='end'&&<TimeList options={endOptions} value={length} onPick={v=>{setLength(v);setPanel(null)}}/>}
 <View style={styles.fieldRow}><MapPin size={17} color="#768b72"/><TextInput accessibilityLabel="Event location" value={place} onFocus={()=>setPanel('place')} onChangeText={v=>{setPlace(v);setError('');setPanel('place')}} placeholder="Choose a location" placeholderTextColor="#8d9a85" style={styles.field}/>{!!place&&PLACES.some(x=>x.name===place)&&<Check size={14} color="#5f8268"/>}</View>
 {panel==='place'&&<Chips>{(placeMatches.length?placeMatches:PLACES).map(x=><Chip key={x.name} label={x.name.split(' · ')[0]} sub={x.sub} on={place===x.name} onPress={()=>{setPlace(x.name);setError('');setPanel(null)}}/>)}</Chips>}
 <Pressable accessibilityRole="button" accessibilityLabel={`Invite friends, ${invited.length} invited`} onPress={()=>toggle('invite')} style={styles.fieldRow}><UserPlus size={17} color="#768b72"/><Text style={[styles.text,styles.value,!invited.length&&{color:'#8d9a85'}]}>{invited.length?invitedPeople.map(p=>p.name.split(' ')[0]).join(', '):'Invite friends'}</Text><View style={styles.stack}>{invitedPeople.map((p,i)=><View key={p.handle} style={[styles.mini,{backgroundColor:p.color,marginLeft:i?-7:0}]}><Text style={{fontSize:9,color:'#503d32'}}>{p.initial}</Text></View>)}</View><ChevronDown size={14} color="#94a08c" style={panel==='invite'&&{transform:[{rotate:'180deg'}]}}/></Pressable>
 {panel==='invite'&&<View style={styles.inviteList}>{people.map((p,i)=>{const on=invited.includes(p.handle);return <Pressable key={p.handle} accessibilityRole="checkbox" accessibilityState={{checked:on}} accessibilityLabel={`Invite ${p.name}`} onPress={()=>setInvited(cur=>on?cur.filter(h=>h!==p.handle):[...cur,p.handle])} style={[styles.inviteRow,i>0&&{borderTopWidth:1,borderTopColor:'#ffffff80'}]}><View style={[styles.avatar,{backgroundColor:p.color,width:28,height:28}]}><Text style={[styles.initial,{fontSize:13}]}>{p.initial}</Text></View><Text style={[styles.text,{fontSize:12,flex:1}]}>{p.name}</Text><View style={[styles.check,on&&styles.checkOn]}>{on&&<Check size={10} color="white"/>}</View></Pressable>})}</View>}
 </View>}
 {!isEvent&&<View style={[styles.row,{paddingTop:17,gap:8}]}>{['Inner circle','Everyone'].map(option=><Pressable key={option} accessibilityRole="button" accessibilityState={{selected:privacy===option}} onPress={()=>setPrivacy(option)} style={[styles.privacy,privacy===option&&{backgroundColor:'#54725c25',borderColor:'#6d8e6d55'}]}><Text style={[styles.text,{fontSize:10}]}>{option}</Text></Pressable>)}</View>}
 </GlassSurface>
 {!!error&&<Text accessibilityRole="alert" style={[styles.text,{fontSize:12,color:'#925b49',paddingHorizontal:10}]}>{error}</Text>}
 <Pressable accessibilityRole="button" onPress={send}><GlassSurface style={styles.submit}>{isEvent?<CalendarDays size={17} color="#233d32"/>:<Send size={17} color="#233d32"/>}<Text style={[styles.text,{fontSize:13,fontWeight:'500'}]}>{isEvent?(invited.length?`Add & invite ${invited.length}`:'Add to agenda'):'Post'}</Text></GlassSurface></Pressable>
 </View>;
}
const styles=StyleSheet.create({text:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,color:'#233d32'},card:{padding:23,borderRadius:29,backgroundColor:'#ffffff60'},row:{flexDirection:'row',alignItems:'center',gap:9},avatar:{width:32,height:32,borderRadius:17,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#fff'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,color:'#503d32',fontSize:16},title:{fontSize:27,letterSpacing:-.7,lineHeight:34,color:'#233d32',marginTop:27,minHeight:42,...Platform.select({web:{outlineStyle:'none'}})},body:{fontSize:14,lineHeight:23,color:'#3e5746',marginTop:12,minHeight:100,textAlignVertical:'top',...Platform.select({web:{outlineStyle:'none'}})},fieldRow:{flexDirection:'row',alignItems:'center',gap:10},field:{fontSize:12,color:'#233d32',flex:1,minHeight:29,...Platform.select({web:{outlineStyle:'none'}})},privacy:{paddingHorizontal:13,paddingVertical:8,borderRadius:17,borderWidth:1,borderColor:'#ffffff80'},value:{fontSize:12,flex:1},pill:{paddingHorizontal:11,paddingVertical:6,borderRadius:14,backgroundColor:'#ffffff70',borderWidth:1,borderColor:'#ffffffaa'},pillOn:{borderColor:'#6d8e6d88',backgroundColor:'#ffffffd0'},chip:{minWidth:46,paddingHorizontal:12,paddingVertical:8,borderRadius:14,backgroundColor:'#ffffff70',borderWidth:1,borderColor:'#ffffffaa',alignItems:'center'},chipOn:{backgroundColor:'#3f6a50',borderColor:'#3f6a50'},stack:{flexDirection:'row'},mini:{width:20,height:20,borderRadius:10,borderWidth:1.5,borderColor:'white',alignItems:'center',justifyContent:'center'},inviteList:{borderRadius:18,backgroundColor:'#ffffff45',paddingHorizontal:12},inviteRow:{flexDirection:'row',alignItems:'center',gap:10,paddingVertical:9},check:{width:18,height:18,borderRadius:9,borderWidth:1.5,borderColor:'#c3cbb8',alignItems:'center',justifyContent:'center'},checkOn:{backgroundColor:'#3f6a50',borderColor:'#3f6a50'},whenRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:27,marginTop:-4},when:{fontSize:14,paddingVertical:4,paddingHorizontal:6,marginHorizontal:-6,borderRadius:8},whenOn:{backgroundColor:'#3f6a5014',color:'#2f5a40'},toggle:{marginLeft:'auto',width:36,height:20,borderRadius:10,padding:2,backgroundColor:'#cfd6c6',justifyContent:'center'},knob:{width:16,height:16,borderRadius:8,backgroundColor:'white',boxShadow:'0px 1px 2px #00000025'},month:{marginLeft:27,padding:12,borderRadius:18,backgroundColor:'#ffffff55'},navBtn:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center'},grid:{flexDirection:'row',flexWrap:'wrap'},cellHead:{width:`${100/7}%`,textAlign:'center',fontSize:9,color:'#8d9a85',marginBottom:6},cell:{width:`${100/7}%`,alignItems:'center',paddingVertical:2},dayDot:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'},dayOn:{backgroundColor:'#3f6a50'},today:{borderWidth:1,borderColor:'#3f6a50'},timeList:{marginLeft:27,maxHeight:190,borderRadius:16,backgroundColor:'#ffffff55'},timeRow:{height:38,paddingHorizontal:14,flexDirection:'row',alignItems:'center'},timeOn:{backgroundColor:'#3f6a5016'},submit:{height:48,borderRadius:24,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9}});
