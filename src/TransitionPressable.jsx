import React,{createContext,forwardRef,useContext,useRef} from 'react';
import {Pressable} from 'react-native';

export const TransitionOriginContext=createContext(null);

// Record the actual pressed surface before navigation so every detail route can
// expand from its source. Inline controls still handle their own action normally.
const TransitionPressable=forwardRef(function TransitionPressable({onPress,...props},forwardedRef){
 const localRef=useRef(null);
 const recordOrigin=useContext(TransitionOriginContext);
 const assignRef=node=>{
  localRef.current=node;
  if(typeof forwardedRef==='function')forwardedRef(node);
  else if(forwardedRef)forwardedRef.current=node;
 };
 const press=event=>{
  event.stopPropagation();
  event.persist?.();
  const run=origin=>{
   recordOrigin?.(origin);
   try{onPress?.(event)}finally{recordOrigin?.(null)}
  };
  if(recordOrigin&&localRef.current?.measureInWindow){
   localRef.current.measureInWindow((x,y,width,height)=>run({x,y,width,height}));
  }else run(null);
 };
 return <Pressable {...props} ref={assignRef} onPress={onPress?press:undefined}/>;
});
export default TransitionPressable;
