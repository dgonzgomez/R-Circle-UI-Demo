export function validateUsername(input,takenHandles=[]){
 const username=input.replace(/^@+/,'').toLowerCase();
 if(!username)return {username,error:'Enter a username'};
 if(!/^[a-z0-9_.]{1,24}$/.test(username))return {username,error:'Use letters, numbers, periods, or underscores'};
 if(takenHandles.some(handle=>handle.toLowerCase()===username))return {username,error:'Username taken'};
 return {username,error:''};
}
