import axios from 'axios';

import{
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    ACCOUNT_DELETED,
    CLEAR_PROFILE
} from './types';
import { setAlert } from './alert';

export const getCurrentProfile = () => async dispatch =>{
    try {
        const res = await axios.get('/api/profiles/me');
        dispatch({
            type: GET_PROFILE,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type:PROFILE_ERROR,
            payload : { msg: err.response.statusText, status: err.response.status}
        });
    }
}

//action for create or update prof

export const createProfile = (formData,history,edit=false) => async dispatch =>{
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const res= await axios.post('/api/profiles',formData,config);

        dispatch({
            type: GET_PROFILE,
            payload:{profile:res.data}
        })
        dispatch(setAlert(edit ? 'Profile updated':'Profile Created','success'));

        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload : { msg: err.response.statusText, status: err.response.status}
        });
    }
}

//add exp 
export const addExperience = (formData,history,edit=false) => async dispatch => {
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const res= await axios.put('/api/profiles/experience',formData,config);

        dispatch({
            type: UPDATE_PROFILE,
            payload:{profile:res.data}
        })
        dispatch(setAlert('Experience added','success'));

        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload : { msg: err.response.statusText, status: err.response.status}
        });
    }
}


//add edu
export const addEducation = (formData,history,edit=false) => async dispatch => {
    try {
        const config = {
            headers:{
                'Content-Type':'application/json'
            }
        }
        const res= await axios.put('/api/profiles/education',formData,config);

        dispatch({
            type: UPDATE_PROFILE,
            payload:{profile:res.data}
        })
        dispatch(setAlert('Education added','success'));

        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors = err.response.data.errors;
        if(errors){
            errors.forEach(error => dispatch(setAlert(error.msg,'danger')));
        }
        dispatch({
            type:PROFILE_ERROR,
            payload : { msg: err.response.statusText, status: err.response.status}
        });
    }
}

//del exp
export const deleteExperience = id => async dispatch =>{
    try{
        const res = await axios.delete('/api/profiles/experience/'+id);
        dispatch({
            type:UPDATE_PROFILE,
            payload:{profile:res.data}
        });
        dispatch(setAlert('Experience removed','success'));
    }
    catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

//del edu

export const deleteEducation = id => async dispatch =>{
    try{
        const res = await axios.delete('/api/profiles/education/'+id);
        dispatch({
            type:UPDATE_PROFILE,
            payload:{profile:res.data}
        });
        dispatch(setAlert('Education removed','success'));
    }
    catch(err){
        dispatch({
            type: PROFILE_ERROR,
            payload:{msg:err.response.statusText,status:err.response.status}
        });
    }
}

//del acc

export const deleteAccount = id => async dispatch =>{
    if(window.confirm('Are you sure')){
        try{
            const res = await axios.delete('/api/profiles');
            dispatch({type:CLEAR_PROFILE});
            dispatch({type:ACCOUNT_DELETED});
            dispatch(setAlert('Account permanently deleted'));
        }
        catch(err){
            dispatch({
                type: PROFILE_ERROR,
                payload:{msg:err.response.statusText,status:err.response.status}
            });
        }
    }
}