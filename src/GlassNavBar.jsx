import React,{useEffect,useRef} from 'react';
import {Animated,StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {CalendarDays,Map,MessagesSquare,UserRound,Users} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
const tabs=[{name:'Agenda',Icon:CalendarDays},{name:'Outer Circle',Icon:MessagesSquare},{name:'Map',Icon:Map},{name:'Inner Circle',Icon:Users},{name:'Profile',Icon:UserRound}];
function Tab({name,Icon,selected,onPress}){
 const focus=useRef(new Animated.Value(selected?1:0)).current;
 useEffect(()=>{const motion=Animated.spring(focus,{toValue:selected?1:0,stiffness:300,damping:23,mass:.65,useNativeDriver:true});motion.start();return()=>motion.stop()},[selected]);
 return <Pressable accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{selected}} onPress={onPress} style={styles.tab}>
 <Animated.View pointerEvents="none" style={[styles.lens,{opacity:focus,transform:[{scale:focus.interpolate({inputRange:[0,1],outputRange:[.85,1.07]})},{translateY:focus.interpolate({inputRange:[0,1],outputRange:[0,-1]})}]}]}><GlassSurface style={styles.lensSurface}><LinearGradient colors={['#52775a88','#31533f22','#203e3266']} style={StyleSheet.absoluteFillObject}/></GlassSurface></Animated.View>
 <Animated.View pointerEvents="none" style={{transform:[{scale:focus.interpolate({inputRange:[0,1],outputRange:[1,1.23]})},{translateY:focus.interpolate({inputRange:[0,1],outputRange:[0,-1]})}]}}><Icon size={21} strokeWidth={1.7} color={selected?'#ffffff':'#7d8876'}/></Animated.View>
 </Pressable>;
}
export default function GlassNavBar({selected,onSelect}){
 return <GlassSurface style={styles.bar}>{tabs.map(tab=><Tab key={tab.name} {...tab} selected={selected===tab.name} onPress={()=>onSelect(tab.name)}/>)}</GlassSurface>;
}
const styles=StyleSheet.create({bar:{position:'absolute',bottom:22,left:19,right:19,height:64,borderRadius:35,flexDirection:'row',padding:6,justifyContent:'space-between',zIndex:5,boxShadow:'0px 12px 32px #26351f22, inset 0px 1px 1px #ffffff, inset 0px -1px 1px #ffffff80'},tab:{flex:1,alignItems:'center',justifyContent:'center'},lens:{position:'absolute',width:49,height:49,borderRadius:26},lensSurface:{flex:1,borderRadius:26,backgroundColor:'#31533fe8',boxShadow:'inset 0px 1px 2px #ffffff, inset 0px -2px 4px #16382966, 0px 3px 9px #36532d25'}});
