import React from 'react';
import {Platform,View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
// expo-linear-gradient draws nothing in this web build, so web uses a CSS gradient.
export default function Gradient({colors,locations,start={x:0,y:0},end={x:0,y:1},style,pointerEvents='none'}){
 if(Platform.OS!=='web')return <LinearGradient pointerEvents={pointerEvents} colors={colors} locations={locations} start={start} end={end} style={style}/>;
 const angle=Math.round(Math.atan2(end.x-start.x,-(end.y-start.y))*180/Math.PI);
 const stops=colors.map((c,i)=>locations?`${c} ${locations[i]*100}%`:c).join(', ');
 return <View pointerEvents={pointerEvents} style={[style,{backgroundImage:`linear-gradient(${angle}deg, ${stops})`}]}/>;
}
