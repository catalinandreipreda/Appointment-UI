import React from 'react'
import Search from './components/Search'
import AddAppointment from './components/AddAppointment'
import Appointment from './components/Appointment'
import {BiCalendar} from 'react-icons/bi'
import { useState, useEffect, useCallback } from 'react'

export default function App() {
    const [appointmentList, setAppointmentList] = useState([])
    const [query, setQuery] = useState("")
    const [sortBy, setSortBy] = useState("petName")
    const [orderBy, setOrderBy] = useState("asc")
    const filteredAppointements = appointmentList.filter(
        item =>{ return (
            item.petName.toLowerCase().includes(query.toLowerCase()) ||
            item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
            item.aptNotes.toLowerCase().includes(query.toLowerCase())

        )}
        ).sort((a,b) =>{
            let order = (orderBy === 'asc') ? 1 : -1
            let first = a[sortBy]
            let second = b[sortBy]
            return (
                first.toLowerCase() < second.toLowerCase() ? -1*order : order
            ) 
        })

    const fetchData = useCallback(()=>{
        fetch('./data.json')
            .then(response => response.json())
            .then(data =>{
                setAppointmentList(data)
            })
    }, [])
    useEffect(()=>{
        fetchData()
    }, [fetchData])

  return (
      <div className="m-auto w-2/3">
        <h1 className="text-3xl m-5  flex justify-center text-blue-500">
            <BiCalendar className='inline-block align-center text-blue-500'/>
            Your Appointments
        </h1>
        <AddAppointment
            onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
            lastId={appointmentList.reduce((max, item)=> Number(item.id) > max ? Number(item.id) : max, 0)}
        />
        <Search
            query={query}
            onQueryChange = {myQuery => setQuery(myQuery)}
            orderBy = {orderBy}
            onOrderByChange = {myOrder => setOrderBy(myOrder)}
            sortBy = {sortBy}
            onSortByChange = {mySort => setSortBy(mySort)}

        />

        <ul className="divide-y divide-gray-200">
            {
                filteredAppointements.map(appointment => (
                   <Appointment
                     key={appointment.id}
                     appointment = {appointment}
                     onDeleteAppointment = {
                         appointmentId => {
                             setAppointmentList(appointmentList.filter(appointment => 
                                appointment.id !== appointmentId ))
                         }
                     }
                    />
                ))
            }
        </ul>

      </div>
  )
}
