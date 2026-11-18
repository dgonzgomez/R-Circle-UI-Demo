import React,{useEffect,useRef,useState} from 'react';
import {AccessibilityInfo,Animated,BackHandler,Easing,Platform,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {Check,Clock3,MapPin,Music2,Plus} from 'lucide-react-native';
import {LinearGradient} from 'expo-linear-gradient';
import GlassSurface from './GlassSurface';
import {briefInvitations,briefPollResults,pollArtists,springSplash} from './dailyBriefData';
const ink='#233d32',green='#31533f';
function PollOption({artist,index,choice,percentage,onVote}){
 const fill=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(fill,{toValue:percentage||0,duration:450,easing:Easing.out(Easing.cubic),useNativeDriver:false}).start()},[percentage]);
 const voted=choice!==null,selected=choice===index;
 return <Pressable accessibilityRole="button" accessibilityLabel={`${artist.name}${voted?`, ${percentage}%${selected?', your vote':''}`:''}`} accessibilityState={{selected,disabled:voted}} disabled={voted} onPress={()=>onVote(index)} style={[styles.option,selected&&{borderColor:'#789879',backgroundColor:'#e5ecdf'}]}>
  <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject,{right:undefined,width:fill.interpolate({inputRange:[0,100],outputRange:['0%','100%']}),backgroundColor:selected?'#bdcfb1a6':'#d3dcc980'}]}/>
  <View style={[styles.artist,{backgroundColor:artist.color}]}><Text style={{fontSize:10,color:ink,fontWeight:'600'}}>{artist.initial}</Text></View>
  <Text style={[styles.text,{flex:1,fontSize:12,fontWeight:'500'}]}>{artist.name}</Text>
  {selected&&<Check size={13} color={green}/>}
  {voted&&<Text style={[styles.text,{fontSize:12,fontWeight:'600',width:36,textAlign:'right'}]}>{percentage}%</Text>}
 </Pressable>;
}
export default function DailyBrief({visible,onDismiss,chromeTop=0,bottomInset=0,events,onAccept,onDecline,onEvent}){
 const [mounted,setMounted]=useState(visible),[choice,setChoice]=useState(null),[responses,setResponses]=useState({});
 const progress=useRef(new Animated.Value(0)).current,reduced=useRef(false),active=useRef(visible);active.current=visible;
 const results=briefPollResults(choice);
 useEffect(()=>{AccessibilityInfo.isReduceMotionEnabled().then(value=>{reduced.current=value}).catch(()=>{})},[]);
 useEffect(()=>{
  if(visible)setMounted(true);
  const motion=Animated.timing(progress,{toValue:visible?1:0,duration:reduced.current?0:visible?300:170,easing:Easing.bezier(.2,.75,.25,1),useNativeDriver:true});
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
 return <View style={[StyleSheet.absoluteFillObject,{zIndex:400}]} pointerEvents={visible?'auto':'none'}>
  <GlassSurface frosted style={[StyleSheet.absoluteFillObject,{borderWidth:0,borderRadius:0,backgroundColor:'#e7ecdeb8'}]}/>
  <Pressable accessibilityRole="button" accessibilityLabel="Dismiss daily brief" onPress={onDismiss} style={StyleSheet.absoluteFillObject}/>
  <View pointerEvents="box-none" style={[StyleSheet.absoluteFillObject,{justifyContent:'center',paddingHorizontal:16,paddingTop:chromeTop+16,paddingBottom:Math.max(18,bottomInset)}]}>
   <Animated.View accessibilityViewIsModal style={{width:'100%',maxHeight:'100%',opacity:progress,transform:[{translateY:progress.interpolate({inputRange:[0,1],outputRange:[24,0]})},{scale:progress.interpolate({inputRange:[0,1],outputRange:[.96,1]})}]}}>
    <GlassSurface frosted style={styles.card}>
     <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20,gap:16}}>
      <View style={styles.row}><Text style={[styles.text,{fontSize:23,letterSpacing:-.7,flex:1}]}>Daily brief</Text><Pressable accessibilityRole="button" accessibilityLabel="Dismiss daily brief" hitSlop={10} onPress={onDismiss}><Text style={{fontSize:12,color:green,fontWeight:'600'}}>Done</Text></Pressable></View>
      <Pressable accessibilityRole="button" accessibilityLabel="View Spring Splash" onPress={()=>onEvent(springSplash)}>
       <LinearGradient colors={['#dce6ba','#e4d2b5','#ebd0bd']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.splash}>
        <View style={[styles.row,{justifyContent:'space-between'}]}><Text style={styles.label}>COMING UP</Text><Music2 size={18} color={green}/></View>
        <Text style={[styles.text,{fontSize:27,letterSpacing:-.9,marginTop:5}]}>Spring Splash</Text>
        <Text style={[styles.text,{fontSize:11,marginTop:5}]}>Bad Bunny · underscores · Tinashe</Text>
        <View style={[styles.row,{marginTop:12,gap:5}]}><Clock3 size={11} color="#617057"/><Text style={styles.meta}>Tomorrow · 4 PM</Text><MapPin size={11} color="#617057" style={{marginLeft:7}}/><Text style={styles.meta}>Bell Tower lawn</Text></View>
       </LinearGradient>
      </Pressable>
      <View style={{gap:8}}><Text style={styles.section}>Invitations</Text>
       {briefInvitations.map(invitation=>{
        const accepted=events.some(event=>event.title===invitation.title&&event.day===invitation.day&&!event.pending);
        const status=accepted?'accepted':responses[invitation.id];
        return <View key={invitation.id} style={styles.invitation}>
         <View style={[styles.avatar,{backgroundColor:invitation.invitedBy.color}]}><Text style={[styles.text,{fontSize:14}]}>{invitation.invitedBy.initial}</Text></View>
         <View style={{flex:1}}><Text style={[styles.text,{fontSize:12,fontWeight:'500'}]} numberOfLines={1}>{invitation.title}</Text><Text style={[styles.meta,{marginTop:4}]}>{invitation.invitedBy.name} · {invitation.day===30?'Today':'Tomorrow'} · {invitation.time}</Text></View>
         {status?<View accessibilityLiveRegion="polite" style={styles.status}>{status==='accepted'&&<Check size={12} color={green}/>}<Text style={[styles.meta,{color:green}]}>{status==='accepted'?'Accepted':'Declined'}</Text></View>:<View style={{gap:7,alignItems:'center'}}><Pressable accessibilityRole="button" accessibilityLabel={`Accept ${invitation.invitedBy.name}'s invitation`} onPress={()=>respond(invitation,'accepted')} style={styles.accept}><Plus size={12} color="white"/><Text style={{fontSize:10,color:'white',fontWeight:'500'}}>Accept</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Decline ${invitation.invitedBy.name}'s invitation`} hitSlop={4} onPress={()=>respond(invitation,'declined')}><Text style={[styles.meta,{fontSize:9}]}>Decline</Text></Pressable></View>}
        </View>;
       })}
      </View>
      <View style={{gap:8}}>
       <View style={styles.row}><Text style={[styles.section,{flex:1}]}>Who are you most excited to see?</Text></View>
       <Text style={[styles.meta,{marginTop:-3}]}>Spring Splash · Everyone · Simulated poll</Text>
       {pollArtists.map((artist,index)=><PollOption key={artist.name} artist={artist} index={index} choice={choice} percentage={results?.percentages[index]} onVote={index=>setChoice(current=>current===null?index:current)}/>)}
       <Text accessibilityLiveRegion="polite" style={styles.meta}>{results?`You voted for ${pollArtists[choice].name} · ${results.total.toLocaleString()} votes`:'Tap an artist to vote'}</Text>
      </View>
      <View style={styles.yesterday}><Text style={styles.label}>YESTERDAY’S POLL</Text><Text style={[styles.text,{fontSize:12,lineHeight:18,marginTop:5}]}><Text style={{fontWeight:'700'}}>99%</Text> were skipping class to play GTA 6.</Text></View>
     </ScrollView>
    </GlassSurface>
   </Animated.View>
  </View>
 </View>;
}
const styles=StyleSheet.create({text:{color:ink},row:{flexDirection:'row',alignItems:'center',gap:8},card:{borderRadius:30,backgroundColor:'#f6f8efeF',maxHeight:'100%'},label:{fontSize:8,fontWeight:'600',letterSpacing:1.2,color:'#66755b'},section:{fontSize:13,fontWeight:'600',color:ink},meta:{fontSize:10,color:'#7b8772',lineHeight:14},splash:{padding:15,borderRadius:21,overflow:'hidden'},invitation:{minHeight:67,paddingHorizontal:11,paddingVertical:8,borderRadius:17,backgroundColor:'#e8dfcf75',borderWidth:1,borderColor:'#ffffffb0',flexDirection:'row',alignItems:'center',gap:9},avatar:{width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:'#fff'},accept:{height:26,borderRadius:13,paddingHorizontal:10,backgroundColor:green,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:4},status:{flexDirection:'row',alignItems:'center',gap:4},option:{height:42,borderRadius:14,borderWidth:1,borderColor:'#dce3d4',backgroundColor:'#ffffff80',overflow:'hidden',flexDirection:'row',alignItems:'center',paddingHorizontal:10,gap:9},artist:{height:26,width:28,borderRadius:9,alignItems:'center',justifyContent:'center'},yesterday:{paddingTop:13,borderTopWidth:1,borderTopColor:'#dfe5d6'}});
