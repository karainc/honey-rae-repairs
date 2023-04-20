import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export const EmployeeDetails =() => {
    const {employeeId} = useParams()
    const [employee, updateEmployee] = useState()

    useEffect(
        () => {
            fetch(``)
            .then(response => response.json())
            .then(() => {

            })
        },
        [employeeId]
    )

    return  <></>
}