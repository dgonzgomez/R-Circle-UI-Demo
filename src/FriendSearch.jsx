import React from 'react';
import {ScrollView,StyleSheet,Text,View} from 'react-native';
import {Check,Plus} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import ProfileCard from './ProfileCard';
import GlassSurface from './GlassSurface';
const ink='#233d32';

// Usernames on this page win: exact handle, then handle prefix, then name matches.
function rank(p,q){const h=p.handle.toLowerCase(),n=p.name.toLowerCase();if(h===q)return 0;if(h.startsWith(q))return 1;if(n.split(' ').some(w=>w.startsWith(q)))return 2;if(h.includes(q)||n.includes(q))return 3;return -1}

export default function FriendSearch({embedded=false,query,friends,discoverable,requested,onAdd,onOpen,myClubs=[],moreClubs=[],onJoinClub,onOpenClub}){
 const q=query.trim().replace(/^@/,'').toLowerCase();
 const pool=[...friends.map(p=>({...p,friend:true})),...discoverable];
 const results=q?pool.map(p=>({p,r:rank(p,q)})).filter(x=>x.r>=0).sort((a,b)=>a.r-b.r||(b.p.friend?1:0)-(a.p.friend?1:0)).map(x=>x.p):[];
 // Clubs match on any word of the name; the ones you're already in come first.
 const clubHits=q?[...myClubs.map(c=>({...c,mine:true})),...moreClubs].filter(c=>c.name.toLowerCase().split(/[^a-z0-9]+/).some(w=>w.startsWith(q))||c.name.toLowerCase().includes(q)):[];
 const Wrap=embedded?View:ScrollView,wrapProps=embedded?{style:{gap:18}}:{keyboardShouldPersistTaps:'handled',showsVerticalScrollIndicator:false,contentContainerStyle:{paddingHorizontal:21,paddingTop:21,paddingBottom:120,gap:18}};
 return <Wrap {...wrapProps}>
  {!q&&<Text style={styles.meta}>{embedded?'Start typing a name or @username.':'Search your friends and clubs.'}</Text>}
  {!!q&&results.length>0&&<Text style={styles.eyebrow}>PEOPLE</Text>}
  {results.length>0&&<View>{results.map((p,i)=>{const sent=requested.includes(p.handle);const addBtn=<Pressable accessibilityRole="button" accessibilityLabel={sent?`Request sent to ${p.name}`:`Add ${p.name}`} disabled={sent} hitSlop={8} onPress={()=>onAdd(p)} style={[styles.corner,styles.cornerWhite]}>{sent?<Check size={16} color="#3f6a50"/>:<Plus size={18} color="#3f6a50"/>}</Pressable>;
   if(embedded)return <View key={p.handle} style={{marginTop:i?12:0}}><ProfileCard person={p} cardHeight={205} onPress={origin=>onOpen(p,origin)} corner={addBtn}/></View>;
   return <View key={p.handle} style={{marginTop:i?-118:0,zIndex:results.length-i}}>
   <ProfileCard person={p} cardHeight={205} onPress={origin=>onOpen(p,origin)}/>
   {/* Sits at the top-right of the slice that stays visible when cards are stacked. */}
   <View pointerEvents="box-none" style={styles.cornerSpot}>{p.friend?<View accessibilityLabel={`${p.name} is your friend`} style={[styles.corner,styles.cornerOn]}><Check size={16} color="#3f6a50"/></View>:<Pressable accessibilityRole="button" accessibilityLabel={sent?`Request sent to ${p.name}`:`Add ${p.name}`} disabled={sent} hitSlop={8} onPress={()=>onAdd(p)} style={[styles.corner,sent&&styles.cornerOn]}>{sent?<Check size={16} color="#3f6a50"/>:<Plus size={18} color="white"/>}</Pressable>}</View>
  </View>})}</View>}
  {clubHits.length>0&&<Text style={[styles.eyebrow,results.length>0&&{marginTop:6}]}>CLUBS</Text>}
  {clubHits.map(c=><Pressable key={c.name} accessibilityRole="button" accessibilityLabel={`Open ${c.name}`} onPress={c.mine?()=>onOpenClub?.(c,null):undefined} disabled={!c.mine}><GlassSurface style={styles.club}><View style={[styles.clubIcon,{backgroundColor:c.color}]}><c.Icon size={22} color={ink}/></View><View style={{flex:1}}><Text style={styles.clubName}>{c.name}</Text><Text style={[styles.meta,{fontSize:10,marginTop:3}]}>{c.members}{c.desc?` · ${c.desc}`:''}</Text></View>{c.mine?<View style={[styles.pill,styles.pillMuted,{height:32,paddingHorizontal:12}]}><Check size={12} color="#3f6a50"/><Text style={[styles.pillText,{fontSize:11,color:'#3f6a50'}]}>Joined</Text></View>:<Pressable accessibilityRole="button" accessibilityLabel={`Join ${c.name}`} onPress={()=>onJoinClub?.(c)} style={[styles.pill,styles.pillAdd,{height:32,paddingHorizontal:14}]}><Text style={[styles.pillText,{fontSize:11,color:'white'}]}>Join</Text></Pressable>}</GlassSurface></Pressable>)}
  {!!q&&!results.length&&!clubHits.length&&<Text style={styles.meta}>No people or clubs match “{query.trim()}”.</Text>}
 </Wrap>;
}
const styles=StyleSheet.create({eyebrow:{fontSize:8,letterSpacing:1.35,fontWeight:'500',color:'#929a86'},row:{flexDirection:'row',alignItems:'center'},meta:{fontSize:11,color:'#819078'},pill:{flexDirection:'row',alignItems:'center',gap:6,height:36,paddingHorizontal:16,borderRadius:18},pillAdd:{backgroundColor:'#3f6a50'},pillMuted:{backgroundColor:'#3f6a5018'},cornerSpot:{position:'absolute',top:124,right:14},corner:{width:34,height:34,borderRadius:17,backgroundColor:'#3f6a50',borderWidth:1.5,borderColor:'#ffffffcc',alignItems:'center',justifyContent:'center',boxShadow:'0px 4px 12px rgba(0,0,0,0.25)'},cornerOn:{backgroundColor:'#ffffffe6'},cornerWhite:{backgroundColor:'white',borderColor:'white'},club:{borderRadius:22,padding:14,flexDirection:'row',alignItems:'center',gap:12},clubIcon:{width:48,height:48,borderRadius:16,alignItems:'center',justifyContent:'center'},clubName:{fontSize:13,fontWeight:'600',color:ink},pillText:{fontSize:12,fontWeight:'600',color:ink}});
