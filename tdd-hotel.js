class Room {
    constructor(roomNumber, roomType, roomPrice, roomIsAvailable) {
        // Validation of reported values

        // Is the room number a integer?
        if(!(Number.isInteger(roomNumber))) {
            throw new Error("The room number is not a valid value.")
        }

        // Is the room price a number?
        if(!(typeof roomPrice === 'number')) {
            throw new Error("The room price is not a valid value, please try with some value like 90.00")
        }

        // Is the room available a boolean?
        if(!(typeof roomIsAvailable === 'boolean')) {
            throw new Error("The room avaliable wanna be a value 'true' or 'false' like a boolean")
        }

        // Is the room type a valid type (single, double or suite)?
        switch (roomType.toLowerCase()) {
            case "single":
                roomType = "single"
                break
            case "double":
                roomType = "double"
                break
            case "suite":
                roomType = "suite"
                break
            default:
                throw new Error("The room type is not a valid value, please try again with 'single', 'double' or 'suite'")
        }

        // Public instances
        this.roomNumber = roomNumber,
        this.roomType = roomType,
        this.roomPrice = roomPrice

        // Private instances
        this._roomIsAvailable = roomIsAvailable
    }

    // Getters
    getRoomAvailable(){
        return this._roomIsAvailable
    }

    //Setters
    setRoomAvailable(value){
        this._roomIsAvailable = value
    }

    // Change room availability when a user makes or cancels a reservation.
    toggleAvailability() {
        this.getRoomAvailable() ? this.setRoomAvailable(false) : this.setRoomAvailable(true)
    }
}

class Reservation {
    constructor(room, guestName, startDate, endDate) {

        // Validation of reported values

        // Is the room available?
        if(room.getRoomAvailable() != true) {
            throw new Error("The room is not available.")
        }

        // Is the variable room a Room instance?
        if(!(room instanceof Room)){
            throw new Error("The variable room is not a instance of the Room class.")
        }

        // Is the guest name a string?
        if(!(typeof guestName === "string")){
            throw new Error("The variable guestName is nota a string")
        }
  
        startDate = this.dateValidation(startDate)
        endDate = this.dateValidation(endDate)

        // Date availability validation

        // Is the startDate before the endDate?
        const formatStartDate = new Date(`${startDate.substring(6)}-${startDate.substring(3, 5)}-${startDate.substring(0, 2)}`)
        const formatEndDate = new Date(`${endDate.substring(6)}-${endDate.substring(3, 5)}-${endDate.substring(0, 2)}`)
        const startEndDiference = (formatEndDate - formatStartDate) / (1000 * 60 * 60 * 24)
        if(Math.sign(startEndDiference) === -1) {
            throw new Error("The start date can not be latest than the end date")
        }

        // Is the startDate befor the currentDate?
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear()
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0')
        const currentDay = String(currentDate.getDate()).padStart(2, '0')
        const formatCurrentDate = new Date(`${currentYear}-${currentMonth}-${currentDay}`)
        const startCurrentDiference = (formatStartDate - formatCurrentDate) / (1000 * 60 * 60 * 24)
        if(Math.sign(startCurrentDiference) === -1) {
            throw new Error("The start date cannot be earlier than the current date.")
        }
        
        // Public instances
        room.toggleAvailability()
        this.room = room,
        this.guestName = guestName,
        this.startDate = startDate,
        this.endDate = endDate
    }

    dateValidation(date) {

        // Validation of reported values

        // Format the date witch default values
        date = date.replace(/\//g, "-").replace(/\s+/g, "")

        // Does the date follow the 10 character pattern?
        if(date.length != 10) {
            throw new Error("The date has more than 10 characters dd-mm-aaaa")
        }

        // Does the date have more than 2 separators "-"?
        var charCount = 0
        for(let c = 0; c < date.length-1; c++){
            if(typeof (parseInt(date[c])) != "number") {
                throw new Error("Some character in the date is not a number.")
            }
            if(date[c] == "-"){
                charCount++
            }
        }
        if(charCount != 2) {
            throw new Error("More than 2 '/' or '-' in the date.")
        }

        return date
    }

    // Return a string with informations from the reservation.
    getReservationDetails() {
        return `The reservation is in ${this.guestName}'s name, and check-in is scheduled for the ${this.startDate}, while check-out is scheduled for the ${this.endDate}`
    }
}

class Hotel{
    constructor(rooms, reservations) {

        // Validation of reported values

        // Is the variable rooms an array?
        if(!(Array.isArray(rooms))){
            throw new Error("The parameter rooms must be an Array.")
        }

        // Are the objects inside the rooms array a instance of room?
        for(var room in rooms) {
            if(!(rooms[room] instanceof Room)) {
                throw new Error("The index position " + room + " in the list is not an instance of Book.")
            }
        }

        // Public instances
        this.rooms = rooms
        this.reservations = reservations
    }

    //ROOMS

    // Makes a instance of room with the parameters and push him in to the rooms array.
    addRoom(roomNumber, roomType, roomPrice, roomIsAvailable) {
        const roomQuery = this.rooms.filter((room) => room.roomNumber === roomNumber)
        if(roomQuery != 0) { 
            throw new Error("The room number is already in the room list.")
        }
        const room = new Room(roomNumber, roomType, roomPrice, roomIsAvailable) 
        this.rooms.push(room) 
    }

    // Show all rooms with the status true in roomIsAvailable.
    listAvailableRooms(){
        const availableArray = this.rooms.filter(room => room.getRoomAvailable() === true)
        console.log("======================================================================================================================")
        for(var room in availableArray){
            console.log("Room number " + availableArray[room].roomNumber + " is available. The room is a " + availableArray[room].roomType + " and costs R$" + availableArray[room].roomPrice + " per night.")
            console.log("======================================================================================================================")
        }
        return availableArray
    }

    //RESERVATION

    // Makes a instance of reservation with he parameters and push him in to the reservations array.
    makeReservation(roomNumber, guestName, startDate, endDate){
        const reservationRoom = this.rooms.filter((room) => room.roomNumber === roomNumber)
        if(reservationRoom.length === 0) {
            throw new Error("The number is not on the list of available rooms.")
        }
        const reservation = new Reservation(reservationRoom[0], guestName, startDate, endDate)
        console.log("======================================================================================================================")
        console.log("Your reservation was succesful.")
        console.log("======================================================================================================================")
        console.log("\n")
        this.reservations.push(reservation)
    }

    // Finds the reservation index by room number and guest name to remove the reservation by reservations array.
    cancelReservation(roomNumber, guestName) {
        const reservation = this.reservations.findIndex((reservation) => reservation.room.roomNumber === roomNumber && reservation.guestName === guestName)
        if(reservation === -1) {
            throw new Error("The reservation does not existis in the list.")
        }
        this.reservations[reservation].room.toggleAvailability()
        this.reservations.splice(reservation, 1)
    }

    // Show all reservations on the reservations array.
    listReservations() {
        console.log("======================================================================================================================")
        for(var reservation in this.reservations) {
            console.log("Room number " + this.reservations[reservation].room.roomNumber + " was booked by " + this.reservations[reservation].guestName + " from " + this.reservations[reservation].startDate + " to " + this.reservations[reservation].endDate)
            console.log("======================================================================================================================")
        }
        return this.reservations
    }
}

// Export to do the tests
// Comment these exports to use the code
export default Room
export { Reservation }
export { Hotel }
