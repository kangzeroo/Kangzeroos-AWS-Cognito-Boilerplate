import axios from 'axios'
import uuid from 'node-uuid'
import {API_URL} from './API_URLS'

export function getBackendResource(){
  const jwtConfig = {headers: {"jwt": localStorage.getItem("user_token")}}
   const p = new Promise((res, rej)=>{
    axios.post(API_URL+"/auth_test", null, jwtConfig)
     .then((data)=>{
      res(data.data)
     })
     .catch((err)=>{
       rej(err)
     })
   })
   return p
}
