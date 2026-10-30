import React from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {Coffee,Sparkles,Trees} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
import {groupAgenda} from './agenda';
export default function AgendaBlocks({events,onOpen}){
 return <View style={{gap:12,marginTop:6}}>{groupAgenda(events).map(group=><GlassSurface key={group.hour} style={styles.block}>
 <View style={styles.hour}><Text style={styles.hourNumber}>{group.hour==='other'?'':group.hour%12||12}</Text><Text style={styles.period}>{group.hour==='other'?'':group.hour>=12?'PM':'AM'}</Text></View>
 <View style={{flex:1}}>{group.events.map((event,index)=>{const Icon=event.kind==='coffee'?Coffee:event.kind==='walk'?Trees:Sparkles;return <Pressable key={`${event.title}-${event.time}-${index}`} accessibilityRole="button" accessibilityLabel={`${event.title}, ${event.time}`} onPress={()=>onOpen(event)} style={[styles.event,index>0&&styles.divider]}><View style={styles.icon}><Icon size={16} color="#41604b"/></View><View style={{flex:1}}><Text style={styles.title}>{event.title}</Text><Text style={styles.details}>{event.time} · {event.place.split(' · ')[0]}</Text></View></Pressable>})}</View>
 </GlassSurface>)}</View>;
}
const styles=StyleSheet.create({block:{borderRadius:20,paddingHorizontal:14,flexDirection:'row',gap:12},hour:{width:27,alignItems:'center',justifyContent:'center'},hourNumber:{fontSize:19,fontWeight:'500',color:'#233d32'},period:{fontSize:8,color:'#819078',marginTop:3},event:{minHeight:60,flexDirection:'row',alignItems:'center',gap:9,paddingVertical:10},icon:{width:28,height:28,borderRadius:10,backgroundColor:'#ffffff40',alignItems:'center',justifyContent:'center'},title:{fontSize:12,fontWeight:'500',color:'#233d32'},details:{fontSize:9,color:'#819078',marginTop:5,lineHeight:13},divider:{borderTopWidth:1,borderTopColor:'#ffffff80'}});
