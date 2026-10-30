import Pressable from './TransitionPressable';
import React,{useState} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {CalendarDays,Check,ChevronRight,Clock3,Coffee,Trees} from 'lucide-react-native';
import GlassSurface from './GlassSurface';
const ink='#233d32';
export default function AvailabilityView({people,me,day,onSelect,suggestionsOnly,range}) {
 const [selected,setSelected]=useState(people.slice(0,2).map(p=>p.handle));
 const [selectedDay,setSelectedDay]=useState(day);
 const members=[me,...people.filter(p=>selected.includes(p.handle))];
 const start=selected.includes('sofiapark')?'4:00 PM':'3:00 PM';
 const friend=typeof range==='object'?range?.person:null;
 const rangeLabel=typeof range==='string'?range:range?.range;
 const slots=[{title:friend?`Coffee with ${friend.name.split(' ')[0]}`:'Coffee with friends',time:suggestionsOnly?'3:30 PM':start,end:'4:15 PM',place:'Coffee Bean · HUB',kind:'coffee',desc:'Meet friends for coffee.',day:selectedDay},{title:'Walk with friends',time:'4:00 PM',end:'5:00 PM',place:'UCR Botanic Gardens',kind:'walk',desc:'Meet at the gardens entrance.',day:selectedDay},...(friend?[{title:'Campus art pop-up',time:'3:15 PM',end:'4:00 PM',place:'Arts Building · Atrium',kind:'design',desc:'Browse student work during your shared free time.',day:selectedDay}]:[])];
 return <View style={{gap:16}}>
 {!suggestionsOnly&&<GlassSurface style={styles.card}>
 <View style={styles.people}>{people.map(p=><Pressable key={p.handle} accessibilityRole="checkbox" accessibilityState={{checked:selected.includes(p.handle)}} accessibilityLabel={`Compare schedule with ${p.name}`} onPress={()=>setSelected(selected.includes(p.handle)?selected.filter(h=>h!==p.handle):[...selected,p.handle])} style={styles.person}><View style={[styles.avatar,{backgroundColor:p.color,borderColor:selected.includes(p.handle)?'#557863':'#ffffff80'}]}><Text style={{fontSize:20,color:ink}}>{p.initial}</Text>{selected.includes(p.handle)&&<View style={styles.selected}><Check size={8} color="white"/></View>}</View><Text style={styles.personName}>{p.name.split(' ')[0]}</Text></Pressable>)}</View>
 <View style={[styles.row,{justifyContent:'space-between',marginTop:24}]}>{[day,day+1,day+2].map((d,i)=><Pressable key={d} onPress={()=>setSelectedDay(d)} style={[styles.date,selectedDay===d&&{backgroundColor:'#ffffffa0',borderColor:'#ffffff'}]}><Text style={styles.small}>{['Fri','Sat','Sun'][i]}</Text><Text style={{fontSize:19,color:ink,marginTop:7}}>{d>31?d-31:d}</Text></Pressable>)}</View>
 </GlassSurface>}
 <GlassSurface style={styles.card}><View style={[styles.row,{justifyContent:'space-between',marginBottom:21}]}><View style={styles.row}><Clock3 size={15} color={ink}/><Text style={{fontSize:13,color:ink}}>{suggestionsOnly?rangeLabel:`${start} – 5:00 PM`}</Text></View><Check size={16} color="#53765e"/></View>
 {!suggestionsOnly&&<View><View style={[styles.row,{paddingLeft:38,marginBottom:12}]}>{members.map(p=><Text key={p.handle} style={{flex:1,fontSize:10,textAlign:'center',color:'#71826c'}}>{p.handle===me.handle?'You':p.name.split(' ')[0]}</Text>)}</View>{['2 PM','3 PM','4 PM','5 PM'].map((time,index)=><View key={time} style={[styles.row,{height:39,gap:8}]}><Text style={{fontSize:9,width:30,color:'#889681'}}>{time}</Text>{members.map((p,i)=><View key={p.handle} style={{flex:1,height:31,borderRadius:9,backgroundColor:index===1||index===2?'#82a38d45':(i+index)%2===0?'#d2bcab66':'#ffffff25',borderWidth:1,borderColor:index===1||index===2?'#71947c55':'#ffffff70'}}/>)}</View>)}</View>}
 </GlassSurface>
 {slots.map(slot=><Pressable key={slot.title} onPress={()=>onSelect(slot)} accessibilityRole="button"><GlassSurface style={[styles.card,styles.row]}>{slot.kind==='coffee'?<Coffee size={22} color={ink}/>:<Trees size={22} color={ink}/>}<View style={{flex:1}}><Text style={{fontSize:14,color:ink}}>{slot.title}</Text><Text style={[styles.small,{marginTop:7}]}>{slot.time} · {slot.place.split(' · ')[0]}</Text></View><ChevronRight size={17} color="#84917c"/></GlassSurface></Pressable>)}
 </View>;
}
const styles=StyleSheet.create({card:{borderRadius:26,padding:21},row:{flexDirection:'row',gap:12,alignItems:'center'},people:{flexDirection:'row',gap:23},person:{alignItems:'center'},avatar:{width:48,height:48,borderRadius:25,borderWidth:2,alignItems:'center',justifyContent:'center'},selected:{position:'absolute',bottom:-1,right:-1,width:15,height:15,borderRadius:8,backgroundColor:'#557863',alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#edf1e7'},personName:{fontSize:10,color:'#71826c',marginTop:8},date:{flex:1,alignItems:'center',padding:12,borderWidth:1,borderColor:'transparent',borderRadius:17},small:{fontSize:10,color:'#829077'}});
