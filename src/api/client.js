const BASE_URL='https://api.kinoxii.redberryinternship.ge/api';
const TOKEN_KEY='cinema-token';

export const getToken=()=>localStorage.getItem(TOKEN_KEY);

export const setToken=(token)=>token? localStorage.setItem(TOKEN_KEY,token):localStorage.removeItem(TOKEN_KEY); 


export class Apierror extends Error{
constructor(status,body) {

    super(body?.message || `Request has  failed with status ${status}`);
    this.status=status;
    this.errors=body?.errors || null;
}

}