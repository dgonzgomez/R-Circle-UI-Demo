import React from 'react';
import Svg,{Circle,Path,Rect} from 'react-native-svg';

// Status glyphs traced to the iPhone status bar: four cellular bars, the
// three-arc Wi-Fi mark, and the rounded battery with its side cap.
export function SignalIcon({color}){
 const bars=[3.5,6.2,8.8,11.5];
 return <Svg width={17} height={12} viewBox="0 0 17 12">
  {bars.map((height,index)=><Rect key={index} x={index*4.55} y={12-height} width={3} height={height} rx={0.7} fill={color}/>)}
 </Svg>;
}
export function WifiIcon({color}){
 return <Svg width={16} height={12} viewBox="0 0 16 12">
  <Path d="M1.05 4.55a8.15 8.15 0 0 1 13.9 0" stroke={color} strokeWidth={1.55} strokeLinecap="round" fill="none"/>
  <Path d="M3.25 6.75a5 5 0 0 1 9.5 0" stroke={color} strokeWidth={1.55} strokeLinecap="round" fill="none"/>
  <Path d="M5.45 8.85a2.15 2.15 0 0 1 5.1 0" stroke={color} strokeWidth={1.55} strokeLinecap="round" fill="none"/>
  <Circle cx={8} cy={10.75} r={1.05} fill={color}/>
 </Svg>;
}
export function BatteryIcon({color}){
 return <Svg width={27} height={13} viewBox="0 0 27 13">
  <Rect x={0.5} y={0.5} width={23} height={12} rx={3.5} stroke={color} strokeWidth={1} fill="none" opacity={0.35}/>
  <Rect x={2} y={2} width={20} height={9} rx={1.7} fill={color}/>
  <Rect x={24.5} y={4.15} width={1.55} height={4.7} rx={0.75} fill={color} opacity={0.4}/>
 </Svg>;
}
