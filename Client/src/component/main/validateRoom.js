const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
const validateRoom = async(room) => {
  try{
    const response = await fetch(BACKEND_URI+"/rooms/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({room}),
    });
    if(!response)return false;
    const data= await response.json();
    return data.exists;
    
  }
  catch(e){
    console.log(e);
    return false;
  }
}
export const verify =async(username,token)=>{
  if(!username || !token)return false;
    let response = await fetch(BACKEND_URI+"/auth/verification", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        AuthToken: token,
      },
    });
    response = await response.json();
    return response.username ===username;
}
export default validateRoom;