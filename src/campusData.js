// UCR building names and centers from OpenStreetMap (© OpenStreetMap contributors).
export const UCR_CENTER=[33.9737,-117.3276];
export const buildings=[
 {name:'Highlander Union Building',short:'HUB',pos:[33.97431,-117.3288],place:'Coffee Bean'},
 {name:'Tomas Rivera Library',short:'Rivera Library',pos:[33.97265,-117.32754],place:'Rivera Library'},
 {name:'Bell Tower',pos:[33.97334,-117.32817]},
 {name:'Orbach Science Library',short:'Orbach Library',pos:[33.97457,-117.32442]},
 {name:'Bourns Hall',pos:[33.97539,-117.32699]},
 {name:'Winston Chung Hall',pos:[33.97537,-117.32593]},
 {name:'Materials Science and Engineering',short:'MSE',pos:[33.97629,-117.32797]},
 {name:'University Lecture Hall',short:'Lecture Hall',pos:[33.97566,-117.32838]},
 {name:'Arts',short:'Arts Building',pos:[33.97496,-117.33158]},
 {name:'Student Services',pos:[33.97415,-117.32979]},
 {name:'Student Success Center',pos:[33.9742,-117.33056]},
 {name:'Costo Hall',pos:[33.97422,-117.32922]},
 {name:'UCR Bookstore',short:'Bookstore',pos:[33.9752,-117.32819]},
 {name:'Pierce Hall',pos:[33.97423,-117.32718]},
 {name:'Physics',pos:[33.97469,-117.32529]},
 {name:'Chemical Sciences',pos:[33.97437,-117.32303]},
 {name:'Sproul Hall',pos:[33.97278,-117.32974]},
 {name:'Watkins Hall',pos:[33.97259,-117.32894]},
 {name:'Humanities and Social Sciences',short:'HMNSS',pos:[33.97284,-117.33096]},
 {name:'Olmsted Hall',pos:[33.97133,-117.32814]},
 {name:'Spieth Hall',pos:[33.9726,-117.32647]},
 {name:'Batchelor Hall',pos:[33.97245,-117.32531]},
 {name:'Boyce Hall',pos:[33.9735,-117.32492]},
 {name:'School of Medicine',pos:[33.97379,-117.32408]},
 {name:'Psychology',pos:[33.97064,-117.32752]},
 {name:'Student Recreation Center',short:'SRC',pos:[33.97889,-117.32815],place:'SRC'},
 {name:'Student Health and Counseling',short:'Student Health',pos:[33.97894,-117.32341]},
 {name:'Glasgow',pos:[33.97784,-117.32459]},
 {name:'Aberdeen-Inverness',pos:[33.97838,-117.3257]},
 {name:'Lothian Residential Restaurant',short:'Lothian',pos:[33.97565,-117.3225]},
 {name:'Veitch Student Center',pos:[33.97651,-117.32512]},
 {name:'UCR Botanic Gardens',short:'Botanic Gardens',pos:[33.9689,-117.31893],place:'UCR Botanic Gardens'},
];
// Where things are, for pins: matched against an event's place or a friend's "where".
export const spots=[
 {match:/coffee bean/i,pos:[33.97453,-117.32809]},
 {match:/\bhub\b/i,pos:[33.97431,-117.3288]},
 {match:/rivera/i,pos:[33.97265,-117.32754]},
 {match:/bell tower/i,pos:[33.97334,-117.32817]},
 {match:/arts/i,pos:[33.97496,-117.33158]},
 {match:/botanic|garden/i,pos:[33.9689,-117.31893]},
 {match:/\bsrc\b|recreation/i,pos:[33.97889,-117.32815]},
 {match:/habit/i,pos:[33.97440,-117.32860]},
 {match:/orbach/i,pos:[33.97457,-117.32442]},
 {match:/bourns/i,pos:[33.97539,-117.32699]},
 {match:/glasgow/i,pos:[33.97784,-117.32459]},
 {match:/lothian/i,pos:[33.97565,-117.3225]},
];
export const spotFor=text=>spots.find(s=>s.match.test(text||''))?.pos||null;

// Demo clock: Friday, Oct 30, 9:41 AM (matches the status bar).
export const NOW={day:30,minutes:9*60+41};
const dayIndex=d=>d===1?32:d; // Nov 1 follows Oct 31
export const daysAway=e=>e.inDays??(dayIndex(e.day)-NOW.day);
// Pin color by how soon an event starts relative to now.
export function timing(event,startMinutes,endMinutes){
 const d=daysAway(event);
 const start=d*1440+startMinutes-NOW.minutes;
 const end=d*1440+(endMinutes??startMinutes+60)-NOW.minutes;
 if(end<0)return {key:'past',color:'#a3aa9c',label:'Ended'};
 if(d===0)return {key:start<=0?'now':'today',color:'#e5793d',label:start<=0?'Happening now':'Today'};
 if(d<=6)return {key:'week',color:'#5f9a6e',label:d===1?'Tomorrow':'This week'};
 return {key:'month',color:'#7d8fae',label:'This month'};
}
export const legend=[['#e5793d','Today'],['#5f9a6e','This week'],['#7d8fae','This month']];

// Lucide icon shapes (ISC) used inside map pins.
export const pinIcons={"coffee": "<path d=\"M10 2v2\"/><path d=\"M14 2v2\"/><path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\"/><path d=\"M6 2v2\"/>", "walk": "<path d=\"M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z\"/><path d=\"M7 16v6\"/><path d=\"M13 19v3\"/><path d=\"M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5\"/>", "design": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\"/><path d=\"M20 2v4\"/><path d=\"M22 4h-4\"/><circle cx=\"4\" cy=\"20\" r=\"2\"/>", "gym": "<path d=\"M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z\"/><path d=\"m2.5 21.5 1.4-1.4\"/><path d=\"m20.1 3.9 1.4-1.4\"/><path d=\"M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z\"/><path d=\"m9.6 14.4 4.8-4.8\"/>", "event": "<path d=\"M8 2v3\"/><path d=\"M16 2v3\"/><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"/><path d=\"M3 9h18\"/><path d=\"M8 13h.01\"/><path d=\"M12 13h.01\"/><path d=\"M16 13h.01\"/><path d=\"M8 17h.01\"/><path d=\"M12 17h.01\"/><path d=\"M16 17h.01\"/>"};
export const pinIconFor=e=>/gym|src|workout/i.test(`${e.title} ${e.place}`)?'gym':pinIcons[e.kind]?e.kind:'event';
export const YOU=[33.9741,-117.3283];

// Demo campus-wide events and discoveries for the map. Photos: Wikimedia Commons (CC-licensed).
export const campusEvents=[{"title": "Coffee hour with the Writing Center", "time": "10:00 AM", "end": "11:00 AM", "place": "HUB · Upper plaza", "kind": "coffee", "day": 30, "desc": "Free drip coffee and quick essay feedback on the plaza.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/UCR_Hub_View.png/960px-UCR_Hub_View.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97455, -117.32905], "inDays": 0}, {"title": "Club fair", "time": "11:30 AM", "end": "1:30 PM", "place": "Bell Tower lawn", "kind": "design", "day": 30, "desc": "Over 80 student orgs tabling around the Bell Tower. Grab stickers and sign-ups.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/UC_Riverside_campus_as_viewed_from_Box_Spring_Mountain.jpg/960px-UC_Riverside_campus_as_viewed_from_Box_Spring_Mountain.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97318, -117.32838], "inDays": 0}, {"title": "Study jam", "time": "1:00 PM", "end": "3:00 PM", "place": "Rivera Library · 2nd floor", "kind": "design", "day": 30, "desc": "Quiet group study with snacks from ASUCR.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Rivera_Library.JPG/960px-Rivera_Library.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97248, -117.32735], "inDays": 0}, {"title": "Rock wall night", "time": "7:00 PM", "end": "9:00 PM", "place": "SRC · Climbing wall", "kind": "gym", "day": 30, "desc": "Beginner-friendly climbing with free shoe rentals.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Student_Recreation_Center_%28UC_Riverside%29.jpg/960px-Student_Recreation_Center_%28UC_Riverside%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97872, -117.32835], "inDays": 0}, {"title": "Sunrise yoga in the gardens", "time": "8:00 AM", "end": "9:00 AM", "place": "UCR Botanic Gardens", "kind": "walk", "day": 31, "desc": "Bring a mat. Meet at the garden entrance.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/06/UCR_Botanic_Gardens.jpg/960px-UCR_Botanic_Gardens.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.96915, -117.31935], "inDays": 1}, {"title": "Fall career fair", "time": "10:00 AM", "end": "2:00 PM", "place": "SRC · Arena", "kind": "design", "inDays": 6, "dateLabel": "Thursday, November 5", "desc": "Meet 120+ employers. Bring a few copies of your resume.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Student_Recreation_Center_Arena_%28Cal_Riverside%29.jpg/960px-Student_Recreation_Center_Arena_%28Cal_Riverside%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97905, -117.328]}, {"title": "Open mic night", "time": "8:00 PM", "end": "10:00 PM", "place": "The Barn", "kind": "design", "inDays": 9, "dateLabel": "Sunday, November 8", "desc": "Music, poetry and comedy. Sign-ups at the door.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Exterior_view_of_the_Riverside_Public_Library%2C_ca.1910_%28CHS-5278%29.jpg/960px-Exterior_view_of_the_Riverside_Public_Library%2C_ca.1910_%28CHS-5278%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97225, -117.3306]}, {"title": "Campus farmers market", "time": "11:00 AM", "end": "3:00 PM", "place": "HUB · Lawn", "kind": "coffee", "inDays": 13, "dateLabel": "Thursday, November 12", "desc": "Local produce, flowers and kettle corn.", "img": "https://upload.wikimedia.org/wikipedia/commons/c/cf/University_Village_%28University_of_California%2C_Riverside%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled", "pos": [33.974, -117.32935]}, {"title": "Garden lantern walk", "time": "6:00 PM", "end": "7:30 PM", "place": "UCR Botanic Gardens", "kind": "walk", "inDays": 21, "dateLabel": "Friday, November 20", "desc": "An evening stroll lit by paper lanterns.", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/UCR_from_botanical_gardens.JPG/960px-UCR_from_botanical_gardens.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.969, -117.3199]}];
export const discoveries=[{"title": "Bell Tower at blue hour", "by": "bluehour.bri", "place": "Bell Tower", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Belltower.jpg/960px-Belltower.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.97345, -117.32795]}, {"title": "Rose garden hidden path", "by": "rosepetal.jo", "place": "UCR Botanic Gardens", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Palmetto_Sunrise_2.png/960px-Palmetto_Sunrise_2.png?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.96872, -117.3186]}, {"title": "Bench with the best view", "by": "trail.mix.tom", "place": "UCR Botanic Gardens", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Bench_view%2C_UCR_Botanic_Garden.jpg/960px-Bench_view%2C_UCR_Botanic_Garden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.9693, -117.3184]}, {"title": "Snow on the mountains", "by": "peakseeker", "place": "Above the Botanic Gardens", "img": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/UCR_from_botanical_gardens.JPG/960px-UCR_from_botanical_gardens.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail", "pos": [33.9696, -117.3195]}, {"title": "Sunset behind the halls", "by": "golden.gabe", "place": "Near Aberdeen-Inverness", "img": "https://upload.wikimedia.org/wikipedia/commons/c/cf/Sunset%2C_UCR.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled", "pos": [33.97815, -117.32605]}];
// Demo utility spots (printer and market locations are illustrative, near the named buildings).
export const utilitySpots=[{"kind": "printer", "title": "R’Print station", "place": "Tomas Rivera Library · 1st floor", "note": "Black & white and color. Swipe your R’Card. Usually no line before 10 AM.", "by": "inkwizard", "pos": [33.97282, -117.32772]}, {"kind": "printer", "title": "R’Print station", "place": "Orbach Science Library · Lobby", "note": "Two printers by the entrance. The left one jams less.", "by": "lab.rat.lena", "pos": [33.9744, -117.3246]}, {"kind": "printer", "title": "R’Print station", "place": "HUB · Computer lab", "note": "Handy between classes. Staples at the front desk.", "by": "kevin.v", "pos": [33.97418, -117.3286]}, {"kind": "printer", "title": "R’Print station", "place": "Student Success Center · 2nd floor", "note": "Quiet and almost always free.", "by": "ari.m", "pos": [33.9743, -117.3304]}, {"kind": "printer", "title": "R’Print station", "place": "Bourns Hall · Engineering lab", "note": "Engineering students get free pages each quarter.", "by": "circuit.sam", "pos": [33.97552, -117.3268]}, {"kind": "market", "title": "Scotty’s Market", "place": "Pentland Hills", "note": "Snacks, cold drinks and late-night ramen. Open until midnight.", "by": "midnight.snacker", "pos": [33.97792, -117.3206]}, {"kind": "market", "title": "Scotty’s Market", "place": "Glasgow", "note": "Fresh fruit cups and grab-and-go sushi.", "by": "dani.eats", "pos": [33.9777, -117.3248]}, {"kind": "market", "title": "Scotty’s Market", "place": "Aberdeen-Inverness", "note": "Best spot for instant coffee and microwave popcorn.", "by": "theo.r", "pos": [33.9785, -117.3259]}, {"kind": "market", "title": "Scotty’s Market", "place": "Lothian", "note": "Stocks the good hot sauce. Swipes accepted.", "by": "spice.lord", "pos": [33.97578, -117.3227]}];
export const utilityIcons={"printer": "<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\"/><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\"/>", "shopping-basket": "<path d=\"m15 11-1 9\"/><path d=\"m19 11-4-7\"/><path d=\"M2 11h20\"/><path d=\"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4\"/><path d=\"M4.5 15.5h15\"/><path d=\"m5 11 4-7\"/><path d=\"m9 11 1 9\"/>"};
