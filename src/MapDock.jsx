import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Image,PanResponder,Platform,ScrollView,StyleSheet,Text,View} from 'react-native';
import {ChevronRight,MapPin,Users} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
const ink='#233d32',muted='#819078';

function FriendBadge({count,onImage}){
 if(!count)return null;
 return <View style={[styles.badge,!onImage&&styles.badgeFlat]}><Users size={9} color={onImage?'white':'#3f6a50'}/><Text style={[styles.badgeText,!onImage&&{color:'#3f6a50'}]}>{count}</Text></View>;
}

// Bottom sheet on the map: drag the handle up to expand into For you + a list of campus places.
export default function MapDock({forYou,campus,bottomInset=0,dateLabel,onExpandedChange}){
 const collapsed=314+bottomInset;
 const [box,setBox]=useState(0),[expanded,setExpanded]=useState(false);
 const full=Math.max(collapsed,box-70);
 const height=useRef(new Animated.Value(collapsed)).current,base=useRef(collapsed);
 const list=useRef(null);
 // Collapsing always brings For you back to the top of the sheet.
 const snap=open=>{if(!open){const node=list.current?.getScrollableNode?.();if(node?.scrollTo)node.scrollTo({top:0,behavior:'smooth'});else list.current?.scrollTo({y:0,animated:true})}base.current=open?full:collapsed;if(open){setExpanded(true);onExpandedChange?.(true)}Animated.timing(height,{toValue:base.current,duration:380,easing:Easing.out(Easing.cubic),useNativeDriver:false}).start(()=>{if(!open){setExpanded(false);onExpandedChange?.(false)}})};
 useEffect(()=>{height.setValue(expanded?full:collapsed);base.current=expanded?full:collapsed},[full,collapsed]);
 const pan=useRef(null);
 pan.current=PanResponder.create({
  onStartShouldSetPanResponder:()=>false,
  onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dy)>6&&Math.abs(g.dy)>Math.abs(g.dx),
  onPanResponderMove:(_,g)=>height.setValue(Math.min(full,Math.max(collapsed,base.current-g.dy))),
  onPanResponderRelease:(_,g)=>{const h=base.current-g.dy;snap(g.vy<-.35?true:g.vy>.35?false:h>(collapsed+full)/2)},
  onPanResponderTerminate:()=>snap(expanded),
 });
 // Mouse/pointer drag for web, where the responder system doesn't pick up mouse drags.
 const webDrag=Platform.OS==='web'?{onPointerDown:e=>{
  const y0=e.clientY,t0=Date.now();let last=y0,lastT=t0,vy=0,moved=false;
  const move=ev=>{const dy=ev.clientY-y0;if(Math.abs(dy)>4)moved=true;const now=Date.now();vy=(ev.clientY-last)/Math.max(1,now-lastT);last=ev.clientY;lastT=now;height.setValue(Math.min(full,Math.max(collapsed,base.current-dy)))};
  const up=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);if(!moved)return;const h=base.current-(ev.clientY-y0);snap(vy<-.35?true:vy>.35?false:h>(collapsed+full)/2)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
 }}:pan.current.panHandlers;
 return <View pointerEvents="box-none" style={StyleSheet.absoluteFillObject} onLayout={e=>setBox(e.nativeEvent.layout.height)}>
  <Animated.View style={[styles.sheetWrap,{height}]}>
   <GlassSurface style={[styles.sheet,{paddingBottom:bottomInset}]}>
    <View {...webDrag} style={styles.grab}>
     <Pressable accessibilityRole="button" accessibilityLabel={expanded?'Collapse':'Expand'} onPress={()=>snap(!expanded)} hitSlop={12} style={styles.handleHit}><View style={styles.handle}/></Pressable>
     <View style={styles.header}><View><Text style={styles.eyebrow}>{dateLabel}</Text><Text style={styles.heading}>For you</Text></View></View>
    </View>
    <ScrollView ref={list} scrollEnabled={expanded} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:110}}>
     <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,paddingHorizontal:20}}>{forYou.map(c=><Pressable key={c.title} onPress={c.action} style={styles.card}>
      <View><Image source={{uri:c.img}} style={styles.cardImage}/>{!!c.tag&&<View style={styles.photoTag}><Text style={styles.tagText}>{c.tag}</Text></View>}<View style={styles.badgeSpot}><FriendBadge count={c.friends} onImage/></View></View>
      <Text style={styles.title}>{c.title}</Text><Text style={styles.sub}>{c.sub}</Text>
     </Pressable>)}</ScrollView>
     <Animated.View style={{opacity:height.interpolate({inputRange:[collapsed,collapsed+90],outputRange:[0,1],extrapolate:'clamp'})}}>
     <Text style={[styles.eyebrow,{marginTop:26,marginBottom:6,paddingHorizontal:20}]}>ON CAMPUS</Text>
     <View style={{paddingHorizontal:20}}>{campus.map((p,i)=><Pressable key={p.name} accessibilityRole="button" onPress={p.action} style={[styles.listRow,i>0&&styles.divider]}>
      {p.img?<Image source={{uri:p.img}} style={styles.thumb}/>:<View style={[styles.thumb,styles.thumbIcon]}><MapPin size={18} color="#55715b"/></View>}
      <View style={{flex:1}}><Text style={styles.title}>{p.name}</Text><Text style={styles.sub}>{p.sub}</Text></View>
      <FriendBadge count={p.friends}/><ChevronRight size={15} color="#a2ab9a"/>
     </Pressable>)}</View>
     </Animated.View>
    </ScrollView>
   </GlassSurface>
  </Animated.View>
 </View>;
}
const styles=StyleSheet.create({sheetWrap:{position:'absolute',left:0,right:0,bottom:0},sheet:{flex:1,userSelect:'none',borderTopLeftRadius:31,borderTopRightRadius:31,borderBottomLeftRadius:0,borderBottomRightRadius:0,backgroundColor:'#ffffff24'},grab:{paddingTop:11,paddingHorizontal:20,cursor:'grab',touchAction:'none'},handleHit:{alignSelf:'center',paddingVertical:4,paddingHorizontal:20,marginBottom:12},handle:{width:32,height:4,borderRadius:5,backgroundColor:'#cbd1c2'},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:14},eyebrow:{fontSize:8,letterSpacing:1.35,fontWeight:'500',color:'#929a86'},heading:{fontSize:23,letterSpacing:-.8,marginTop:4,color:ink},card:{width:154},cardImage:{width:'100%',height:91,borderRadius:16},photoTag:{position:'absolute',top:9,left:8,backgroundColor:'#20362d8a',padding:5,borderRadius:6},tagText:{fontSize:7,color:'white',letterSpacing:.8},badgeSpot:{position:'absolute',top:8,right:8},badge:{flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:6,height:18,borderRadius:9,backgroundColor:'#20362d99'},badgeFlat:{backgroundColor:'#3f6a5018'},badgeText:{fontSize:9,fontWeight:'600',color:'white'},title:{fontSize:12,fontWeight:'600',marginTop:8,color:ink},sub:{fontSize:9,color:muted,marginTop:4},listRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10},divider:{borderTopWidth:1,borderTopColor:'#ffffff80'},thumb:{width:46,height:46,borderRadius:13},thumbIcon:{backgroundColor:'#e3eadb',alignItems:'center',justifyContent:'center'}});
