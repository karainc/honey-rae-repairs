import { useState, useEffect } from "react"
import "./Customers.css"
import { Customer } from "./Customer"

// set its initial state, fetch all the employees from API, and in JSX, will render a list of employees
export const CustomerList = () => {
    const [customers, setCustomers] = useState([])

    useEffect(
        () => {
            fetch(`http://localhost:8088/users?isStaff=false`) //? - query; isStaff=true - setting parameters for that boolean to find only values that are true
            .then (response => response.json())
            .then((customerArray) => {
                setCustomers(customerArray)
            })
        },
        []
    )

    return <article className="customers">
        {
            customers.map(customer => <Customer key={`customer--${customer.id}`}
                id={customer.id} 
                fullName={customer.fullName} 
                email={customer.email}
                address={customer.address}
                phoneNumber={customer.phoneNumber} />)
        }
    </article>
}