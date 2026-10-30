import React,{useContext,useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Animated,PanResponder,Platform,Pressable,StyleSheet,View} from 'react-native';
import {moveBlock} from './blockData';
import PreviewScaleContext from './PreviewScaleContext';
const estimated={music:130,foods:232,photos:365,interests:140};
function Block({id,editing,position,active,dragY,onMeasure,onStart,onMove,onDrop,onPress,children}){
 const ref=useRef(null);
 const y=useRef(new Animated.Value(position)).current;
 const lift=useRef(new Animated.Value(0)).current;
 const callbacks=useRef({});callbacks.current={editing,onStart,onMove,onDrop};
 useLayoutEffect(()=>{if(active){y.setValue(position);return;}const motion=Animated.spring(y,{toValue:position,stiffness:280,damping:28,mass:.7,useNativeDriver:true});motion.start();return()=>motion.stop()},[position,active]);
 useEffect(()=>{const motion=Animated.spring(lift,{toValue:active?1:0,stiffness:300,damping:24,mass:.6,useNativeDriver:true});motion.start();return()=>motion.stop()},[active]);
 const pan=useRef(PanResponder.create({
  onMoveShouldSetPanResponder:(_,gesture)=>callbacks.current.editing&&Math.abs(gesture.dy)>7&&Math.abs(gesture.dy)>Math.abs(gesture.dx),
  onPanResponderGrant:()=>callbacks.current.onStart(id),
  onPanResponderMove:(_,gesture)=>callbacks.current.onMove(id,gesture.dy),
  onPanResponderRelease:()=>callbacks.current.onDrop(),
  onPanResponderTerminate:()=>callbacks.current.onDrop(),
  onPanResponderTerminationRequest:()=>false
 })).current;
 const Surface=editing?Pressable:View;
 return <Animated.View {...pan.panHandlers} style={{position:'absolute',left:0,right:0,top:0,zIndex:active?10:1,transform:[{translateY:active?dragY:y},{scale:lift.interpolate({inputRange:[0,1],outputRange:[1,1.025]})}],...Platform.select({web:{touchAction:editing?'none':'auto',cursor:editing?'grab':'auto',userSelect:editing?'none':'auto'}})}}>
 <View ref={ref} onLayout={event=>onMeasure(id,event.nativeEvent.layout.height)}><Surface accessibilityRole={editing?'button':undefined} accessibilityLabel={editing?`Edit ${id} block. Drag to reorder.`:undefined} onPress={editing?()=>ref.current?.measureInWindow((x,y,width,height)=>onPress(id,{x,y,width,height})):undefined}><View pointerEvents={editing?'none':'auto'}>{children}</View></Surface></View>
 </Animated.View>;
}
export default function DraggableBlocks({order,editing,renderItem,onChange,onFocus,onDraggingChange}){
 const scale=useContext(PreviewScaleContext);
 const [heights,setHeights]=useState({});
 const [preview,setPreview]=useState(order);
 const [active,setActive]=useState(null);
 const dragY=useRef(new Animated.Value(0)).current;
 const drag=useRef(null);
 const current=useRef({});
 useEffect(()=>{if(!drag.current)setPreview(order)},[order]);
 const heightMap={...estimated,...heights};let total=0;const positions={};
 for(const id of preview){positions[id]=total;total+=(heightMap[id]||130)+14;}
 current.current={positions,heightMap,preview};
 const start=id=>{
  const top=current.current.positions[id];drag.current={id,top};dragY.setValue(top);setActive(id);onDraggingChange?.(true);
 };
 const move=(id,dy)=>{
  if(!drag.current)return;
  const top=Math.max(0,Math.min(total-(heightMap[id]||130)-14,drag.current.top+dy/scale));
  dragY.setValue(top);
  const next=moveBlock(current.current.preview,id,top,current.current.heightMap);
  if(next.join('|')!==current.current.preview.join('|'))setPreview(next);
 };
 const drop=()=>{
  if(!drag.current)return;
  const id=drag.current.id;const next=[...current.current.preview];
  const motion=Animated.spring(dragY,{toValue:current.current.positions[id],stiffness:280,damping:27,mass:.7,useNativeDriver:true});
  motion.start(({finished})=>{if(finished){drag.current=null;setActive(null);onChange(next);onDraggingChange?.(false)}});
 };
 useEffect(()=>()=>onDraggingChange?.(false),[]);
 return <View style={{height:Math.max(0,total-14)}}>{order.map(id=><Block key={id} id={id} editing={editing} position={positions[id]||0} active={active===id} dragY={dragY} onStart={start} onMove={move} onDrop={drop} onPress={onFocus} onMeasure={(id,height)=>setHeights(current=>Math.abs((current[id]||0)-height)<1?current:{...current,[id]:height})}>{renderItem(id)}</Block>)}</View>;
}
