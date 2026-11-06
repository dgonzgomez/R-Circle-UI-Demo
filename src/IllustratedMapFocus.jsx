import React,{useEffect,useRef} from 'react';
import {Animated,StyleSheet,Text,View} from 'react-native';
import {EventMapPin} from './EventPinPreview';
import Pressable from './TransitionPressable';
function positionFor(event){
 const place=event?.place||'';
 if(/coffee|habit|hub/i.test(place))return [.3,.4];
 if(/arts/i.test(place))return [.76,.35];
 if(/garden|botanic/i.test(place))return [.72,.63];
 if(/src|recreation/i.test(place))return [.4,.23];
 if(/library/i.test(place))return [.56,.31];
 return [.5,.45];
}
export default function IllustratedMapFocus({focus,size,onOpen,children}){
 const pan=useRef(new Animated.ValueXY({x:0,y:0})).current;
 const bounce=useRef(new Animated.Value(.6)).current;
 const [x,y]=positionFor(focus?.event);
 useEffect(()=>{
  const motion=Animated.spring(pan,{toValue:focus?{x:size.width*(.5-x),y:size.height*(.4-y)}:{x:0,y:0},stiffness:110,damping:19,mass:.8,useNativeDriver:true});
  bounce.setValue(.6);
  const pop=Animated.spring(bounce,{toValue:1,stiffness:250,damping:12,delay:160,useNativeDriver:true});
  motion.start();pop.start();return()=>{motion.stop();pop.stop()};
 },[focus,size.width,size.height]);
 return <View style={[StyleSheet.absoluteFillObject,{backgroundColor:'#e7ecde'}]}>
  <Animated.View style={[StyleSheet.absoluteFillObject,{transform:pan.getTranslateTransform()}]}>
   {children}
   {focus&&<Animated.View style={{position:'absolute',left:x*size.width-18,top:y*size.height-40,zIndex:3,transform:[{scale:bounce}]}}><Pressable accessibilityLabel={`Open ${focus.event.title}`} onPress={()=>onOpen(focus.event)}><EventMapPin event={focus.event}/><Text style={{position:'absolute',top:47,width:150,left:-57,textAlign:'center',fontSize:11,fontWeight:'500',color:'#233d32',backgroundColor:'#f3f5ebec',borderRadius:7,padding:5}}>{focus.event.title}</Text></Pressable></Animated.View>}
  </Animated.View>
 </View>;
}
