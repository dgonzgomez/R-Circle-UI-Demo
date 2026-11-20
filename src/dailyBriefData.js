export const springSplash={
 id:'spring-splash',title:'Spring Splash',time:'4:00 PM',end:'10:00 PM',
 place:'Bell Tower lawn',kind:'design',day:31,dateLabel:'October 31',
 desc:'Bad Bunny, underscores, and Tinashe. Demo lineup.',
 image:'./spring-splash.jpg',
};
export const briefInvitations=[
 {id:'vraj-basketball',title:'Basketball',time:'7:00 PM',end:'8:00 PM',place:'SRC Basketball Courts',kind:'basketball',day:30,pending:true,invitedBy:{name:'Vraj',handle:'vraj',initial:'V',color:'#d3b08a'},desc:'Want to play basketball at 7?'},
 {id:'maya-spring-splash',title:'Meet before Spring Splash',time:'3:30 PM',end:'4:00 PM',place:'Bell Tower lawn',kind:'design',day:31,pending:true,invitedBy:{name:'Maya',handle:'mayachen',initial:'M',color:'#e6ab87'},desc:'Meet at the Bell Tower before the show.'},
];
export const pollArtists=[{name:'Bad Bunny',initial:'BB',color:'#ddad88'},{name:'underscores',initial:'u',color:'#aab4cf'},{name:'Tinashe',initial:'T',color:'#c4b19b'}];
export function briefPollResults(choice){
 if(!Number.isInteger(choice)||choice<0||choice>=pollArtists.length)return null;
 const counts=[463,286,251].map((votes,index)=>votes+(index===choice?1:0));
 const total=counts.reduce((sum,n)=>sum+n,0);
 const raw=counts.map(n=>n/total*100),percentages=raw.map(Math.floor);
 const order=raw.map((n,i)=>({i,remainder:n-percentages[i]})).sort((a,b)=>b.remainder-a.remainder);
 const remaining=100-percentages.reduce((sum,n)=>sum+n,0);
 for(let i=0;i<remaining;i++)percentages[order[i].i]++;
 return {total,counts,percentages};
}
