import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,BackHandler,Easing,Image,Platform,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import Svg,{Path,Circle} from 'react-native-svg';
import {Check,Music2,Sparkles,X} from 'lucide-react-native';
import Gradient from './Gradient';
import GlassSurface from './GlassSurface';
import {briefInvitations,briefPollResults,pollArtists,springSplash} from './dailyBriefData';
const ink='#1c3d4e',green='#23bae7',coral='#e9896d',muted='#557684';
const serif=Platform.OS==='web'?'Georgia':undefined;
// Same soft green fill as the agenda's shared-time blocks, mirrored so it grows from the left.
const FILL=['rgba(70,182,216,0.7)','rgba(65,184,221,0.45)','rgba(65,184,221,0)'],FILL_AT=[0,.6,1];
function PollOption({artist,index,choice,percentage,onVote}){
 const fill=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(fill,{toValue:percentage||0,duration:650,easing:Easing.out(Easing.cubic),useNativeDriver:false}).start()},[percentage]);
 const voted=choice!==null,selected=choice===index;
 return <Pressable accessibilityRole="button" accessibilityLabel={`${artist.name}${voted?`, ${percentage}%${selected?', your vote':''}`:''}`} accessibilityState={{selected}} onPress={()=>onVote(index)} style={({pressed})=>[styles.option,voted&&styles.optionVoted,selected&&{borderColor:'#80bdcc'},pressed&&{opacity:.75}]}>
  <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject,{right:undefined,width:fill.interpolate({inputRange:[0,100],outputRange:['0%','100%']})}]}>
   <Gradient colors={FILL} locations={FILL_AT} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFillObject}/>
  </Animated.View>
  <Text style={[styles.text,{flex:1,fontSize:14,fontWeight:selected?'600':'500'}]}>{artist.name}</Text>
  {selected&&<Check size={14} color={green} strokeWidth={2.4}/>}
  {voted&&<Text style={[styles.text,{fontSize:15,fontWeight:'500',minWidth:40,textAlign:'right',color:selected?ink:'#5caac2'}]}>{percentage}%</Text>}
 </Pressable>;
}
function Palm({x,h,flip}){
 const s=flip?-1:1;
 return <Path fill="#2a1438" d={`M${x} 200 L${x+3*s} ${200-h} L${x+5*s} ${200-h} L${x+4*s} 200 Z M${x+4*s} ${200-h} q${-22*s} -6 ${-34*s} 8 q${16*s} -14 ${34*s} -8 q${-10*s} -18 ${-30*s} -20 q${22*s} -2 ${30*s} 20 q${6*s} -20 ${26*s} -22 q${-14*s} 8 ${-26*s} 22 q${24*s} -10 ${36*s} 4 q${-18*s} -8 ${-36*s} -4 Z`}/>;
}
function Pill({children}){return <View style={styles.pill}>{children}</View>}
export default function DailyBrief({visible,onDismiss,chromeTop=0,bottomInset=0,events,onAccept,onDecline,onEvent}){
 const [gtaArt,setGtaArt]=useState(false),[mounted,setMounted]=useState(visible),[choice,setChoice]=useState(null),[responses,setResponses]=useState({});
 const progress=useRef(new Animated.Value(0)).current,reduced=useRef(false),active=useRef(visible);active.current=visible;
 const results=briefPollResults(choice);
 useEffect(()=>{AccessibilityInfo.isReduceMotionEnabled().then(value=>{reduced.current=value}).catch(()=>{})},[]);
 useEffect(()=>{
  if(visible)setMounted(true);
  const motion=Animated.timing(progress,{toValue:visible?1:0,duration:reduced.current?0:visible?320:180,easing:Easing.bezier(.2,.75,.25,1),useNativeDriver:true});
  motion.start(({finished})=>{if(finished&&!active.current)setMounted(false)});return()=>motion.stop();
 },[visible]);
 useEffect(()=>{
  if(!visible||Platform.OS==='web')return;
  const handler=BackHandler.addEventListener('hardwareBackPress',()=>{onDismiss();return true});return()=>handler.remove();
 },[visible,onDismiss]);
 if(!mounted)return null;
 const respond=(invitation,status)=>{
  setResponses(current=>({...current,[invitation.id]:status}));
  if(status==='accepted')onAccept(invitation);else onDecline(invitation);
 };
 const pending=briefInvitations.filter(invitation=>!responses[invitation.id]&&!events.some(event=>event.title===invitation.title&&event.day===invitation.day&&!event.pending)).length;
 return <Animated.View accessibilityViewIsModal pointerEvents={visible?'auto':'none'} style={[StyleSheet.absoluteFillObject,{zIndex:400,opacity:progress}]}>
  <Gradient colors={['#e6f1f4','#d8edf2','#d1eff7']} locations={[0,.55,1]} style={StyleSheet.absoluteFillObject}/>
  <View pointerEvents="none" style={styles.blobA}/><View pointerEvents="none" style={styles.blobB}/>
  <Animated.View style={{flex:1,transform:[{translateY:progress.interpolate({inputRange:[0,1],outputRange:[22,0]})}]}}>
   <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingTop:chromeTop+6,paddingHorizontal:20,paddingBottom:40+bottomInset}}>
    <View style={styles.head}>
     <View style={{flex:1}}>
      <Text style={styles.eyebrow}>FRIDAY · OCTOBER 30</Text>
      <Text style={styles.title}>Daily Brief</Text>
     </View>
     <Pressable accessibilityRole="button" accessibilityLabel="Dismiss daily brief" hitSlop={6} onPress={onDismiss}><GlassSurface style={styles.round}><X size={18} color={ink} strokeWidth={1.8}/></GlassSurface></Pressable>
    </View>
    <Text style={styles.blurb}>What’s good boss, here’s what’s happening.</Text>

    <Pressable accessibilityRole="button" accessibilityLabel="View Spring Splash" onPress={()=>onEvent(springSplash)} style={({pressed})=>[styles.hero,pressed&&{opacity:.92}]}>
     <Image source={{uri:springSplash.image}} style={StyleSheet.absoluteFillObject} resizeMode="cover"/>
     <Gradient colors={['rgba(0,0,0,0.05)','rgba(0,0,0,0.12)','rgba(0,0,0,0.66)']} locations={[0,.4,1]} style={StyleSheet.absoluteFillObject}/>
     <View style={styles.heroTop}><Pill><Sparkles size={12} color={coral}/><Text style={styles.pillText}>Coming up</Text></Pill></View>
     <View style={styles.heroBottom}>
      <Text style={styles.heroTitle}>Spring Splash</Text>
      <View style={[styles.row,{gap:6,marginTop:4}]}><Music2 size={13} color="white"/><Text style={styles.heroSub}>Bad Bunny · underscores · Tinashe</Text></View>
      <View style={[styles.row,{gap:7,marginTop:12}]}><Pill><Text style={styles.pillText}>Tomorrow · 4 PM</Text></Pill><Pill><Text style={styles.pillText}>{springSplash.place}</Text></Pill></View>
     </View>
    </Pressable>

    <View style={styles.section}><Text style={styles.eyebrow}>INVITATIONS</Text>{pending>0&&<View style={styles.count}><Text style={styles.meta}>{pending} new</Text></View>}</View>
    {briefInvitations.map(invitation=>{
     const accepted=events.some(event=>event.title===invitation.title&&event.day===invitation.day&&!event.pending);
     const status=accepted?'accepted':responses[invitation.id];
     return <GlassSurface key={invitation.id} style={styles.invitation}>
      <View style={[styles.avatar,{backgroundColor:invitation.invitedBy.color}]}><Text style={{fontFamily:serif,fontSize:19,color:'#503d32'}}>{invitation.invitedBy.initial}</Text></View>
      <View style={{flex:1,minWidth:0}}><Text style={[styles.text,{fontSize:14,fontWeight:'500'}]} numberOfLines={2}>{invitation.title}</Text><Text style={[styles.meta,{marginTop:5,fontSize:11}]} numberOfLines={1}>{invitation.invitedBy.name} · {invitation.day===30?'Today':'Tomorrow'} {invitation.time.replace(':00','')}</Text></View>
      {status?<View accessibilityLiveRegion="polite" style={[styles.status,status==='declined'&&{backgroundColor:'#d8edf3'}]}>{status==='accepted'&&<Check size={13} color={green} strokeWidth={2.4}/>}<Text style={{fontSize:11,fontWeight:'600',color:status==='accepted'?green:muted}}>{status==='accepted'?'Added to agenda':'Declined'}</Text></View>
      :<View style={[styles.row,{gap:7}]}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Decline ${invitation.invitedBy.name}'s invitation`} onPress={()=>respond(invitation,'declined')} style={({pressed})=>[styles.decline,pressed&&{opacity:.7}]}><X size={15} color="#5caac2" strokeWidth={2}/></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Accept ${invitation.invitedBy.name}'s invitation`} onPress={()=>respond(invitation,'accepted')} style={({pressed})=>[styles.accept,pressed&&{opacity:.8}]}><Check size={16} color="white" strokeWidth={2.2}/></Pressable>
       </View>}
     </GlassSurface>;
    })}

    <View style={styles.section}><Text style={styles.eyebrow}>TODAY’S POLL</Text></View>
    <GlassSurface style={styles.poll}>
     <Text style={styles.question}>Who are you most excited to see?</Text>
     <Text style={[styles.meta,{marginTop:6,fontSize:11}]}>Spring Splash · Everyone at UCR</Text>
     <View style={{gap:9,marginTop:12}}>{pollArtists.map((artist,index)=><PollOption key={artist.name} artist={artist} index={index} choice={choice} percentage={results?.percentages[index]} onVote={setChoice}/>)}</View>
     <View style={[styles.row,{gap:6,marginTop:12}]}>{results&&<Sparkles size={12} color={coral}/>}<Text accessibilityLiveRegion="polite" style={[styles.meta,{fontSize:11}]}>{results?`You voted · ${results.total.toLocaleString()} votes · Tap to change`:'Tap an artist to vote'}</Text></View>
    </GlassSurface>

    <View style={styles.yesterday}>
     <Gradient colors={['#ff8a5b','#e8508a','#6a2c91']} locations={[0,.5,1]} start={{x:0,y:0}} end={{x:0,y:1}} style={StyleSheet.absoluteFillObject}/>
     <Svg pointerEvents="none" width="100%" height="100%" viewBox="0 0 350 200" preserveAspectRatio="xMidYMax slice" style={StyleSheet.absoluteFillObject}>
      <Circle cx="270" cy="150" r="46" fill="#ffd27a" opacity=".85"/>
      <Path d="M0 168 H350 V200 H0 Z" fill="#3a1a4d" opacity=".55"/>
      <Palm x={230} h={92}/><Palm x={306} h={70} flip/><Palm x={330} h={110}/>
     </Svg>
     <Image source={{uri:'./gta6.jpg'}} resizeMode="cover" onLoad={()=>setGtaArt(true)} onError={()=>setGtaArt(false)} style={[StyleSheet.absoluteFillObject,{opacity:gtaArt?1:0}]}/>
     {gtaArt&&<Gradient colors={['rgba(20,6,30,0.65)','rgba(20,6,30,0.25)','rgba(20,6,30,0)']} locations={[0,.55,1]} start={{x:0,y:.5}} end={{x:1,y:.5}} style={StyleSheet.absoluteFillObject}/>}
     <View style={{flex:1}}><Text style={[styles.eyebrow,{color:'#ffe3d3'}]}>YESTERDAY’S POLL</Text><Text style={styles.big}>99<Text style={{fontSize:20,letterSpacing:0}}>%</Text></Text><Text style={{fontSize:13,lineHeight:18,color:'white',maxWidth:200}}>{'were skipping class to play GTA\u00a06'}</Text></View>
    </View>
    <GlassSurface style={styles.fact}>
     <View style={[styles.row,{gap:6}]}><Sparkles size={12} color={coral}/><Text style={styles.eyebrow}>FUN FACT</Text></View>
     <Text style={[styles.text,{fontSize:13,lineHeight:19,marginTop:7}]}>{'The release of GTA\u00a06 is estimated to cost the US economy $1\u00a0billion in lost productivity, with 1.5\u00a0million Americans calling out of work.'}</Text>
    </GlassSurface>
   </ScrollView>
  </Animated.View>
 </Animated.View>;
}
const styles=StyleSheet.create({
 text:{color:ink},row:{flexDirection:'row',alignItems:'center'},
 blobA:{position:'absolute',top:'22%',right:-95,width:270,height:310,borderRadius:170,backgroundColor:'#a6dce945',transform:[{rotate:'-30deg'}]},
 blobB:{position:'absolute',bottom:40,left:-110,width:320,height:320,borderRadius:180,backgroundColor:'#89c2d033'},
 head:{flexDirection:'row',alignItems:'flex-end',marginTop:10,paddingHorizontal:2},
 eyebrow:{fontSize:10,letterSpacing:1.4,fontWeight:'600',color:'#5aabc3'},
 title:{fontSize:31,letterSpacing:-1.2,marginTop:6,color:ink},
 blurb:{fontSize:15,lineHeight:21,color:'#57acc6',marginTop:8,marginBottom:18,paddingHorizontal:2},
 round:{width:46,height:46,borderRadius:23,alignItems:'center',justifyContent:'center'},
 hero:{height:228,borderRadius:28,overflow:'hidden',borderWidth:2,borderColor:'#effafd',backgroundColor:'#4fb1ce',boxShadow:'0px 10px 18px #203d4b22'},
 heroTop:{position:'absolute',top:15,left:16,right:16,flexDirection:'row'},
 heroBottom:{position:'absolute',left:18,right:18,bottom:17},
 heroTitle:{fontSize:34,fontWeight:'700',letterSpacing:-1.2,color:'white'},
 heroSub:{fontSize:13,color:'#ffffffeb'},
 pill:{flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:10,paddingVertical:6,borderRadius:20,backgroundColor:'#ffffff2e',borderWidth:1,borderColor:'#ffffff40'},
 pillText:{color:'white',fontSize:11,fontWeight:'500'},
 section:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:24,marginBottom:10,paddingHorizontal:2},
 count:{paddingHorizontal:8,paddingVertical:4,borderRadius:10,backgroundColor:'#d7eff5'},
 meta:{fontSize:10,color:muted,lineHeight:14},
 invitation:{borderRadius:24,paddingVertical:14,paddingLeft:12,paddingRight:14,flexDirection:'row',alignItems:'center',gap:12,marginBottom:10},
 avatar:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'#ffffffee'},
 accept:{width:38,height:38,borderRadius:19,backgroundColor:green,alignItems:'center',justifyContent:'center',boxShadow:'inset 0px 1px 2px #ffffff55, 0px 4px 12px #22435330'},
 decline:{width:38,height:38,borderRadius:19,backgroundColor:'#ffffffc0',borderWidth:1,borderColor:'white',alignItems:'center',justifyContent:'center'},
 status:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:10,paddingVertical:7,borderRadius:14,backgroundColor:'#cfedf4'},
 poll:{borderRadius:26,padding:18},
 question:{fontSize:19,letterSpacing:-.5,lineHeight:23,color:ink},
 option:{height:50,borderRadius:17,borderWidth:1,borderColor:'white',backgroundColor:'#ffffff8c',overflow:'hidden',flexDirection:'row',alignItems:'center',paddingHorizontal:16,gap:10},
 optionVoted:{backgroundColor:'rgba(255,255,255,0.22)',borderColor:'rgba(255,255,255,0.8)',boxShadow:'inset 0px 1px 1px rgba(255,255,255,0.9), 0px 6px 20px rgba(44,193,239,0.10)'},
 yesterday:{marginTop:12,height:150,borderRadius:26,padding:18,overflow:'hidden',borderWidth:2,borderColor:'#effafd',backgroundColor:'#c9477f',flexDirection:'row',alignItems:'center',boxShadow:'0px 10px 18px #4a1f4a26'},
 big:{fontSize:46,fontWeight:'700',letterSpacing:-2,color:'white',marginTop:2} ,
 fact:{marginTop:12,borderRadius:22,padding:16}
});
