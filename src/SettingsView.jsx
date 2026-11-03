import React from 'react';
import {Image,Platform,StyleSheet,Text,View} from 'react-native';
import {Bell,ChevronRight,FlaskConical,Info,LogOut,MapPin,ShieldCheck} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
const ink='#233d32',muted='#819078',green='#3f6a50';

function Toggle({value,onChange,label}){
 return <Pressable accessibilityRole="switch" accessibilityLabel={label} accessibilityState={{checked:value}} onPress={()=>onChange(!value)} style={[styles.toggle,value&&{backgroundColor:green}]}><View style={[styles.knob,value&&{transform:[{translateX:16}]}]}/></Pressable>;
}
// Same shell as the profile module blocks: glass card, small bold title, content below.
function Card({title,children,style}){return <GlassSurface style={[styles.card,style]}>{!!title&&<Text style={styles.cardTitle}>{title}</Text>}{children}</GlassSurface>}
function Row({Icon,title,sub,right,first}){return <View style={[styles.row,!first&&styles.divider]}><View style={styles.rowIcon}><Icon size={16} color="#55715b"/></View><View style={{flex:1}}><Text style={styles.rowTitle}>{title}</Text>{!!sub&&<Text style={styles.rowSub}>{sub}</Text>}</View>{right}</View>}

export default function SettingsView({demoMap,setDemoMap,me,shareLocation,setShareLocation,notifications,setNotifications,privacy,setPrivacy,onLogout}){
 return <View style={{gap:14,paddingTop:16}}>
  <Text style={styles.heading}>Settings</Text>
  <Card title="Account"><View style={[styles.row,{paddingTop:0}]}><View style={[styles.avatar,{backgroundColor:me.color}]}>{me.avatar?<Image source={{uri:me.avatar}} style={{width:'100%',height:'100%',borderRadius:22}}/>:<Text style={styles.initial}>{me.initial}</Text>}</View><View style={{flex:1}}><Text style={[styles.rowTitle,{fontSize:14}]}>{me.name}</Text><Text style={styles.rowSub}>@{me.handle} · UCR account</Text></View><ChevronRight size={16} color="#a2ab9a"/></View></Card>
  <Card title="Privacy">
   <Row first Icon={MapPin} title="Share location with friends" sub={shareLocation?'Friends can see where you are on the map':'Hidden from the map'} right={<Toggle label="Share location with friends" value={shareLocation} onChange={setShareLocation}/>}/>
   <Row Icon={ShieldCheck} title="Who can see your posts" right={<View style={styles.segment}>{['Inner circle','Everyone'].map(o=><Pressable key={o} accessibilityRole="button" accessibilityState={{selected:privacy===o}} onPress={()=>setPrivacy(o)} style={[styles.segBtn,privacy===o&&styles.segOn]}><Text style={[styles.segText,privacy===o&&{color:ink,fontWeight:'600'}]}>{o==='Inner circle'?'Circle':o}</Text></Pressable>)}</View>}/>
  </Card>
  <Card title="Notifications">
   <Row first Icon={Bell} title="Circle notifications" sub="Friends nearby, invites and replies" right={<Toggle label="Circle notifications" value={notifications} onChange={setNotifications}/>}/>
  </Card>
  <Card title="Labs"><Row first Icon={FlaskConical} title="Demo map" sub="Try the interactive UCR map with live event pins" right={<Toggle label="Demo map" value={demoMap} onChange={setDemoMap}/>}/></Card>
  <Card title="About"><Row first Icon={Info} title="R’Circle demo" sub="Preview settings only. No real location is collected and no notifications are sent."/></Card>
  <Pressable accessibilityRole="button" accessibilityLabel="Log out" onPress={onLogout}><GlassSurface style={[styles.card,styles.logout]}><LogOut size={17} color="white"/><Text style={styles.logoutText}>Log out</Text></GlassSurface></Pressable>
 </View>;
}
const font=Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined;
const styles=StyleSheet.create({heading:{fontFamily:font,fontSize:29,letterSpacing:-1.1,color:ink,marginBottom:4},card:{borderRadius:25,padding:19},cardTitle:{fontFamily:font,fontSize:12,fontWeight:'600',color:ink,marginBottom:10},
 row:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:11},divider:{borderTopWidth:1,borderTopColor:'#ffffff90'},rowIcon:{width:32,height:32,borderRadius:11,backgroundColor:'#ffffff70',alignItems:'center',justifyContent:'center'},rowTitle:{fontFamily:font,fontSize:13,color:ink},rowSub:{fontFamily:font,fontSize:10,color:muted,marginTop:3,lineHeight:14},
 avatar:{width:44,height:44,borderRadius:22,borderWidth:2,borderColor:'white',alignItems:'center',justifyContent:'center'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,fontSize:19,color:'#503d32'},
 toggle:{width:36,height:20,borderRadius:10,padding:2,backgroundColor:'#cfd6c6',justifyContent:'center'},knob:{width:16,height:16,borderRadius:8,backgroundColor:'white',boxShadow:'0px 1px 2px #00000025'},
 segment:{flexDirection:'row',padding:2,borderRadius:14,backgroundColor:'#e3e8db'},segBtn:{paddingHorizontal:10,height:26,borderRadius:12,justifyContent:'center'},segOn:{backgroundColor:'#fffffff0'},segText:{fontFamily:font,fontSize:10,color:muted},
 logout:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:9,paddingVertical:16,backgroundColor:'#a4513f',backgroundImage:'none',borderColor:'#a4513f'},logoutText:{fontFamily:font,fontSize:13,fontWeight:'600',color:'white'}});
