import React from 'react';
import {Image,StyleSheet,Text,View} from 'react-native';
import {CalendarDays,Check,Clock3,MapPin,Plus,Pencil,Trash2} from 'lucide-react-native';
import GlassSurface from './GlassSurface';
import Pressable from './TransitionPressable';
import EventPinPreview from './EventPinPreview';
import {eventMinutes} from './agenda';
export default function EventDetails({event,people,day,joined,onJoin,onDecline,fromAgenda=false,onEdit,onDelete}){
 const minutes=eventMinutes(event.time);const hour=minutes===null?null:Math.floor(minutes/60);
 return <View style={{gap:15}}>
 {event.pending&&<GlassSurface style={[styles.card,{backgroundColor:'#f3dfc6d9',borderColor:'#d4a978'}]}><Text style={{fontSize:12,color:'#795130'}}>Invitation from {event.invitedBy.name}</Text></GlassSurface>}
 {!!event.img&&<Image source={{uri:event.img}} style={styles.hero}/>}
 <GlassSurface style={styles.card}><View style={styles.header}><View style={styles.time}><Text style={styles.hour}>{hour===null?'':hour%12||12}</Text><Text style={styles.period}>{hour===null?'':hour>=12?'PM':'AM'}</Text></View><View style={{flex:1}}><Text style={styles.title}>{event.title}</Text><View style={[styles.row,{marginTop:11}]}><Clock3 size={13} color="#829078"/><Text style={[styles.small,{flex:1}]}>{event.time} – {event.end}</Text></View><View style={[styles.row,{marginTop:8}]}><MapPin size={13} color="#829078"/><Text style={[styles.small,{flex:1}]}>{event.place}</Text></View></View><EventPinPreview event={event}/></View></GlassSurface>
 <GlassSurface style={styles.card}><View style={styles.row}><CalendarDays size={16} color="#55715b"/><Text style={styles.body}>{event.dateLabel?`${event.dateLabel}, 2026`:`${(event.day||day)===1?'November 1':`October ${event.day||day}`}, 2026`}</Text></View>{!!event.desc&&<Text style={[styles.body,{marginTop:15,lineHeight:22}]}>{event.desc}</Text>}</GlassSurface>
 <GlassSurface style={styles.card}><Text style={styles.label}>Going</Text>{(event.attendees||people).map(person=><View key={person.handle} style={[styles.row,{paddingTop:14}]}><View style={[styles.avatar,{backgroundColor:person.color}]}>{person.avatar?<Image source={{uri:person.avatar}} style={{width:'100%',height:'100%',borderRadius:17}}/>:<Text style={{fontSize:16,color:'#503d32'}}>{person.initial}</Text>}</View><Text style={[styles.body,{flex:1}]}>{person.name}</Text>{event.organizer?.handle===person.handle&&<Text style={styles.small}>Organizer</Text>}</View>)}</GlassSurface>
 {fromAgenda&&joined&&!event.pending?<View style={{flexDirection:'row',gap:10}}>
  <Pressable accessibilityRole="button" accessibilityLabel="Edit event" onPress={onEdit} style={{flex:1}}><GlassSurface style={styles.join}><Pencil size={16} color="white"/><Text style={{fontSize:13,color:'white',fontWeight:'500'}}>Edit</Text></GlassSurface></Pressable>
  <Pressable accessibilityRole="button" accessibilityLabel="Delete event" onPress={onDelete} style={{flex:1}}><GlassSurface style={[styles.join,{backgroundColor:'#f2ddd5cc',borderColor:'#ffffffb0'}]}><Trash2 size={16} color="#a3513e"/><Text style={{fontSize:13,color:'#a3513e',fontWeight:'500'}}>Delete</Text></GlassSurface></Pressable>
 </View>:<Pressable accessibilityRole="button" onPress={onJoin}><GlassSurface style={[styles.join,joined&&{backgroundColor:'#dce8d6'}]}>{joined?<Check size={17} color="#31533f"/>:<Plus size={17} color="white"/>}<Text style={{fontSize:13,fontWeight:'500',color:joined?'#31533f':'white'}}>{joined?'In your agenda':event.pending?'Accept invitation':event.fromThread?'Create event':'Add to agenda'}</Text></GlassSurface></Pressable>}

 {event.pending&&<Pressable accessibilityRole="button" onPress={onDecline} style={{alignItems:'center',padding:12}}><Text style={{fontSize:13,color:'#795130'}}>Decline invitation</Text></Pressable>}
 </View>;
}
const styles=StyleSheet.create({hero:{width:'100%',height:180,borderRadius:24},card:{borderRadius:24,padding:19},header:{flexDirection:'row',alignItems:'center',gap:10},time:{width:28,alignItems:'center'},hour:{fontSize:27,color:'#233d32',fontWeight:'500'},period:{fontSize:9,color:'#829078',marginTop:3},title:{fontSize:18,lineHeight:25,color:'#233d32',letterSpacing:-.4},row:{flexDirection:'row',alignItems:'center',gap:8},small:{fontSize:10,color:'#829078',lineHeight:16},body:{fontSize:13,color:'#233d32'},label:{fontSize:12,fontWeight:'500',color:'#233d32'},avatar:{width:33,height:33,borderRadius:17,borderWidth:1.5,borderColor:'white',alignItems:'center',justifyContent:'center'},join:{minHeight:48,borderRadius:24,backgroundColor:'#31533f',flexDirection:'row',gap:8,alignItems:'center',justifyContent:'center'}});
