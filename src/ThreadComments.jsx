import Pressable from './TransitionPressable';
import React from 'react';
import {Image,Platform,StyleSheet,Text,View} from 'react-native';
import {CalendarDays,Check,MessageCircle} from 'lucide-react-native';
const ink='#233d32';
export default function ThreadComments({post,people,me,replies,onReply,onCreateEvent,eventCreated=false}) {
 const base=(post.comments||[]).map((text,index)=>({id:`${post.id}-${index}`,text,person:post.id==='gym'&&index===1?people[2]:people[index%people.length],parentId:null}));
 if(post.id==='gym'&&base.length>1)base.push({id:'gym-confirmation',text:'yes! meet at the entrance',person:post.person,parentId:base[1].id});
 const comments=[...base,...replies.map((r,index)=>typeof r==='string'?{id:`local-${index}`,text:r,person:me,parentId:null}:r)].map(comment=>comment.person.id==='self'?{...comment,person:me}:comment);
 const node=comment=>{
  const children=comments.filter(r=>r.parentId===comment.id);
  return <View key={comment.id} style={styles.node}>
   <View style={styles.comment}>
    <View style={[styles.avatar,{backgroundColor:comment.person.color}]}>{comment.person.avatar?<Image source={{uri:comment.person.avatar}} style={{width:'100%',height:'100%',borderRadius:16}}/>:<Text style={styles.initial}>{comment.person.initial}</Text>}</View>
    <View style={{flex:1}}><Text style={styles.handle}>@{comment.person.handle}</Text><Text style={styles.body}>{comment.text}</Text>{comment.id==='gym-1'&&<Pressable accessibilityRole="button" accessibilityLabel={eventCreated?'View gym event':'Create a 6 PM agenda event with @alexr'} onPress={onCreateEvent} style={styles.eventIndicator}>{eventCreated?<Check size={12} color="#52765b"/>:<CalendarDays size={12} color="#52765b"/>}<Text style={styles.eventText}>{eventCreated?'6 PM · In agenda':'6 PM · Plan with @alexr'}</Text></Pressable>}<Pressable accessibilityRole="button" accessibilityLabel={`Reply to ${comment.person.name}`} onPress={()=>onReply(comment)} style={styles.reply}><MessageCircle size={12} color="#7f8d78"/><Text style={styles.replyText}>Reply</Text></Pressable></View>
   </View>
   {children.length>0&&<View style={styles.children}>{children.map(node)}</View>}
  </View>;
 };
 return <View>{comments.filter(r=>!r.parentId).map(node)}</View>;
}
const styles=StyleSheet.create({eventIndicator:{flexDirection:'row',alignItems:'center',gap:5,alignSelf:'flex-start',marginTop:8,paddingVertical:4},eventText:{fontSize:10,color:'#52765b'},node:{paddingTop:20},comment:{flexDirection:'row',gap:11},avatar:{width:32,height:32,borderRadius:16,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:'#fff'},initial:{fontFamily:Platform.OS==='web'?'Georgia':undefined,color:'#503d32',fontSize:16},handle:{fontSize:11,fontWeight:'600',color:ink},body:{fontSize:14,lineHeight:22,color:ink,marginTop:6},reply:{flexDirection:'row',alignItems:'center',gap:5,alignSelf:'flex-start',paddingVertical:10},replyText:{fontSize:10,color:'#7f8d78'},children:{marginLeft:15,paddingLeft:23,borderLeftWidth:1.5,borderLeftColor:'#a8bcaa',paddingBottom:3}});
