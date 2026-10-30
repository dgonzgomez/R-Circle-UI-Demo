import React from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {Clock3,MapPin,MessageCircle,Phone} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
export default function MapFriendDetails({person,day,onCall,onMessage,onSuggestions}){
 return <>
 <View style={styles.row}>{[{label:'Call',Icon:Phone,action:onCall},{label:'Message',Icon:MessageCircle,action:onMessage}].map(({label,Icon,action})=><Pressable key={label} accessibilityRole="button" onPress={action} style={{flex:1}}><GlassSurface style={styles.action}><Icon size={20} color="#31533f"/><Text style={styles.actionText}>{label}</Text></GlassSurface></Pressable>)}</View>
 <GlassSurface style={styles.card}><View style={[styles.row,{justifyContent:'space-between'}]}><Text style={[styles.name,{flex:1}]}>{person.name}</Text></View><Text style={styles.handle}>@{person.handle}</Text><View style={[styles.row,{marginTop:18}]}><MapPin size={16} color="#7b8c73"/><Text style={styles.text}>{person.where}</Text></View><View style={[styles.row,{marginTop:12}]}><Clock3 size={16} color="#7b8c73"/><Text style={styles.text}>Updated just now</Text></View></GlassSurface>
 <Pressable accessibilityRole="button" accessibilityLabel={`Find events while you and ${person.name.split(' ')[0]} are free, 3 to 5 PM`} onPress={onSuggestions} style={styles.freeSlot}><Text style={{fontSize:11,color:'#7e9074'}}>Both free today · 3–5 PM</Text></Pressable>
 </>;
}
const styles=StyleSheet.create({freeSlot:{minHeight:112,borderRadius:24,borderWidth:1.5,borderStyle:'dotted',borderColor:'#9eaf94',padding:18,backgroundColor:'#ffffff12'},row:{flexDirection:'row',alignItems:'center',gap:12},action:{height:65,borderRadius:23,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9},actionText:{fontSize:13,color:'#31533f'},card:{padding:20,borderRadius:25},name:{fontSize:20,color:'#233d32',letterSpacing:-.5},handle:{fontSize:11,color:'#809077',marginTop:7},text:{fontSize:12,color:'#233d32'}});
