const BASE_URL='https://api.kinoxii.redberryinternship.ge/api';
const TOKEN_KEY='cinema-token';

export const getToken=()=>localStorage.getItem(TOKEN_KEY);

export const setToken=(token)=>token? localStorage.setItem(TOKEN_KEY,token):localStorage.removeItem(TOKEN_KEY); 


export class ApiError extends Error{
constructor(status,body) {

    super(body?.message || `Request has  failed with status ${status}`);
    this.status=status;
    this.errors=body?.errors || null;
}

}
export async function request(path) {

    const response=await fetch(BASE_URL+path);
    const data=await response.json();

    if(!response.ok){
        throw new ApiError(response.status,data);
    }
    return data;
}