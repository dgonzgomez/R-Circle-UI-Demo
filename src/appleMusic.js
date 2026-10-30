export function appleMusicUrl(song){
 if(song.song.trim().toLowerCase()==='franklin'&&song.artist.trim().toLowerCase()==='paramore')return 'https://music.apple.com/us/song/606661232';
 return `https://music.apple.com/us/search?term=${encodeURIComponent(`${song.song} ${song.artist}`.trim())}`;
}
