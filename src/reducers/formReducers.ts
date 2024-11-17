export const initContactForm={
    first_name:'',
    last_name:'',
    email:'',
    phone:'',
    company:'',
    job_title:''
}

export const initErrors=Object.assign(
    {},
    ...Object.keys(initContactForm).map((k)=>({[k]:""}))
)

export const initialState={
    form:{...initContactForm},
    errors:{...initErrors}
}

export const contactFormReducer=(state:any,action:any)=>{
    switch (action.type){
        case 'set_field':
            return {...state,form:{...state.form,[action.name]:action.payload}}
        case 'set_fields':
            return {...state,form:{...action.payload}}
        case 'reset_fields':
            return {...state,form:{...initContactForm}}
        case 'set_errors':
            return {...state,errors:{...action.payload}}
        case 'reset_errors':
            return {...state,errors:{...initErrors}}
        default:
            return state
    }
}
