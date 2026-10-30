import React from 'react';
import {Image,StyleSheet,Text,View} from 'react-native';
import {MapPin} from 'lucide-react-native';
import ExpansionScreen from './ExpansionScreen';
import GlassSurface from './GlassSurface';
import Pressable from './TransitionPressable';
export default function CollectionFocus({focus,data,size,onSelect,onAction,onClose}){
 const selected=focus.selection||0;
 const indexed=data.items.map((item,index)=>({item,index}));
 const items=[...indexed.slice(selected),...indexed.slice(0,selected)];
 return <ExpansionScreen origin={focus.bounds} size={size} backdrop="blur" onClose={onClose} label={data.title}>
 {items.map(({item,index})=><GlassSurface key={index} style={styles.card}>
 <Image source={{uri:item.image}} style={focus.type==='photos'?styles.photo:styles.food}/>
 {focus.type==='foods'&&<View style={{padding:18,gap:9}}><Text style={styles.name}>{item.name}</Text><Text style={styles.place}>{item.place}</Text><Pressable accessibilityRole="button" accessibilityLabel={`View ${item.place}`} onPress={()=>onAction(index)} style={styles.placeLink}><MapPin size={15} color="#31533f"/><Text style={{fontSize:12,color:'#31533f'}}>View place</Text></Pressable></View>}
 </GlassSurface>)}
 </ExpansionScreen>;
}
const styles=StyleSheet.create({card:{borderRadius:27,overflow:'hidden'},photo:{width:'100%',aspectRatio:1},food:{width:'100%',height:235,backgroundColor:'#ffffff55'},name:{fontSize:21,color:'#233d32',letterSpacing:-.4},place:{fontSize:12,color:'#7e8979'},placeLink:{flexDirection:'row',gap:7,alignItems:'center',paddingTop:8,paddingBottom:2}});
