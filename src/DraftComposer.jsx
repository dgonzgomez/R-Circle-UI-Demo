import React,{useState} from 'react';
import {Platform,StyleSheet,Text,TextInput,View} from 'react-native';
import {CalendarDays,Clock3,MapPin,Send} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';

export default function DraftComposer({kind,person,day,onSubmit}){
 const isEvent=kind==='addEvent';
 const [title,setTitle]=useState('');
 const [body,setBody]=useState('');
 const [place,setPlace]=useState('');
 const [date,setDate]=useState(String(day));
 const [start,setStart]=useState('12:00 PM');
 const [end,setEnd]=useState('1:00 PM');
 const [privacy,setPrivacy]=useState('Inner circle');
 const [error,setError]=useState('');
 const send=()=>{
  if(!title.trim()){setError(isEvent?'Add an event name.':'Add a title.');return;}
  if(isEvent&&(!place.trim()||!start.trim()||!end.trim()||!/^\d+$/.test(date)||Number(date)<1||Number(date)>31)){
   setError('Add a location, start and end times, and a date from October 1–31.');return;
  }
  onSubmit({title:title.trim(),body:body.trim(),place:place.trim(),day:Number(date),time:start.trim(),end:end.trim(),privacy});
 };
 return <View style={{gap:16,paddingTop:16}}>
 <GlassSurface style={styles.card}>
 <View style={styles.row}><View style={[styles.avatar,{backgroundColor:person.color}]}><Text style={styles.initial}>{person.initial}</Text></View><Text style={[styles.text,{fontSize:12,fontWeight:'600'}]}>@{person.handle}</Text><Text style={[styles.text,{fontSize:10,color:'#81917c'}]}>now</Text></View>
 <TextInput autoFocus value={title} onChangeText={value=>{setTitle(value);setError('')}} placeholder={isEvent?'Event name':kind==='discovery'?'What did you find?':'Title'} placeholderTextColor="#81917c" multiline style={styles.title}/>
 <TextInput value={body} onChangeText={setBody} placeholder={isEvent?'Add details…':'Write something…'} placeholderTextColor="#8d9a85" multiline style={styles.body}/>
 {isEvent&&<View style={{gap:18,paddingTop:13}}>
 <View style={styles.fieldRow}><CalendarDays size={17} color="#768b72"/><Text style={[styles.text,{fontSize:12}]}>October</Text><TextInput accessibilityLabel="Event day in October" keyboardType="number-pad" value={date} onChangeText={setDate} style={[styles.field,{maxWidth:44}]}/><Text style={[styles.text,{fontSize:12}]}>2026</Text></View>
 <View style={styles.fieldRow}><Clock3 size={17} color="#768b72"/><TextInput accessibilityLabel="Event start time" value={start} onChangeText={setStart} placeholder="Start time" style={styles.field}/><Text style={[styles.text,{color:'#8d9a85'}]}>to</Text><TextInput accessibilityLabel="Event end time" value={end} onChangeText={setEnd} placeholder="End time" style={styles.field}/></View>
 <View style={styles.fieldRow}><MapPin size={17} color="#768b72"/><TextInput accessibilityLabel="Event location" value={place} onChangeText={setPlace} placeholder="Location" placeholderTextColor="#8d9a85" style={styles.field}/></View>
 </View>}
 {!isEvent&&<View style={[styles.row,{paddingTop:17,gap:8}]}>{['Inner circle','Everyone'].map(option=><Pressable key={option} accessibilityRole="button" accessibilityState={{selected:privacy===option}} onPress={()=>setPrivacy(option)} style={[styles.privacy,privacy===option&&{backgroundColor:'#54725c25',borderColor:'#6d8e6d55'}]}><Text style={[styles.text,{fontSize:10}]}>{option}</Text></Pressable>)}</View>}
 </GlassSurface>
 {!!error&&<Text accessibilityRole="alert" style={[styles.text,{fontSize:12,color:'#925b49',paddingHorizontal:10}]}>{error}</Text>}
 <Pressable accessibilityRole="button" onPress={send}><GlassSurface style={styles.submit}>{isEvent?<CalendarDays size={17} color="#233d32"/>:<Send size={17} color="#233d32"/>}<Text style={[styles.text,{fontSize:13,fontWeight:'500'}]}>{isEvent?'Add to agenda':'Post'}</Text></GlassSurface></Pressable>
 </View>;
}
const styles=StyleSheet.create({text:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,color:'#233d32'},card:{padding:23,borderRadius:29,backgroundColor:'#ffffff60'},row:{flexDirection:'row',alignItems:'center',gap:9},avatar:{width:32,height:32,borderRadius:17,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#fff'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,color:'#503d32',fontSize:16},title:{fontSize:27,letterSpacing:-.7,lineHeight:34,color:'#233d32',marginTop:27,minHeight:42,...Platform.select({web:{outlineStyle:'none'}})},body:{fontSize:14,lineHeight:23,color:'#3e5746',marginTop:12,minHeight:100,textAlignVertical:'top',...Platform.select({web:{outlineStyle:'none'}})},fieldRow:{flexDirection:'row',alignItems:'center',gap:10},field:{fontSize:12,color:'#233d32',flex:1,minHeight:29,...Platform.select({web:{outlineStyle:'none'}})},privacy:{paddingHorizontal:13,paddingVertical:8,borderRadius:17,borderWidth:1,borderColor:'#ffffff80'},submit:{height:48,borderRadius:24,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9}});
