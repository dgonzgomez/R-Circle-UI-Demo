import React from 'react';
import {Image,Platform,StyleSheet,Text,View} from 'react-native';
import {Footprints,MapPin,Plus} from 'lucide-react-native';
import GlassSurface from './GlassSurface';
import Pressable from './TransitionPressable';

const ink='#233d32';
function describe(name){
 if(/Coffee/i.test(name))return {title:'Coffee Bean',image:'coffee',body:'Coffee, drinks, and outdoor seating. Maya is here right now.',busy:'Not too busy',match:/Coffee/i};
 if(/Library/i.test(name))return {title:'Rivera Library',image:'library',body:'The second floor has open seats and study areas.',busy:'Moderately busy',match:/Library/i};
 if(/Habit/i.test(name))return {title:name,image:'burger',body:'Charburgers, sandwiches, and sides on campus.',busy:'Not too busy'};
 if(name==='SRC'||/Recreation/i.test(name))return {title:'Student Recreation Center',body:'Campus gym, courts, and recreation facilities. Meet at the main entrance.',busy:'Not too busy'};
 return {title:name,image:'garden',body:'Walking trails and shaded areas at the UCR Botanic Gardens.',busy:'Not too busy'};
}
export default function PlaceDetails({name,photos,people,onAdd}){
 const place=describe(name);
 const here=place.match?people.filter(person=>place.match.test(person.where)):[];
 return <>
  <GlassSurface style={styles.photo}>{place.image?<Image source={{uri:photos[place.image]}} style={styles.image}/>:<View style={styles.iconFill}><Footprints size={46} color={ink} strokeWidth={1.6}/></View>}</GlassSurface>
  <GlassSurface style={styles.block}>
   <Text style={styles.title}>{place.title}</Text>
   <View style={[styles.row,{marginTop:10}]}><MapPin size={14} color="#829078"/><Text style={styles.meta}>UC Riverside · A few minutes away</Text></View>
   <Text style={styles.description}>{place.body}</Text>
  </GlassSurface>
  <GlassSurface style={styles.block}>
   <Text style={styles.label}>Right now</Text>
   <View style={[styles.row,{marginTop:12}]}><View style={styles.dot}/><Text style={styles.line}>Open now · {place.busy}</Text></View>
   {here.map(person=><View key={person.handle} style={[styles.row,{marginTop:14}]}><View style={[styles.avatar,{backgroundColor:person.color}]}>{person.avatar?<Image source={{uri:person.avatar}} style={styles.avatarImage}/>:<Text style={styles.initial}>{person.initial}</Text>}</View><Text style={[styles.line,{flex:1}]}>{person.name}</Text><Text style={styles.meta}>Here</Text></View>)}
  </GlassSurface>
  <Pressable accessibilityRole="button" accessibilityLabel={`Add a visit to ${place.title}`} onPress={onAdd}><GlassSurface style={styles.add}><Plus size={17} color={ink}/><Text style={styles.addLabel}>Add a visit to my agenda</Text></GlassSurface></Pressable>
 </>;
}
const styles=StyleSheet.create({
 photo:{borderRadius:25},
 image:{width:'100%',height:220},
 iconFill:{height:168,alignItems:'center',justifyContent:'center'},
 block:{borderRadius:25,padding:19},
 title:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,fontSize:22,letterSpacing:-.6,color:ink},
 row:{flexDirection:'row',alignItems:'center',gap:8},
 meta:{fontSize:12,color:'#829078'},
 description:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,fontSize:13,lineHeight:21,color:'#74816e',marginTop:12},
 line:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,fontSize:13,color:ink},
 label:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,fontSize:12,fontWeight:'600',color:ink},
 dot:{width:6,height:6,borderRadius:3,backgroundColor:'#8eaa78'},
 avatar:{width:33,height:33,borderRadius:17,alignItems:'center',justifyContent:'center',overflow:'hidden'},
 avatarImage:{width:'100%',height:'100%'},
 initial:{fontSize:15,color:'#503d32'},
 add:{borderRadius:23,minHeight:48,flexDirection:'row',gap:9,alignItems:'center',justifyContent:'center'},
 addLabel:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,fontSize:13,color:ink}
});
