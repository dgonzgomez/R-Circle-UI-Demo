const priorities={
 'Outer Circle':['post','event','place','person','club','discovery','review'],
 'Inner Circle':['person','club','event','post','place','discovery','review'],
 Map:['place','discovery','event','person','post','club','review'],
 Agenda:['event','person','club','post','place','discovery','review'],
 Profile:['review','person','post','event','place','club','discovery']
};
const prompts={
 'Outer Circle':['Gym','Study group','Botanic Gardens','Charger'],
 'Inner Circle':['Maya','Design club','Trail collective','Alex'],
 Map:['Coffee','Library','Botanic Gardens','SRC'],
 Agenda:['Design club','Coffee','Gym','Walk'],
 Profile:['Coffee Bean','Charburger','Botanic Gardens']
};
const stopWords=new Set(['a','an','the','find','show','me','my','where','is','are','for','with','at','to','can','i','want','please']);
const normalize=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
export function rankSearch(records,page,query=''){
 const phrase=normalize(query);
 const terms=phrase.split(' ').filter(term=>term&&!stopWords.has(term));
 const order=priorities[page]||priorities.Map;
 return records.map((record,index)=>{
  const title=normalize(record.title);
  const text=normalize([record.title,record.sub,record.text,record.aliases].filter(Boolean).join(' '));
  if(terms.length&&!terms.every(term=>text.includes(term)))return null;
  const position=order.indexOf(record.kind);
  const context=position<0?0:(7-position)*12;
  const lexical=!terms.length?0:title===phrase?120:title.startsWith(phrase)?90:title.includes(phrase)?70:terms.every(term=>title.includes(term))?60:25;
  return {record,score:context+lexical,index};
 }).filter(Boolean).sort((a,b)=>b.score-a.score||a.index-b.index).map(item=>item.record);
}
export function searchSuggestions(records,page,query=''){
 if(!query.trim())return prompts[page]||prompts.Map;
 return [...new Set(rankSearch(records,page,query).map(record=>record.title))].slice(0,4);
}
