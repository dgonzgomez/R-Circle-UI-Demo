import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,BackHandler,Easing,Platform,Pressable,StyleSheet,Text,View} from 'react-native';
import {Check,Music2,Trash2,ExternalLink} from 'lucide-react-native';
import GlassSurface from './GlassSurface';
import ModuleCard from './ModuleCard';
import HoverMedia from './HoverMedia';
import {pickProfileImage} from './pickProfileImage';
export default function BlockEditor({focus,data,size,onChange,onDelete,onClose,notify,onAction,actionLabel,onSelect}){
 const viewOnly=focus.mode==='view';
 const [preview,setPreview]=useState(focus.openItem&&(focus.type==='photos'||focus.type==='foods')?focus.selection||0:null);
 const opacity=useRef(new Animated.Value(0)).current;
 const progress=useRef(new Animated.Value(0)).current;
 const closing=useRef(false);const reduce=useRef(false);
 const targetY=viewOnly?64:Math.max(64,Math.min(focus.bounds.y,size.height-focus.bounds.height-76));
 useEffect(()=>{
  Animated.timing(opacity,{toValue:1,duration:150,useNativeDriver:false}).start();
  const motion=Animated.spring(progress,{toValue:1,stiffness:230,damping:26,mass:.7,useNativeDriver:false});motion.start();
  AccessibilityInfo.isReduceMotionEnabled().then(value=>{reduce.current=value;if(value){motion.stop();progress.setValue(1)}});
  const listener=Platform.OS==='web'?null:BackHandler.addEventListener('hardwareBackPress',()=>{close();return true});
  return()=>{listener?.remove();motion.stop();opacity.stopAnimation();progress.stopAnimation()};
 },[]);
 const close=after=>{
  if(closing.current)return;closing.current=true;
  Animated.parallel([Animated.timing(opacity,{toValue:0,duration:130,useNativeDriver:false}),Animated.timing(progress,{toValue:0,duration:150,easing:Easing.out(Easing.quad),useNativeDriver:false})]).start(({finished})=>{if(finished){onClose();if(typeof after==='function')after()}});
 };
 const changeImage=(field,index)=>{
  pickProfileImage(field==='cover'?'avatar':'banner').then(uri=>{
   if(!uri)return;
   if(field==='cover')onChange({...data,cover:uri});
   else onChange({...data,items:data.items.map((item,i)=>i===index?{...item,image:uri}:item)});
  }).catch(error=>notify(error.message));
 };
 return <View style={[StyleSheet.absoluteFillObject,{zIndex:50}]} accessibilityViewIsModal>
 <Animated.View style={[StyleSheet.absoluteFillObject,{opacity}]}><GlassSurface style={[StyleSheet.absoluteFillObject,{backgroundColor:'#e5ecdf66',backdropFilter:'blur(24px) saturate(120%)',WebkitBackdropFilter:'blur(24px) saturate(120%)'}]}/><Pressable style={StyleSheet.absoluteFillObject} onPress={()=>close()} accessibilityLabel={viewOnly?'Close focused card':'Finish editing block'}/></Animated.View>
 <Animated.View style={{position:'absolute',left:focus.bounds.x,top:progress.interpolate({inputRange:[0,1],outputRange:[focus.bounds.y,targetY]}),width:focus.bounds.width,opacity,boxShadow:'0px 18px 60px #18362630',borderRadius:25}}>
 <ModuleCard frosted type={focus.type} data={data} editing={!viewOnly} onSelect={index=>{onSelect?.(index);setPreview(index)}} height={focus.bounds.height} onChange={onChange} onPickImage={changeImage}/>
 {viewOnly?<>
 {focus.type==='music'&&<Pressable accessibilityRole="button" accessibilityLabel={actionLabel} onPress={()=>focus.type==='music'?onAction():setPreview(focus.selection||0)} style={{position:'absolute',top:focus.bounds.height+12,left:0,right:0}}><GlassSurface style={[styles.action,{flexDirection:'row',gap:8}]}>{focus.type==='music'?<Music2 size={17} color="#233d32"/>:<ExternalLink size={16} color="#233d32"/>}<Text style={{fontSize:13,color:'#233d32'}}>{actionLabel}</Text></GlassSurface></Pressable>}
 </>:<View style={{position:'absolute',top:focus.bounds.height+12,left:0,right:0,flexDirection:'row',justifyContent:'space-between'}}><Pressable accessibilityRole="button" accessibilityLabel="Delete block" onPress={()=>close(onDelete)}><GlassSurface style={styles.action}><Trash2 size={15} color="#985d4a"/></GlassSurface></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Done editing block" onPress={()=>close()}><GlassSurface style={[styles.action,{paddingHorizontal:16,flexDirection:'row',gap:7}]}><Check size={16} color="#233d32"/><Text style={{fontSize:12,color:'#233d32'}}>Done</Text></GlassSurface></Pressable></View>}
 </Animated.View>
 {preview!==null&&data.items?.[preview]&&<HoverMedia key={preview} item={data.items[preview]} type={focus.type} size={size} onClose={()=>setPreview(null)} onPlace={()=>close(onAction)}/>}
 </View>;
}
const styles=StyleSheet.create({action:{height:39,minWidth:39,borderRadius:20,alignItems:'center',justifyContent:'center'}});
