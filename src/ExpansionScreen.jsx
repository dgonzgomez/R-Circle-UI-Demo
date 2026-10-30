import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,BackHandler,Easing,Platform,Pressable,ScrollView,StyleSheet,View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {ArrowLeft} from 'lucide-react-native';
import GlassSurface from './GlassSurface';

export default function ExpansionScreen({origin,size,initialExpanded=false,interactionLocked=false,scrollable=true,backgroundColor,backdrop='solid',liftFromStack=false,cardHeight=205,renderCard,children,onClose,label}) {
 const progress=useRef(new Animated.Value(initialExpanded?1:0)).current;
 const pickup=useRef(new Animated.Value(0)).current;
 const contentVisibility=useRef(new Animated.Value(1)).current;
 const [ready,setReady]=useState(initialExpanded);
 const [exiting,setExiting]=useState(false);
 const closing=useRef(false);
 const mounted=useRef(true);
 const reduced=useRef(false);
 const runningAnimation=useRef(null);
 const scrollOffset=useRef(0);
 const closeCardTop=useRef(64);
 const onCloseRef=useRef(onClose);
 onCloseRef.current=onClose;
 const screenWidth=size.width||374;
 const screenHeight=size.height||780;
 const start=origin||{x:20,y:110,width:screenWidth-40,height:cardHeight};
 const interpolate=(from,to)=>progress.interpolate({inputRange:[0,1],outputRange:[from,to],extrapolate:'clamp'});
 const finishClose=()=>{if(mounted.current)onCloseRef.current()};
 const close=()=>{
  if(closing.current)return;
  closing.current=true;
  runningAnimation.current?.stop();
  pickup.stopAnimation();
  pickup.setValue(0);
  closeCardTop.current=64-scrollOffset.current;
  setExiting(true);
  setReady(false);
  if(reduced.current){finishClose();return;}
  // A bounded, monotonic exit avoids a spring's almost-invisible settling tail.
  // Details fade independently so they cannot remain over the shrinking surface.
  const animation=Animated.parallel([
   Animated.timing(contentVisibility,{toValue:0,duration:75,easing:Easing.out(Easing.quad),useNativeDriver:false}),
   Animated.timing(progress,{toValue:0,duration:220,easing:Easing.bezier(.22,.7,.25,1),useNativeDriver:false})
  ]);
  runningAnimation.current=animation;
  animation.start(({finished})=>{if(finished)finishClose()});
 };
 const closeRef=useRef(close);
 closeRef.current=close;
 useEffect(()=>{
  mounted.current=true;
  const begin=reduceMotion=>{
   if(!mounted.current||closing.current)return;
   reduced.current=reduceMotion;
   if(initialExpanded||reduceMotion){progress.setValue(1);setReady(true);return;}
   const expansion=Animated.spring(progress,{toValue:1,stiffness:190,damping:21,mass:.78,useNativeDriver:false});
   const animation=liftFromStack?Animated.sequence([
    Animated.timing(pickup,{toValue:1,duration:150,useNativeDriver:false}),
    Animated.parallel([
     Animated.spring(pickup,{toValue:0,stiffness:190,damping:20,mass:.7,useNativeDriver:false}),
     expansion
    ])
   ]):expansion;
   runningAnimation.current=animation;
   animation.start(({finished})=>{if(finished&&mounted.current&&!closing.current)setReady(true)});
  };
  AccessibilityInfo.isReduceMotionEnabled().then(begin).catch(()=>begin(false));
  const handler=Platform.OS==='web'?null:BackHandler.addEventListener('hardwareBackPress',()=>{closeRef.current();return true});
  return()=>{
   mounted.current=false;
   handler?.remove();
   runningAnimation.current?.stop();
   progress.stopAnimation();
   pickup.stopAnimation();
   contentVisibility.stopAnimation();
  };
 },[]);
 const detailsOpacity=Animated.multiply(contentVisibility,progress.interpolate({inputRange:[0,.45,1],outputRange:[0,0,1],extrapolate:'clamp'}));
 const exitOpacity=exiting?progress.interpolate({inputRange:[0,.18,1],outputRange:[0,1,1],extrapolate:'clamp'}):1;
 const showFloatingCard=renderCard&&!ready&&(!exiting||closeCardTop.current+cardHeight>0);
 return <Animated.View style={[styles.root,{opacity:exitOpacity}]} pointerEvents={exiting?'box-only':'auto'} accessibilityViewIsModal accessibilityLabel={label}>
  <Animated.View pointerEvents="none" style={{position:'absolute',left:interpolate(start.x,0),top:interpolate(start.y,0),width:interpolate(start.width,screenWidth),height:interpolate(start.height,screenHeight),borderRadius:interpolate(26,0),overflow:'hidden'}}>
   {backdrop==='blur'?<GlassSurface style={[StyleSheet.absoluteFillObject,{backgroundColor:'#e6ede142'}]}/>:<><LinearGradient colors={backgroundColor?[backgroundColor,backgroundColor]:['#e9eee7','#e1e9e0','#ede3d8']} style={StyleSheet.absoluteFillObject}/>{!backgroundColor&&<View style={styles.light}/>}</>}
  </Animated.View>
  <Animated.View pointerEvents={ready?'auto':'none'} style={[styles.content,{opacity:detailsOpacity}]}>
   {scrollable?<ScrollView scrollEnabled={ready&&!interactionLocked} onScroll={event=>{scrollOffset.current=event.nativeEvent.contentOffset.y}} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
    {renderCard&&<View style={{height:cardHeight}}>{ready&&renderCard()}</View>}
    <Animated.View style={{gap:14,marginTop:renderCard?18:0,transform:[{translateY:interpolate(24,0)}]}}>{children}</Animated.View>
   </ScrollView>:<View style={{flex:1,paddingTop:59}}>{children}</View>}
  </Animated.View>
  {showFloatingCard&&<Animated.View pointerEvents="none" style={{position:'absolute',left:interpolate(start.x,20),top:interpolate(start.y,exiting?closeCardTop.current:64),width:interpolate(start.width,screenWidth-40),height:interpolate(start.height,cardHeight),borderRadius:interpolate(26,29),overflow:'hidden',transform:[{translateY:pickup.interpolate({inputRange:[0,1],outputRange:[0,-18]})},{scale:pickup.interpolate({inputRange:[0,1],outputRange:[1,1.035]})},{rotate:pickup.interpolate({inputRange:[0,1],outputRange:['0deg','-1.2deg']})}]}}>{renderCard()}</Animated.View>}
  <Animated.View pointerEvents={exiting?'none':'auto'} style={[styles.back,{opacity:detailsOpacity}]}><Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Back">{backgroundColor?<ArrowLeft size={23} color="#007aff"/>:<GlassSurface style={styles.backGlass}><ArrowLeft size={19} color="#233d32"/></GlassSurface>}</Pressable></Animated.View>
 </Animated.View>;
}
const styles=StyleSheet.create({
 root:{...StyleSheet.absoluteFillObject,zIndex:12},content:{flex:1},scroll:{paddingHorizontal:20,paddingTop:64,paddingBottom:35},back:{position:'absolute',left:20,top:20,zIndex:3},backGlass:{width:34,height:34,borderRadius:17,alignItems:'center',justifyContent:'center'},light:{position:'absolute',top:'35%',right:-100,width:300,height:300,borderRadius:150,backgroundColor:'#d4bfae30'}
});
