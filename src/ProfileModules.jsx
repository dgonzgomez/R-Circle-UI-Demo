import Pressable from './TransitionPressable';
import React,{useEffect,useRef,useState} from 'react';
import {Animated,Platform,StyleSheet,Text,TextInput,View} from 'react-native';
import {CalendarDays,Check,Plus} from 'lucide-react-native';
import GlassSurface from './GlassSurface';
import ModuleCard from './ModuleCard';
import DraggableBlocks from './DraggableBlocks';
import {blockTitles,defaultBlockData} from './blockData';
const ink='#233d32';
const T=({children,style})=><Text style={[styles.text,style]}>{children}</Text>;
export default function ProfileModules({person,isOwn,editing=false,usernameError,onNameChange,onBioChange,photos,onOpenPhoto,onOpenSong,onOpenFood,onAvailability,modules,onChange,blockData,onFocusBlock,onDraggingChange}) {
 const [blockEditing,setBlockEditing]=useState(false);
 const notice=useRef(new Animated.Value(0)).current;
 useEffect(()=>{const animation=Animated.timing(notice,{toValue:editing&&usernameError?1:0,duration:140,useNativeDriver:true});animation.start();return()=>animation.stop()},[editing,usernameError]);
 const missing=Object.keys(blockTitles).filter(type=>!modules.includes(type));
 return <>
 <View style={{paddingHorizontal:3,paddingBottom:4}}>
 {isOwn&&editing&&!!usernameError&&<Animated.View accessibilityRole="alert" accessibilityLiveRegion="polite" style={{opacity:notice,alignSelf:'flex-start',paddingHorizontal:10,paddingVertical:6,marginBottom:9,borderRadius:11,backgroundColor:'#f0d8ce'}}><T style={{fontSize:11,color:'#9b503e'}}>{usernameError}</T></Animated.View>}
 <View style={styles.row}>{isOwn&&editing?<TextInput accessibilityLabel="Display name" value={person.name} onChangeText={onNameChange} placeholder="Your name" multiline style={[styles.inlineName,{flex:1}]}/>:<T style={{fontSize:22,flex:1,letterSpacing:-.6}}>{person.name}</T>}</View>
 {isOwn&&editing?<TextInput accessibilityLabel="Bio" value={person.bio} onChangeText={onBioChange} multiline placeholder="Add a bio" style={styles.inlineBio}/>:<T style={{fontSize:13,color:'#74816e',lineHeight:21,marginTop:8}}>{person.bio}</T>}
 </View>
 <DraggableBlocks order={modules} editing={isOwn&&blockEditing} onChange={onChange} onFocus={(type,bounds)=>onFocusBlock(type,bounds,'edit',0)} onDraggingChange={onDraggingChange} renderItem={type=><ModuleCard type={type} data={blockData[type]||defaultBlockData(type,person,photos)} onFocus={(bounds,index,openItem)=>onFocusBlock(type,bounds,'view',index,openItem)} onOpenSong={onOpenSong} onOpenFood={onOpenFood} onOpenPhoto={onOpenPhoto}/>}/>
 {isOwn?<GlassSurface style={styles.bottom}>{blockEditing?<><View style={[styles.row,{justifyContent:'space-between'}]}><T style={{fontSize:12}}>Edit blocks</T><Pressable accessibilityRole="button" accessibilityLabel="Finish editing blocks" onPress={()=>setBlockEditing(false)} style={styles.done}><Check size={15} color={ink}/><T style={{fontSize:12}}>Done</T></Pressable></View>{missing.map(type=><Pressable key={type} accessibilityRole="button" accessibilityLabel={`Add ${blockTitles[type]} block`} onPress={()=>onChange([...modules,type])} style={[styles.row,{paddingTop:17}]}><Plus size={15} color={ink}/><T style={{fontSize:12}}>{blockTitles[type]}</T></Pressable>)}</>:<Pressable accessibilityRole="button" accessibilityLabel="Edit or add profile blocks" onPress={()=>setBlockEditing(true)} style={[styles.row,{justifyContent:'center'}]}><Plus size={17} color={ink}/><T style={{fontSize:13}}>Edit / add blocks</T></Pressable>}</GlassSurface>:<Pressable onPress={onAvailability} accessibilityRole="button"><GlassSurface style={styles.add}><CalendarDays size={17} color={ink}/><T style={{fontSize:13}}>Find a time to meet</T></GlassSurface></Pressable>}
 </>;
}
const styles=StyleSheet.create({inlineName:{fontSize:22,color:ink,letterSpacing:-.6,paddingVertical:2,...Platform.select({web:{outlineStyle:'none'}})},inlineBio:{fontSize:13,color:'#74816e',lineHeight:21,marginTop:8,paddingVertical:3,...Platform.select({web:{outlineStyle:'none'}})},text:{fontFamily:Platform.OS==='web'?'-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif':undefined,color:ink},row:{flexDirection:'row',alignItems:'center',gap:8},bottom:{borderRadius:24,padding:17},done:{flexDirection:'row',gap:6,alignItems:'center',padding:3},add:{borderRadius:23,minHeight:48,flexDirection:'row',gap:9,alignItems:'center',justifyContent:'center'}});
