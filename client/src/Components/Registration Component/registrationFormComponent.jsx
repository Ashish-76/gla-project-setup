import React, { useState } from "react";
import styles from "./registrationComponent.module.css"
import axios from "axios"
function Register(){


const[user,setUser]=useState({
    name:"",
    email:"",
    password:""
})


function handleChange(e){
    setUser({
        ...user,
        [e.target.name]:e.target.value
    })
}


async function handleSubmit(e){
    e.preventDefault();
try {
    const response= await axios.post("http://localhost:4000/api/auth/register", user)
    alert("Data has been sucessfully submitted")
    setUser({
        name:"",
        email:"",
        password:""
    })

} catch (error) {
    console.log(error)
    alert("Email Already Exists")
}
}


    return(
        <>
        <section>
            <div className={styles.mainContainer}>
                <h2>Student Registration Form</h2>

                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={user.name} type="text" name="name" placeholder="Enter Your Name"/>
                    <br />
                    <br />

                    <input onChange={handleChange} value={user.email} type="text" name="email" placeholder="Enter Your Email"/>
                    <br />
                    <br />

                    <input onChange={handleChange} value={user.password} type="text" name="password" placeholder="Enter Your Password"/>
                    <br />
                    <button>Register</button>
                </form>

            </div>
        </section>
        </>
    )
}
export default Register