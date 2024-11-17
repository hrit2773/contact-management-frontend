import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useEffect, useReducer, useState } from "react"
import { contactFormReducer, initErrors, initialState } from "../reducers/formReducers"
import { fetchContactById, postContacts, updateContacts } from "../services/api"
import { useNavigate, useParams } from "react-router-dom"
import CircularProgress from "@mui/material/CircularProgress"
import ErrorPage from "./ErrorPage"

function ContactForm() {
    const [formState,dispatch]=useReducer(contactFormReducer,initialState)
    const navigate=useNavigate()
    const {contact_id}=useParams()
    const [error,setError]=useState("")
    const [isLoading,setLoading]=useState(false)

    useEffect(()=>{
        if (contact_id){
            const fetchContact = async () => {
                setLoading(true)
                const result = await fetchContactById(contact_id)
                if (result[0]?.message) {
                  setError(result[0].message)
                } 
                else {
                    const {email,phone,company,job_title}=result
                    dispatch({type:'set_fields',payload:{
                        email,
                        phone,
                        company,
                        job_title,
                        first_name: result.name.split(' ')[0],
                        last_name:result.name.split(' ')[1]
                    }})
                }
                setLoading(false)
              };
          
            fetchContact();
        }
    },[])

    const validateForm=()=>{
        const errors={...initErrors}
        let invalidForm=false
        Object.keys(formState.form).forEach((field)=>{
            switch (field){
                case 'first_name':
                    if (!formState.form[field]){
                        errors[field]="Please enter the first name"
                        invalidForm=true
                    }
                    return
                case 'last_name':
                    if (!formState.form[field]){
                        errors[field]="Please enter the last name"
                        invalidForm=true
                    }
                    return
                case 'email':
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    if (!formState.form[field]){
                        errors[field]="Please enter the email"
                        invalidForm=true
                    }
                    else if (!emailRegex.test(formState.form[field])){
                        errors[field]="Email Id is invalid"
                        invalidForm=true
                    }
                    return
                case 'phone':
                    const phoneRegex = /^\d{10}$/
                    if (!formState.form[field]){
                        errors[field]="Please enter the phone number"
                        invalidForm=true
                    }
                    else if (!phoneRegex.test(formState.form[field])){
                        errors[field]="Phone number is invalid"
                        invalidForm=true
                    }
                    return
                case 'company':
                    if (!formState.form[field]){
                        errors[field]="Please enter the company name"
                        invalidForm=true
                    }
                    return
                case 'job_title':
                    if (!formState.form[field]){
                        errors[field]="Please enter the job title"
                        invalidForm=true
                    }
                    return
            }
        })
        if (invalidForm){
            dispatch({type:'set_errors',payload:errors})
            return false
        }
        dispatch({type:'set_errors',payload:errors})
        return true
    }
    const handleSubmit=async ()=>{
        const validated=validateForm()
        if (validated){
            const {first_name,last_name,email,phone,company,job_title}=formState.form
            const contact={
                name:`${first_name} ${last_name}`,
                email,
                phone,
                company,
                job_title
            }
            if (!contact_id){
                await postContacts(contact)
            }
            else{
                await updateContacts(contact_id,contact)
            }
            dispatch({type:'reset_fields'})
            dispatch({type:'reset_errors'})
        }
    }
    const handleChange=(e:any)=>{
        console.log(e.target.value)
        dispatch({
            type:'set_field',
            name:e.target.name,
            payload:e.target.value
        })
    }
    return (
        <div className="flex justify-center items-center h-screen w-screen bg-slate-100">
            {isLoading?(
                <div className=' h-screen w-screen flex justify-center items-center'>
                    <CircularProgress size="3rem" />
                </div>
            ):(
                <div>

                    {error?(
                        <ErrorPage
                            errorMessage={error} 
                        />
                    ):(
                        <div className=" flex flex-col gap-4 bg-white p-6 min-h-[400px] w-[600px] border-2 rounded-lg shadow-lg border-gray-400">
                            <div className=" text-center font-bold text-3xl">New Contact</div>
                            <div className="w-[100%] flex flex-col gap-5">
                                <div className="flex gap-4">
                                    <TextField 
                                        className="flex-grow" 
                                        name="first_name"
                                        id="outlined-firstname" 
                                        label="First name" 
                                        variant="outlined" 
                                        value={formState.form.first_name}
                                        onChange={handleChange}
                                        error={formState.errors.first_name}
                                        helperText={formState.errors.first_name}
                                    />
                                    <TextField 
                                        className="flex-grow" 
                                        name="last_name"
                                        id="outlined-lastname" 
                                        label="Last name" 
                                        variant="outlined" 
                                        value={formState.form.last_name}
                                        onChange={handleChange}
                                        error={formState.errors.last_name}
                                        helperText={formState.errors.last_name}
                                    />
                                </div>
                                <div className="flex">
                                    <TextField 
                                        className="flex-grow" 
                                        name="email"
                                        id="outlined-firstname" 
                                        label="Email" 
                                        variant="outlined"
                                        value={formState.form.email}
                                        onChange={handleChange}
                                        error={formState.errors.email}
                                        helperText={formState.errors.email} 
                                    />
                                </div>
                                <div className="flex">
                                    <TextField 
                                        className="flex-grow" 
                                        name="phone"
                                        id="outlined-lastname" 
                                        label="Phone" 
                                        variant="outlined" 
                                        onChange={handleChange}
                                        value={formState.form.phone}
                                        error={formState.errors.phone}
                                        helperText={formState.errors.phone}
                                    />
                                </div>
                                <div className="flex">
                                    <TextField 
                                        className="flex-grow" 
                                        name="company"
                                        id="outlined-lastname" 
                                        label="Company" 
                                        variant="outlined" 
                                        value={formState.form.company}
                                        onChange={handleChange}
                                        error={formState.errors.company}
                                        helperText={formState.errors.company}
                                    />
                                </div>
                                <div className="flex">
                                    <TextField 
                                        className="flex-grow" 
                                        name="job_title"
                                        id="outlined-lastname" 
                                        label="Job Title" 
                                        variant="outlined" 
                                        value={formState.form.job_title}
                                        onChange={handleChange}
                                        error={formState.errors.job_title}
                                        helperText={formState.errors.job_title}
                                    />
                                </div>
                            
                            </div>
                            <div className=" text-sm text-blue-500 text-center">
                                <span 
                                    className="cursor-pointer"
                                    onClick={()=>{navigate('/')}}
                                >
                                    View Contacts
                                </span>
                            </div>
                            <Button onClick={handleSubmit} variant="contained">{contact_id? "Update Contact":"Add contact"}</Button>
                        </div>
    
                    )}
                </div>
            )}
        </div>
    )
}

export default ContactForm
