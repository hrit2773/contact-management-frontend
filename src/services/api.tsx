
export const fetchContacts=async ()=>{
    try {
        const res=await fetch('http://localhost:8080/contacts/',{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })
        if (!res.ok){
            const errorData=await res.json()
            throw new Error(errorData[0].message)
        }
        return await res.json()
    } catch (error:any) {
        return [{msg:error.message}]
    }
}

export const fetchContactById=async (id:string)=>{
    try {
        const res=await fetch(`http://localhost:8080/contacts/${id}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        })
        if (!res.ok){
            const errorData=await res.json()
            throw new Error(errorData[0].message)
        }
        return await res.json()
    } catch (error:any) {
        return [{msg:error.message}]
    }
}

export const postContacts=async (contact:any)=>{
    try {
        const res=await fetch('http://localhost:8080/contacts/',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(contact)
        })
        if (!res.ok){
            const errorData=await res.json()
            throw new Error(errorData[0].message)
        }
        return await res.json()
    } catch (error:any) {
        return [{msg:error.message}]
    }
}

export const updateContacts=async (id:string,contact:any)=>{
    try {
        const res=await fetch(`http://localhost:8080/contacts/${id}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(contact)
        })
        if (!res.ok){
            const errorData=await res.json()
            throw new Error(errorData[0].message)
        }
        return await res.json()
    } catch (error:any) {
        return [{msg:error.message}]
    }
}

export const deleteContacts=async (ids:{ids:string[]})=>{
    try {
        const res=await fetch(`http://localhost:8080/contacts/`,{
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(ids)
        })
        if (!res.ok){
            const errorData=await res.json()
            throw new Error(errorData[0].message)
        }
        return await res.json()
    } catch (error:any) {
        return [{msg:error.message}]
    }
}