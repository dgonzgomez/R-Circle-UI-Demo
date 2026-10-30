import * as ImagePicker from 'expo-image-picker';
export async function pickProfileImage(kind){
 const result=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],allowsEditing:true,aspect:kind==='avatar'?[1,1]:[16,9],quality:.9});
 return result.canceled?null:result.assets[0].uri;
}
