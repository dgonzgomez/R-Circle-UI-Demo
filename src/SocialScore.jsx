import React from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {Sparkles} from 'lucide-react-native';
export default function SocialScore({value,label=false,onImage=false}){
 return <View accessibilityLabel={`${value} social score`} style={styles.row}><Sparkles size={14} color="#e9896d"/><Text style={[styles.value,onImage&&{color:'white'}]}>{value}{label&&<Text style={styles.label}> social score</Text>}</Text></View>;
}
const styles=StyleSheet.create({row:{flexDirection:'row',alignItems:'center',gap:7},value:{fontSize:11,color:'#74816e'},label:{color:'#8a9388'}});
