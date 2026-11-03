export const blockTitles={music:'Favorite song',foods:'Favorite foods',photos:'Favorite pictures',interests:'Interests'};
export function defaultBlockData(type,person,photos){
 if(type==='music')return {title:blockTitles.music,song:person.song.split(' · ')[0],artist:person.song.split(' · ')[1]||'',album:person.songAlbum||'',cover:person.songCover||person.image};
 if(type==='foods')return {title:blockTitles.foods,items:person.foods||[{name:'Vanilla Ice Blended',place:'Coffee Bean',image:photos.coffee},{name:'Charburger',place:'The Habit',image:photos.burger}]};
 if(type==='photos')return {title:blockTitles.photos,items:person.pictures||[{image:person.image},{image:photos.garden}]};
 return {title:blockTitles.interests,items:[...person.interests]};
}
export function moveBlock(order,id,offset,heights,gap=14){
 const others=order.filter(key=>key!==id);
 let top=0;let index=0;let closest=Math.abs(offset);
 for(let i=0;i<others.length;i++){
  top+=(heights[others[i]]||130)+gap;
  const distance=Math.abs(offset-top);
  if(distance<closest){closest=distance;index=i+1;}
 }
 return [...others.slice(0,index),id,...others.slice(index)];
}
