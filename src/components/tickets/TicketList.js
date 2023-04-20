import { useEffect, useState } from "react"
import "./tickets.css"
import { Ticket } from "./Ticket"
import { useNavigate } from "react-router-dom"

export const TicketList = ({ searchTermState }) => {
    const [tickets, setTickets] = useState([])
    const [employees, setEmployees] = useState([])
    const [filteredTickets, setFiltered] = useState([])
    const [emergency, setEmergency] = useState(false) //don't show emergency tickets by default
    const [openOnly, updateOpenOnly] = useState(false)
    const navigate = useNavigate()

    const localHoneyUser = localStorage.getItem("honey_user")
    const honeyUserObject = JSON.parse(localHoneyUser)

    useEffect(
        () => {
            const searchedTickets = tickets.filter(ticket => {
                return ticket.description.toLowerCase().startsWith(searchTermState)
            })
            setFiltered(searchedTickets)
        },
        [ searchTermState ]
    )
    
    useEffect(
        () => {
            if (emergency) {
                const emergencyTickets = tickets.filter(ticket => ticket.emergency === true)
                setFiltered(emergencyTickets)
            }
            else {
                setFiltered(tickets)
            }
        },
        [emergency]
     )

     const getAllTickets = () => {
       
        fetch (`http://localhost:8088/serviceTickets?_embed=employeeTickets`)
            .then(response => response.json())
            .then((ticketArray) => {
                setTickets(ticketArray)
            })
        }
    
        useEffect(
            () => {
                getAllTickets()
    
                fetch (`http://localhost:8088/employees?_expand=user`) 
                    .then(response => response.json()) 
                    .then((employeeArray) => {
                        setEmployees(employeeArray)
                    })
            },
            [] //When this array is empty, you are observing initial component state
        )

    useEffect(
        () => {
            if (honeyUserObject.staff) {
                    //employees
                setFiltered(tickets)
                    
                }

            else {
                //customers
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
        },
         [tickets]
    )

        useEffect(
            () => {
                if (openOnly) {
                const opentTicketArray = tickets.filter(ticket => {
                    return ticket.userId === honeyUserObject.id && ticket.dateCompleted === ""
                })
                setFiltered(opentTicketArray)
            }
            else {
                const myTickets = tickets.filter(ticket => ticket.userId === honeyUserObject.id)
                setFiltered(myTickets)
            }
            },
            [ openOnly ]
        )

    return <>
    {
        honeyUserObject.staff
        ?<>
            <button onClick={ () => setEmergency(true) }>Emergency Only</button>
            <button onClick={ () => setEmergency(false)} >Show All</button>
        </>
        : <>
            <button onClick={() => navigate("/ticket/create")}>Create Ticket</button>
            <button onClick={() => updateOpenOnly(true)}>Open Ticket</button>
            <button onClick={() => updateOpenOnly(false)}>All My Tickets</button>
        </>
}
    <h2>List of Tickets</h2>
    <article className="tickets">
        {
        filteredTickets.map(
            (ticket) => <Ticket key={`ticket--${ticket.id}`}
            getAllTickets={getAllTickets} //prop sharing the fetch call to rerender after the button is clicked in Ticket.js
            employees= {employees} 
            currentUser={honeyUserObject} //sending the whole object rather than just isStaff = {honeyUserObject.staff}
            ticketObject={ticket} />

             )
          }
        </article>
    </>
} 