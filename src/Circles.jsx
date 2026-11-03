import React,{useEffect,useRef,useState} from 'react';
import {Animated,Easing,Image,Platform,ScrollView,StyleSheet,Text,TextInput,View} from 'react-native';
import {Check,Plus,Search,Trash2,UserPlus} from 'lucide-react-native';
import Pressable from './TransitionPressable';
import GlassSurface from './GlassSurface';
import FriendSearch from './FriendSearch';
const ink='#233d32',muted='#819078',green='#3f6a50';
const font=Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined;

// Slim row above the profile cards: filter by circle, make a new circle, or add a friend.
// Tap a circle to filter by it; tap it again while selected to manage it.
// A deleted circle's chip shrinks, fades and collapses its width so the row closes the gap smoothly.
function CircleChip({leaving,onGone,children}){
 const t=useRef(new Animated.Value(0)).current,[w,setW]=useState(null);
 useEffect(()=>{if(!leaving)return;const run=Animated.sequence([Animated.delay(320),Animated.timing(t,{toValue:1,duration:420,easing:Easing.inOut(Easing.cubic),useNativeDriver:false})]);run.start(({finished})=>{if(finished)onGone?.()});return()=>run.stop()},[leaving]);
 return <Animated.View onLayout={e=>{if(w===null)setW(e.nativeEvent.layout.width)}} style={[{overflow:'hidden'},leaving&&w!==null&&{width:t.interpolate({inputRange:[0,.35,1],outputRange:[w,w,0]}),marginRight:t.interpolate({inputRange:[0,.35,1],outputRange:[0,0,-7]}),opacity:t.interpolate({inputRange:[0,.4],outputRange:[1,0],extrapolate:'clamp'}),transform:[{scale:t.interpolate({inputRange:[0,.4],outputRange:[1,.6],extrapolate:'clamp'})}]}]}>{children}</Animated.View>;
}
export function CircleBar({circles,selected,onSelect,onNew,onAddFriend,onManage,removing,onRemoved}){
 return <View style={styles.bar}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{gap:7,paddingRight:8}}>
   {['All',...circles.map(c=>c.name)].map(name=>{const on=selected===name;const circle=circles.find(c=>c.name===name);return <CircleChip key={name} leaving={name===removing} onGone={()=>onRemoved?.(name)}><Pressable key={name} accessibilityRole="button" accessibilityHint={circle?(on?'Tap to manage circle':'Tap to filter, tap again to manage'):undefined} accessibilityState={{selected:on}} onPress={()=>on&&circle?onManage?.(circle):onSelect(name)} style={[styles.chip,on&&styles.chipOn]}><Text style={[styles.chipText,on&&{color:'white'}]}>{name}</Text></Pressable></CircleChip>})}
   <Pressable accessibilityRole="button" accessibilityLabel="New circle" onPress={onNew} style={[styles.chip,styles.chipNew]}><Plus size={12} color={green}/><Text style={[styles.chipText,{color:green}]}>New circle</Text></Pressable>
  </ScrollView>
  <Pressable accessibilityRole="button" accessibilityLabel="Add a friend" onPress={onAddFriend} style={styles.addBtn}><UserPlus size={16} color="white"/></Pressable>
 </View>;
}

function Avatar({p,size=34}){return <View style={[styles.avatar,{width:size,height:size,borderRadius:size/2,backgroundColor:p.color}]}>{p.avatar?<Image source={{uri:p.avatar}} style={{width:'100%',height:'100%',borderRadius:size/2}}/>:<Text style={styles.initial}>{p.initial}</Text>}</View>}

export function CircleComposer({friends,initial,onCreate,onDelete}){
 const editing=!!initial;
 const [name,setName]=useState(initial?.name||''),[picked,setPicked]=useState(initial?.members||[]),[error,setError]=useState('');
 const create=()=>{if(!name.trim()){setError('Name your circle.');return}if(!picked.length){setError('Pick at least one friend.');return}onCreate({name:name.trim(),members:picked})};
 return <View style={{gap:14,paddingTop:16}}>
  <Text style={styles.heading}>{editing?'Manage circle':'New circle'}</Text>
  <GlassSurface style={styles.card}><Text style={styles.cardTitle}>Name</Text><TextInput autoFocus={!editing} value={name} onChangeText={v=>{setName(v);setError('')}} placeholder="Roommates, study group…" placeholderTextColor="#9aa592" style={styles.nameInput}/></GlassSurface>
  <GlassSurface style={styles.card}><Text style={styles.cardTitle}>Friends · {picked.length} selected</Text>{friends.map((p,i)=>{const on=picked.includes(p.handle);return <Pressable key={p.handle} accessibilityRole="checkbox" accessibilityState={{checked:on}} accessibilityLabel={`Add ${p.name} to circle`} onPress={()=>{setError('');setPicked(cur=>on?cur.filter(h=>h!==p.handle):[...cur,p.handle])}} style={[styles.friendRow,i>0&&styles.divider]}><Avatar p={p}/><View style={{flex:1}}><Text style={styles.rowTitle}>{p.name}</Text><Text style={styles.rowSub}>@{p.handle}</Text></View><View style={[styles.check,on&&styles.checkOn]}>{on&&<Check size={11} color="white"/>}</View></Pressable>})}</GlassSurface>
  {!!error&&<Text accessibilityRole="alert" style={[styles.rowSub,{color:'#925b49',fontSize:12,paddingHorizontal:8}]}>{error}</Text>}
  <Pressable accessibilityRole="button" onPress={create}><GlassSurface style={[styles.card,styles.primary]}><Text style={styles.primaryText}>{editing?'Save changes':'Create circle'}</Text></GlassSurface></Pressable>
  {editing&&<Pressable accessibilityRole="button" accessibilityLabel={`Delete ${initial.name}`} onPress={()=>onDelete?.(initial.name)}><GlassSurface style={[styles.card,styles.deleteBtn]}><Trash2 size={15} color="#a4513f"/><Text style={[styles.primaryText,{color:'#a4513f'}]}>Delete circle</Text></GlassSurface></Pressable>}
 </View>;
}

export function AddFriendView({discoverable,requested,onAdd,onOpen}){
 const [query,setQuery]=useState('');
 return <View style={{gap:14,paddingTop:16}}>
  <Text style={styles.heading}>Add a friend</Text>
  <GlassSurface style={styles.searchBox}><Search size={16} color="#7e8875"/><TextInput autoFocus value={query} onChangeText={setQuery} autoCapitalize="none" autoCorrect={false} placeholder="Search by name or @username" placeholderTextColor="#9aa592" style={styles.searchInput}/></GlassSurface>
  <FriendSearch embedded query={query} friends={[]} discoverable={discoverable} requested={requested} onAdd={onAdd} onOpen={onOpen}/>
 </View>;
}

const styles=StyleSheet.create({
 bar:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:14},
 chip:{height:32,paddingHorizontal:13,borderRadius:16,flexDirection:'row',alignItems:'center',gap:5,backgroundColor:'#ffffffb0',borderWidth:1,borderColor:'#ffffff'},
 chipOn:{backgroundColor:green,borderColor:green},chipNew:{borderStyle:'dashed',borderColor:'#9fb39f',backgroundColor:'#ffffff50'},
 chipText:{fontFamily:font,fontSize:11,fontWeight:'500',color:ink},
 addBtn:{width:34,height:34,borderRadius:17,backgroundColor:green,alignItems:'center',justifyContent:'center',boxShadow:'0px 4px 12px rgba(49,83,63,0.25)'},
 heading:{fontFamily:font,fontSize:29,letterSpacing:-1.1,color:ink,marginBottom:4},
 card:{borderRadius:25,padding:19},cardTitle:{fontFamily:font,fontSize:12,fontWeight:'600',color:ink,marginBottom:10},
 nameInput:{fontFamily:font,fontSize:20,letterSpacing:-.5,color:ink,paddingVertical:4,...Platform.select({web:{outlineStyle:'none'}})},
 friendRow:{flexDirection:'row',alignItems:'center',gap:11,paddingVertical:10},divider:{borderTopWidth:1,borderTopColor:'#ffffff90'},
 avatar:{borderWidth:2,borderColor:'white',alignItems:'center',justifyContent:'center'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,fontSize:14,color:'#503d32'},
 rowTitle:{fontFamily:font,fontSize:13,color:ink},rowSub:{fontFamily:font,fontSize:10,color:muted,marginTop:3},
 check:{width:20,height:20,borderRadius:10,borderWidth:1.5,borderColor:'#c3cbb8',alignItems:'center',justifyContent:'center'},checkOn:{backgroundColor:green,borderColor:green},
 primary:{backgroundColor:green,backgroundImage:'none',borderColor:green,alignItems:'center',paddingVertical:15},primaryText:{fontFamily:font,fontSize:13,fontWeight:'600',color:'white'},
 deleteBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingVertical:15},
 searchBox:{height:46,borderRadius:23,paddingHorizontal:15,flexDirection:'row',alignItems:'center',gap:10},searchInput:{flex:1,fontFamily:font,fontSize:13,color:ink,height:40,...Platform.select({web:{outlineStyle:'none'}})},
});
