import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Image,Platform,ScrollView,StyleSheet,Text,View} from 'react-native';
import {CalendarPlus,ChevronRight,MessageCircle,Sparkles,Users} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
const ink='#233d32',muted='#819078';

// Canned demo replies that read like the assistant knows your day, your friends and your favorite spots.
export function demoReply(n,photos){
 const replies=[
  {text:"Your next class doesn't start for another 2 hours. Maya's at the Coffee Bean right now, and it's the spot you visit most. Want to grab a Vanilla Ice Blended with her before the Design club meetup?",place:{name:'Coffee Bean',open:'Coffee Bean',sub:'HUB · 2 min walk · Not too busy',img:photos.coffeeStore,friends:1},actions:[{label:'Coffee with Maya',kind:'event',event:{title:'Coffee with Maya',time:'11:30 AM',end:'12:15 PM',place:'Coffee Bean · HUB',kind:'coffee',desc:'Suggested by R’Circle.'}},{label:'Message Maya',kind:'message',handle:'mayachen'}]},
  {text:"You've got 2h 45m free after coffee and nothing until 2:00 PM. The second floor of Rivera Library is quiet right now, so it's a good time to finish the piece you're bringing to Design club.",place:{name:'Rivera Library',open:'Rivera Library',sub:'4 min walk · Moderately busy',img:photos.library,friends:1},actions:[{label:'Block study time',kind:'event',event:{title:'Study at Rivera',time:'12:15 PM',end:'1:45 PM',place:'Rivera Library',kind:'design',desc:'Prep for Design club.'}},{label:'Message Alex',kind:'message',handle:'alexr'}]},
  {text:"Golden hour hits around 5:15 today. Alex is free from 3:00, so you could head to the Botanic Gardens a little early and catch the light together before your walk.",place:{name:'Botanic Gardens',open:'UCR Botanic Gardens',sub:'12 min walk · Best light at 5:15 PM',img:photos.garden,friends:0},actions:[{label:'Walk with Alex',kind:'event',event:{title:'Early walk with Alex',time:'4:30 PM',end:'5:15 PM',place:'UCR Botanic Gardens',kind:'walk',desc:'Catch golden hour before the group walk.'}},{label:'Message Alex',kind:'message',handle:'alexr'}]},
 ];
 return replies[n%replies.length];
}

function Thinking(){
 const spin=useRef(new Animated.Value(0)).current,shimmer=useRef(new Animated.Value(0)).current;
 useEffect(()=>{const a=Animated.loop(Animated.timing(spin,{toValue:1,duration:1400,easing:Easing.linear,useNativeDriver:true}));const b=Animated.loop(Animated.sequence([Animated.timing(shimmer,{toValue:1,duration:700,useNativeDriver:true}),Animated.timing(shimmer,{toValue:0,duration:700,useNativeDriver:true})]));a.start();b.start();return()=>{a.stop();b.stop()}},[]);
 return <View style={{gap:9,marginTop:4}}>{[1,.82,.55].map((w,i)=><Animated.View key={i} style={[styles.shimmer,{width:`${w*100}%`,opacity:shimmer.interpolate({inputRange:[0,1],outputRange:[.35+i*.1,.85]})}]}/>)}</View>;
}

function AiAvatar({busy}){
 const spin=useRef(new Animated.Value(0)).current;
 useEffect(()=>{if(!busy){spin.stopAnimation();return}const a=Animated.loop(Animated.timing(spin,{toValue:1,duration:1600,easing:Easing.linear,useNativeDriver:true}));a.start();return()=>a.stop()},[busy]);
 return <View style={styles.aiAvatar}><Animated.View style={[styles.aiRing,{transform:[{rotate:spin.interpolate({inputRange:[0,1],outputRange:['0deg','360deg']})}]}]}/><View style={styles.aiCore}><Sparkles size={13} color="#3f6a50"/></View></View>;
}

function AiMessage({reply,onPlace,onAction,onDone}){
 const words=reply.text.split(' ');
 const [phase,setPhase]=useState('thinking'),[count,setCount]=useState(0);
 const fade=useRef(new Animated.Value(0)).current;
 useEffect(()=>{const t=setTimeout(()=>setPhase('typing'),1100);return()=>clearTimeout(t)},[]);
 useEffect(()=>{if(phase!=='typing')return;if(count>=words.length){setPhase('done');return}const t=setTimeout(()=>setCount(c=>c+1),38);onDone?.();return()=>clearTimeout(t)},[phase,count]);
 useEffect(()=>{if(phase==='done'){Animated.timing(fade,{toValue:1,duration:420,easing:Easing.out(Easing.cubic),useNativeDriver:true}).start();onDone?.()}},[phase]);
 const p=reply.place;
 return <View style={styles.aiRow}>
  <AiAvatar busy={phase!=='done'}/>
  <View style={{flex:1}}>
   {phase==='thinking'?<Thinking/>:<Text style={styles.aiText}>{words.slice(0,count).join(' ')}</Text>}
   {phase==='done'&&<Animated.View style={{opacity:fade,transform:[{translateY:fade.interpolate({inputRange:[0,1],outputRange:[8,0]})}]}}>
    <Pressable accessibilityRole="button" onPress={()=>onPlace(p.open)}><GlassSurface style={styles.placeCard}>
     <Image source={{uri:p.img}} style={styles.placeImg}/>
     <View style={{flex:1}}><Text style={styles.placeName}>{p.name}</Text><Text style={styles.placeSub}>{p.sub}</Text></View>
     {p.friends>0&&<View style={styles.badge}><Users size={9} color="#3f6a50"/><Text style={styles.badgeText}>{p.friends}</Text></View>}
     <ChevronRight size={15} color="#a2ab9a"/>
    </GlassSurface></Pressable>
    <View style={styles.actions}>{reply.actions.map(a=><Pressable key={a.label} accessibilityRole="button" onPress={()=>onAction(a)} style={[styles.action,a.kind==='event'&&styles.actionPrimary]}>{a.kind==='event'?<CalendarPlus size={13} color="white"/>:<MessageCircle size={13} color={ink}/>}<Text style={[styles.actionText,a.kind==='event'&&{color:'white'}]}>{a.label}</Text></Pressable>)}</View>
   </Animated.View>}
  </View>
 </View>;
}

export default function AssistantChat({name,messages,onPlace,onAction}){
 const ref=useRef(null);
 const toEnd=()=>ref.current?.scrollToEnd({animated:true});
 return <ScrollView ref={ref} onContentSizeChange={toEnd} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:22,paddingTop:24,paddingBottom:130,gap:22}}>
  <View><Text style={styles.hello}>Hi {name},</Text><Text style={styles.helloSub}>here's what I'd do with your day.</Text></View>
  {messages.map(m=>m.role==='user'?<View key={m.id} style={styles.userBubble}><Text style={styles.userText}>{m.text}</Text></View>:<AiMessage key={m.id} reply={m.reply} onPlace={onPlace} onAction={onAction} onDone={toEnd}/>)}
 </ScrollView>;
}

const gradientText=Platform.OS==='web'?{backgroundImage:'linear-gradient(90deg,#3f6a50,#6f9c7d 45%,#c39258)',backgroundClip:'text',WebkitBackgroundClip:'text',color:'transparent'}:{color:'#3f6a50'};
const styles=StyleSheet.create({hello:{fontSize:30,letterSpacing:-1,fontWeight:'500',...gradientText},helloSub:{fontSize:20,letterSpacing:-.6,color:'#b4bcad',marginTop:2},
 userBubble:{alignSelf:'flex-end',maxWidth:'82%',backgroundColor:'#3f6a50',borderRadius:20,borderBottomRightRadius:6,paddingHorizontal:15,paddingVertical:11},userText:{fontSize:13,color:'white',lineHeight:19},
 aiRow:{flexDirection:'row',gap:11,alignItems:'flex-start'},aiAvatar:{width:28,height:28,alignItems:'center',justifyContent:'center'},aiRing:{position:'absolute',width:28,height:28,borderRadius:14,borderWidth:2,borderColor:'#7eaa8c',borderTopColor:'#c39258',borderRightColor:'transparent'},aiCore:{width:22,height:22,borderRadius:11,backgroundColor:'#e7efe2',alignItems:'center',justifyContent:'center'},
 aiText:{fontSize:14,lineHeight:22,color:ink,marginTop:3},shimmer:{height:11,borderRadius:6,backgroundColor:'#c9d8c4'},
 placeCard:{marginTop:14,borderRadius:20,padding:10,flexDirection:'row',alignItems:'center',gap:11},placeImg:{width:54,height:54,borderRadius:14},placeName:{fontSize:13,fontWeight:'600',color:ink},placeSub:{fontSize:10,color:muted,marginTop:4},
 badge:{flexDirection:'row',alignItems:'center',gap:3,paddingHorizontal:6,height:18,borderRadius:9,backgroundColor:'#3f6a5018'},badgeText:{fontSize:9,fontWeight:'600',color:'#3f6a50'},
 actions:{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:12},action:{flexDirection:'row',alignItems:'center',gap:6,paddingHorizontal:13,height:34,borderRadius:17,backgroundColor:'#ffffff80',borderWidth:1,borderColor:'#ffffffcc'},actionPrimary:{backgroundColor:'#3f6a50',borderColor:'#3f6a50'},actionText:{fontSize:11,fontWeight:'500',color:ink}});
