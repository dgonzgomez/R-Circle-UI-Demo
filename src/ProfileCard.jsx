import React,{useEffect,useRef} from 'react';
import {AccessibilityInfo,Animated,Easing,Image,Platform,Pressable,StyleSheet,Text,TextInput,View} from 'react-native';
import Gradient from './Gradient';
import {Camera,Check,Music2,Pencil} from 'lucide-react-native';
import GlassSurface from './GlassSurface';
import SocialScore from './SocialScore';
export default function ProfileCard({person,onPress,onEdit,cardHeight,fill=false,editing=false,username,onUsernameChange,onPickAvatar,onPickBanner,corner,tags=[]}){
 const cardRef=useRef(null);
 const wiggle=useRef(new Animated.Value(0)).current;
 useEffect(()=>{
  let active=true;let loop;let settle;
  wiggle.setValue(0);
  if(editing){
   const subtle=()=>{
    if(!active)return;
    loop=Animated.loop(Animated.sequence([
     Animated.timing(wiggle,{toValue:.3,duration:140,easing:Easing.inOut(Easing.quad),useNativeDriver:true}),
     Animated.timing(wiggle,{toValue:-.3,duration:170,easing:Easing.inOut(Easing.quad),useNativeDriver:true})
    ]));loop.start();
   };
   settle=Animated.sequence([
    Animated.timing(wiggle,{toValue:1,duration:45,useNativeDriver:true}),
    Animated.timing(wiggle,{toValue:-1,duration:80,useNativeDriver:true}),
    Animated.timing(wiggle,{toValue:.55,duration:70,useNativeDriver:true}),
    Animated.timing(wiggle,{toValue:0,duration:60,useNativeDriver:true})
   ]);
   settle.start(({finished})=>{if(finished)subtle()});
   AccessibilityInfo.isReduceMotionEnabled().then(reduced=>{if(active&&reduced){settle?.stop();loop?.stop();wiggle.setValue(0)}});
  }
  return()=>{active=false;settle?.stop();loop?.stop();wiggle.stopAnimation();wiggle.setValue(0)};
 },[editing]);
 const open=()=>cardRef.current?.measureInWindow((x,y,width,height)=>onPress?.({x,y,width,height}));
 return <Animated.View style={[{height:fill?'100%':cardHeight||205},editing&&{transform:[{rotate:wiggle.interpolate({inputRange:[-1,1],outputRange:['-0.4deg','0.4deg']})}]}]}>
 <Pressable ref={cardRef} onPress={!editing&&onPress?open:undefined} accessibilityLabel={onPress?`Open ${person.name}'s profile`:undefined} style={[styles.card,fill&&{boxShadow:'none'}]}>
 <Image source={{uri:person.image}} style={StyleSheet.absoluteFillObject}/>
 <Gradient colors={['rgba(0,0,0,0)','rgba(0,0,0,0.08)','rgba(0,0,0,0.62)']} locations={[0,.42,1]} style={StyleSheet.absoluteFillObject}/>
 {editing&&<Pressable accessibilityRole="button" accessibilityLabel="Change profile banner from photo library" style={StyleSheet.absoluteFillObject} onPress={onPickBanner}/>}
 <View pointerEvents="box-none" style={styles.top}><View pointerEvents="none" style={styles.row}><Camera size={15} color="white"/><Text style={styles.white}>𝕏</Text><Music2 size={15} color="white"/>{!!corner&&!editing&&<View style={{marginLeft:4}}><View style={styles.badge}><View style={styles.dot}/><Text style={[styles.white,{fontSize:10}]}>Around campus</Text></View></View>}</View><View style={styles.row}>{editing?<Pressable onPress={onPickBanner} accessibilityRole="button" accessibilityLabel="Edit background"><GlassSurface style={styles.badge}><Camera size={11} color="white"/><Text style={[styles.white,{fontSize:10}]}>Edit background</Text></GlassSurface></Pressable>:corner||<View style={styles.badge}><View style={styles.dot}/><Text style={[styles.white,{fontSize:10}]}>Around campus</Text></View>}<View style={{marginLeft:7}}> {onEdit&&<Pressable accessibilityRole="button" accessibilityLabel={editing?'Done editing profile':'Edit profile'} hitSlop={10} onPress={onEdit}><GlassSurface style={styles.editButton}>{editing?<Check size={16} color="white"/>:<Pencil size={16} color="white"/>}</GlassSurface></Pressable>}</View></View></View>
 <View pointerEvents="box-none" style={[styles.identity,tags.length>0&&{bottom:22}]}>
 <Pressable disabled={!editing} onPress={onPickAvatar} accessibilityRole={editing?'button':undefined} accessibilityLabel={editing?'Change profile picture from photo library':undefined} style={[styles.avatar,{backgroundColor:person.color}]}>{person.avatar?<Image source={{uri:person.avatar}} style={{width:'100%',height:'100%',borderRadius:24}}/>:<Text style={styles.initial}>{person.initial}</Text>}{editing&&<View style={styles.avatarEdit}><Camera size={10} color="white"/></View>}</Pressable>
 <View style={{flex:1}}>{editing?<View style={[styles.row,{gap:0}]}><Text style={styles.handle}>@</Text><TextInput accessibilityLabel="Username" value={username} onChangeText={onUsernameChange} autoCapitalize="none" autoCorrect={false} maxLength={25} style={[styles.handle,{flex:1,minWidth:0,...Platform.select({web:{outlineStyle:'none'}})}]}/></View>:<Text style={styles.handle}>@{person.handle}</Text>}<View pointerEvents="none" style={[styles.row,{gap:5,marginTop:4}]}><Music2 size={11} color="#f4eee1"/><Text style={{fontSize:10,color:'#f4eee1'}}>{person.song}</Text></View>{tags.length>0&&<View pointerEvents="none" style={[styles.row,{gap:5,marginTop:7,flexWrap:'wrap'}]}>{tags.map(t=><View key={t} style={styles.tag}><View style={styles.tagDot}/><Text style={styles.tagText}>{t}</Text></View>)}</View>}</View>

 </View><View pointerEvents="none" style={styles.socialScore}><SocialScore value={person.score} onImage/></View></Pressable></Animated.View>;
}
const styles=StyleSheet.create({tag:{flexDirection:'row',alignItems:'center',gap:4,height:18,paddingHorizontal:7,borderRadius:9,backgroundColor:'rgba(255,255,255,0.22)',borderWidth:1,borderColor:'rgba(255,255,255,0.35)'},tagDot:{width:5,height:5,borderRadius:3,backgroundColor:'#b6ce9a'},tagText:{fontSize:9,fontWeight:'600',color:'white'},socialScore:{position:'absolute',bottom:11,right:16},card:{height:'100%',borderRadius:26,overflow:'hidden',borderWidth:2,borderColor:'#f7f8ef',boxShadow:'0px 8px 13px #263b2e18'},row:{flexDirection:'row',alignItems:'center',gap:8},top:{position:'absolute',left:16,right:15,top:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},white:{color:'white',fontSize:16},badge:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:7,paddingVertical:5,borderRadius:20,backgroundColor:'#ffffff25'},dot:{width:5,height:5,borderRadius:5,backgroundColor:'#b6ce9a'},identity:{position:'absolute',bottom:29,left:14,right:14,flexDirection:'row',alignItems:'center',gap:10},avatar:{width:48,height:48,borderRadius:24,borderWidth:2,borderColor:'#ffffffee',alignItems:'center',justifyContent:'center'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,fontSize:21,color:'#503d32'},handle:{fontSize:23,color:'white',fontWeight:'600',letterSpacing:-.7,padding:0},avatarEdit:{position:'absolute',bottom:-2,right:-2,width:19,height:19,borderRadius:10,borderWidth:2,borderColor:'white',backgroundColor:'#456551',alignItems:'center',justifyContent:'center'},editButton:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center'}});
