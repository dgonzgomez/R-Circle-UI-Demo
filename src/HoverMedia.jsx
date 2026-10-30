import React,{useEffect,useRef,useState} from 'react';
import {Animated,BackHandler,Image,Platform,Pressable,StyleSheet,Text,View} from 'react-native';
import GlassSurface from './GlassSurface';
export default function HoverMedia({item,type,size,onClose,onPlace}){
 const show=useRef(new Animated.Value(0)).current;
 const [ratio,setRatio]=useState(1.4);
 useEffect(()=>{
  let active=true;
  Image.getSize(item.image,(width,height)=>{if(active&&height)setRatio(width/height)},()=>{});
  Animated.spring(show,{toValue:1,stiffness:250,damping:25,mass:.7,useNativeDriver:true}).start();
  const handler=Platform.OS==='web'?null:BackHandler.addEventListener('hardwareBackPress',()=>{close();return true});
  return()=>{active=false;handler?.remove();show.stopAnimation()};
 },[]);
 const close=()=>Animated.timing(show,{toValue:0,duration:140,useNativeDriver:true}).start(({finished})=>{if(finished)onClose()});
 const height=Math.min((size.width-40)/ratio,size.height-(type==='foods'?210:125));
 return <View style={[StyleSheet.absoluteFillObject,{zIndex:2}]} accessibilityViewIsModal>
 <Animated.View style={[StyleSheet.absoluteFillObject,{opacity:show}]}><GlassSurface style={[StyleSheet.absoluteFillObject,{backgroundColor:'#e5ecdf66',backdropFilter:'blur(24px) saturate(120%)',WebkitBackdropFilter:'blur(24px) saturate(120%)'}]}/><Pressable accessibilityLabel="Close picture preview" style={StyleSheet.absoluteFillObject} onPress={close}/></Animated.View>
 <Animated.View style={{position:'absolute',left:20,right:20,top:64,opacity:show,transform:[{scale:show.interpolate({inputRange:[0,1],outputRange:[.94,1]})}]}}>
 <GlassSurface frosted style={{borderRadius:27}}><Image source={{uri:item.image}} resizeMode="contain" style={{height,width:'100%'}}/>{type==='foods'&&<View style={{padding:18,gap:8}}><Text style={{fontSize:20,color:'#233d32'}}>{item.name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`View ${item.place}`} onPress={()=>onPlace?.(item.place)}><Text style={{fontSize:12,color:'#55745c'}}>View {item.place}</Text></Pressable></View>}</GlassSurface>
 </Animated.View></View>;
}
