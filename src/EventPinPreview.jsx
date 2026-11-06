import React from 'react';
import {StyleSheet,View} from 'react-native';
import {CalendarDays,Coffee,Dumbbell,Sparkles,Trees} from 'lucide-react-native';
import {pinIconFor,timing} from './campusData';
import {eventMinutes} from './agenda';
const icons={coffee:Coffee,walk:Trees,design:Sparkles,gym:Dumbbell,event:CalendarDays};
export default function EventPinPreview({event}){
 const Icon=icons[pinIconFor(event)];
 const color=timing(event,eventMinutes(event.time)??0,eventMinutes(event.end)).color;
 return <View accessibilityLabel={`Map pin for ${event.title}`} style={styles.preview}>
  <View style={[styles.road,{width:15,height:130,left:31,top:-20,transform:[{rotate:'19deg'}]}]}/>
  <View style={[styles.road,{width:110,height:10,left:-15,top:48,transform:[{rotate:'-24deg'}]}]}/>
  <View style={styles.marker}><View style={[styles.drop,{backgroundColor:color}]}/><Icon size={19} color="white" strokeWidth={2.2} style={{position:'absolute',top:8,left:8}}/></View>
 </View>;
}
const styles=StyleSheet.create({preview:{width:74,height:88,borderRadius:17,backgroundColor:'#e7ecde',overflow:'hidden',borderWidth:1,borderColor:'#ffffffd9',alignItems:'center',justifyContent:'center'},road:{position:'absolute',backgroundColor:'#f9f9f1',borderWidth:1,borderColor:'#d6ddcd'},marker:{width:36,height:46},drop:{width:36,height:36,borderRadius:18,borderBottomLeftRadius:0,transform:[{rotate:'-45deg'}],borderWidth:2,borderColor:'white',boxShadow:'0px 3px 8px rgba(20,30,20,.35)'}});
