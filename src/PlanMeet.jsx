import React,{useState} from 'react';
import {Platform,StyleSheet,Text,TextInput,View} from 'react-native';
import {CalendarPlus,Clock3,MapPin} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
const ink='#1c3d4e',muted='#557684',blue='#23bae7';
// Name a meetup with a friend and drop it into the agenda (demo: lunch at The Habit).
export default function PlanMeet({person,place='The Habit',time='12:00 PM',end='1:00 PM',onAdd}){
 const first=person.name.split(' ')[0];
 const [name,setName]=useState(`${place} with ${first}`);
 const add=()=>onAdd({title:name.trim()||`${place} with ${first}`,time,end});
 return <View style={{gap:14}}>
  <Text style={styles.heading}>Add to agenda</Text>
  <GlassSurface style={styles.card}>
   <Text style={styles.label}>MEETING NAME</Text>
   <TextInput accessibilityLabel="Meeting name" value={name} onChangeText={setName} onSubmitEditing={add} autoFocus selectTextOnFocus style={styles.input}/>
   <View style={[styles.row,{marginTop:16}]}><Clock3 size={15} color={muted}/><Text style={styles.text}>Today · {time} – {end}</Text></View>
   <View style={[styles.row,{marginTop:10}]}><MapPin size={15} color={muted}/><Text style={styles.text}>{place} · HUB</Text></View>
   <View style={[styles.row,{marginTop:16}]}><View style={[styles.avatar,{backgroundColor:person.color}]}><Text style={styles.initial}>{person.initial}</Text></View><Text style={styles.text}>With {person.name}</Text></View>
  </GlassSurface>
  <Pressable accessibilityRole="button" onPress={add} style={({pressed})=>[styles.button,pressed&&{opacity:.8}]}><CalendarPlus size={18} color="white"/><Text style={styles.buttonText}>Add to agenda</Text></Pressable>
 </View>;
}
const styles=StyleSheet.create({heading:{fontSize:27,letterSpacing:-.9,color:ink,marginTop:16},card:{padding:20,borderRadius:25},label:{fontSize:8,letterSpacing:1.35,fontWeight:'600',color:muted},input:{fontSize:20,letterSpacing:-.4,color:ink,marginTop:8,paddingVertical:6,borderBottomWidth:1,borderBottomColor:'#bfe3ee',...Platform.select({web:{outlineStyle:'none'}})},row:{flexDirection:'row',alignItems:'center',gap:10},text:{fontSize:13,color:ink},avatar:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:'#fff'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,fontSize:13,color:'#503d32'},button:{height:54,borderRadius:27,backgroundColor:blue,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,boxShadow:'inset 0px 1px 2px #ffffff66, 0px 8px 20px #1d8fb540'},buttonText:{color:'white',fontSize:15,fontWeight:'600'}});
