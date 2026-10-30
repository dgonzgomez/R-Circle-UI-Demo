export function pickProfileImage(){
 return new Promise((resolve,reject)=>{
  const input=document.createElement('input');
  input.type='file';input.accept='image/*';
  input.style.display='none';document.body.appendChild(input);
  const cleanup=()=>input.remove();
  input.addEventListener('cancel',()=>{cleanup();resolve(null)},{once:true});
  input.addEventListener('change',()=>{
   const file=input.files?.[0];
   if(!file){cleanup();resolve(null);return;}
   if(!file.type.startsWith('image/')){cleanup();reject(new Error('Choose an image.'));return;}
   const reader=new FileReader();
   reader.onload=()=>{cleanup();resolve(reader.result)};
   reader.onerror=()=>{cleanup();reject(new Error('Could not open that image.'))};
   reader.readAsDataURL(file);
  },{once:true});
  // This click runs directly inside the user's press, preserving user activation.
  input.click();
 });
}
