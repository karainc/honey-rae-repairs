import { Link } from "react-router-dom"


export const Ticket = ({ ticketObject, currentUser, employees, getAllTickets }) => {

    //find the assigned employee for the current ticket
    let assignedEmployee = null

    if (ticketObject.employeeTickets.length > 0) {
        const ticketEmployeeRelationship = ticketObject.employeeTickets[0]
        assignedEmployee = employees.find(employee => employee.id === ticketEmployeeRelationship.employeeId)
    }

    //find employee profile object for the current user
    const userEmployee = employees.find(employee => employee.userId === currentUser.id)

    //func that determines if current user can close the ticket
    const canClose = () => {
        if (userEmployee?.id === assignedEmployee?.id && ticketObject.dateCompleted === "") {
            return <button onClick={closeTicket} className="ticket__finish">Finish</button>
        }
        else {
            return ""
        }
    }

    // Function that allows customers to delete a ticket that they created
    const deleteButton = () => {
        if (!currentUser.staff) {  //If the person is not staff, return this button
            return <button onClick={() => {
                fetch(`http://localhost:8088/serviceTickets/${ticketObject.id}`, {
                    method: "DELETE"
                })
                    .then(() => {
                        getAllTickets()

                    })
            }} className="ticket__delete">Delete</button>
        }
        else {
            return ""
        }
    }

    //Func that updates the ticket with a new date completed
    const closeTicket = () => {
        const copy = {
            userId: ticketObject.userId,
            description: ticketObject.description,
            emergency: ticketObject.emergency,
            dateCompleted: new Date()
        }
        
        return fetch(`http://localhost:8088/serviceTickets/${ticketObject.id}`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application.json"
            },
            body: JSON.stringify(copy)
        })
        .then(response => response.json())
        .then(getAllTickets)
        
        
    }
    const buttonOrNoButton = () => {
        if (currentUser.staff) {
            return <button
                onClick={() => {
                    fetch(`http://localhost:8088/employeeTickets`, {
                        method: "POST",
                        headers: {
                            "Content=Type" : "application/json"
                        },
                        body: JSON.stringify({
                            employeeId: userEmployee.id,
                            serviceTicketId: ticketObject.id
                        })
                })
                .then(response => response.json())
                .then(() => {
                    getAllTickets()
                })
            }}
            >Claim</button>
        }
        else {
            return ""
        }
    }
    
    return <section className="ticket">
         <header className="ticket__header">
                {
                    currentUser.staff
                    ? `Ticket ${ticketObject.id}`
                    : <Link to={`/tickets/${ticketObject.id}/edit`}>Ticket {ticketObject.id}</Link>
                }
            </header>
            <section>{ticketObject.description}</section>
            <section>Emergency: {ticketObject.emergency ? "Yes" : "No"} </section>
            <footer className="ticket__footer">
                {
                    ticketObject.employeeTickets.length
                    ? `Assigned to ${assignedEmployee !== null ? assignedEmployee?.user?.fullName : ""}`
                    : buttonOrNoButton()
                }
                {
                    canClose()
                }
                   {
                deleteButton()
            }
            </footer>
       
        </section>
    
}
    


