import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,Easing,Platform,Pressable,StyleSheet,View} from 'react-native';
import GlassSurface from './GlassSurface';
function FrostLayer({on,deep}){
 const [shown,setShown]=useState(false);
 useEffect(()=>{const id=setTimeout(()=>setShown(on),16);return()=>clearTimeout(id)},[on]);
 return <View pointerEvents="none" style={[StyleSheet.absoluteFillObject,styles.webBase,shown?(deep?styles.deep:styles.frost):styles.off]}/>;
}
export default function SearchOverlay({visible,onDismiss,children,deep=false}){
 const [mounted,setMounted]=useState(visible);
 const progress=useRef(new Animated.Value(visible?1:0)).current;
 const active=useRef(visible);active.current=visible;
 const reduced=useRef(false);
 useEffect(()=>{AccessibilityInfo.isReduceMotionEnabled().then(value=>{reduced.current=value}).catch(()=>{})},[]);
 useEffect(()=>{
  if(visible)setMounted(true);
  const motion=Animated.timing(progress,{toValue:visible?1:0,duration:reduced.current?0:visible?220:150,easing:Easing.bezier(.2,.75,.25,1),useNativeDriver:true});
  motion.start(({finished})=>{if(finished&&!active.current)setMounted(false)});
  return()=>motion.stop();
 },[visible]);
 if(!mounted)return null;
 return <View style={[StyleSheet.absoluteFillObject,{zIndex:4}]} pointerEvents={visible?'auto':'none'}>
 {/* On web the frost fades via CSS transitions on the blur itself: animating a parent's opacity would switch the backdrop blur off mid-fade. */}
 {Platform.OS==='web'?<View style={StyleSheet.absoluteFillObject}><FrostLayer on={visible} deep={deep}/><Pressable style={StyleSheet.absoluteFillObject} accessibilityLabel="Dismiss search" onPress={onDismiss}/></View>
 :<Animated.View style={[StyleSheet.absoluteFillObject,{opacity:progress}]}><GlassSurface style={[StyleSheet.absoluteFillObject,deep?styles.deep:styles.frost]}/><Pressable style={StyleSheet.absoluteFillObject} accessibilityLabel="Dismiss search" onPress={onDismiss}/></Animated.View>}
 <Animated.View style={{position:'absolute',left:0,right:0,top:128,bottom:98,opacity:progress,transform:[{translateY:progress.interpolate({inputRange:[0,1],outputRange:[14,0]})}]}}>{children}</Animated.View>
 </View>;
}

const fade={transitionProperty:'background-color, backdrop-filter, -webkit-backdrop-filter',transitionDuration:'260ms',transitionTimingFunction:'cubic-bezier(.2,.75,.25,1)'};
const styles=StyleSheet.create({webBase:fade,off:{backgroundColor:'rgba(237,242,228,0)',backdropFilter:'blur(0px) saturate(100%)',WebkitBackdropFilter:'blur(0px) saturate(100%)'},frost:{borderWidth:0,backgroundColor:'rgba(237,242,228,0.88)',backdropFilter:'blur(56px) saturate(140%)',WebkitBackdropFilter:'blur(56px) saturate(140%)'},deep:{borderWidth:0,backgroundColor:'rgba(240,244,233,0.94)',backdropFilter:'blur(72px) saturate(150%)',WebkitBackdropFilter:'blur(72px) saturate(150%)'}});
