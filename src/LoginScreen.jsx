import React,{useRef,useState} from 'react';
import {View, Text, StyleSheet, Platform, Animated, Easing} from 'react-native';
import {Mail} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import Gradient from './Gradient';

const ink='#233d32',green='#31533f';
const font=Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined;
const logoFont=Platform.OS==='web'?'"Special Gothic Expanded One", sans-serif':undefined;
const easeInOut=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;

export default function LoginScreen({onLogin}){
 const root=useRef(null),button=useRef(null),ring=useRef(null);
 const [leaving,setLeaving]=useState(false);
 const fade=useRef(new Animated.Value(1)).current;
 // Opens a growing circular hole from the button, revealing the app underneath, then hands off.
 const start=()=>{
  if(leaving)return;setLeaving(true);
  if(Platform.OS!=='web'||!root.current?.getBoundingClientRect){Animated.timing(fade,{toValue:0,duration:450,useNativeDriver:true}).start(()=>onLogin());return}
  const box=root.current.getBoundingClientRect(),b=button.current.getBoundingClientRect();
  // The phone preview can be CSS-scaled; convert screen pixels back to the element's own coordinates.
  const scale=box.width/(root.current.offsetWidth||box.width)||1,w=box.width/scale,h=box.height/scale;
  const x=(b.left+b.width/2-box.left)/scale,y=(b.top+b.height/2-box.top)/scale;
  const max=Math.hypot(Math.max(x,w-x),Math.max(y,h-y))+40;
  const t0=performance.now(),dur=820;
  const frame=now=>{
   const p=Math.min(1,(now-t0)/dur),r=easeInOut(p)*max;
   const mask=`radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, black ${r+1.5}px)`;
   root.current.style.maskImage=mask;root.current.style.webkitMaskImage=mask;
   if(ring.current){const d=r*2+18;Object.assign(ring.current.style,{width:`${d}px`,height:`${d}px`,left:`${x-d/2}px`,top:`${y-d/2}px`,opacity:String(1-p*.6)})}
   if(p<1)requestAnimationFrame(frame);else onLogin();
  };
  requestAnimationFrame(frame);
 };
 return <Animated.View ref={root} style={[StyleSheet.absoluteFillObject,l.root,{opacity:fade}]}>
  <Gradient colors={['#e8eee7','#e1e8dd','#eee4da']} style={StyleSheet.absoluteFillObject}/>
  <View pointerEvents="none" style={[StyleSheet.absoluteFillObject,{overflow:'hidden'}]}><View style={[l.blob,{top:'22%',right:-95}]}/><View style={[l.blob,{bottom:20,left:-110,backgroundColor:'#9bb9ac33'}]}/></View>
  <View style={l.center}>
   <Text style={l.wordmark}>R’Circle</Text>
   <View ref={button} style={{alignSelf:'stretch'}}>
    <Pressable accessibilityRole="button" onPress={start} style={({pressed})=>[l.button,pressed&&{opacity:.85}]}>
     <Mail size={18} color="white" strokeWidth={1.8}/>
     <Text style={l.buttonText}>Log in with UCR email</Text>
    </Pressable>
   </View>
  </View>
  {leaving&&Platform.OS==='web'&&<View ref={ring} pointerEvents="none" style={l.ring}/>}
 </Animated.View>;
}

const l=StyleSheet.create({
 root:{backgroundColor:'#e6ece4',overflow:'hidden'},
 blob:{position:'absolute',width:280,height:300,borderRadius:170,backgroundColor:'#d8c7b745'},
 center:{flex:1,alignItems:'center',justifyContent:'center',paddingHorizontal:24,gap:40},
 wordmark:{fontFamily:logoFont,color:ink,fontSize:34,letterSpacing:-.5},
 button:{alignSelf:'stretch',height:54,borderRadius:27,backgroundColor:green,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10},
 buttonText:{fontFamily:font,color:'white',fontSize:15,fontWeight:'600'},
 ring:{position:'absolute',borderRadius:9999,borderWidth:9,borderColor:'rgba(63,106,80,0.35)',boxShadow:'0px 0px 24px rgba(63,106,80,0.35)'}
});
