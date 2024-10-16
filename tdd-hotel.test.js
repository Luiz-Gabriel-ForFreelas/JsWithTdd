import Room from "./tdd-hotel"
import { Reservation } from "./tdd-hotel"
import { Hotel } from "./tdd-hotel"

describe("Room test block", () =>{
    it("Room class / constructor function / test", () => {
        const room = new Room(1, "singLe", 90.00, true)
        expect(room.roomNumber).toEqual(1)
        expect(room.roomType).toEqual("single")
        expect(room.roomPrice).toEqual(90.00)
        expect(room.getRoomAvailable()).toEqual(true)
    })

    it("Room class / toggleAvailability function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        room.toggleAvailability()
        expect(room.getRoomAvailable()).toEqual(false)
        room.toggleAvailability()
        expect(room.getRoomAvailable()).toEqual(true)
    })
})

describe("Reservation test block", () => {
    it("Reservation class / constructor function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const reservation = new Reservation(room, "Luiz", "01/11-2024", "06-11/2024")
        expect(reservation.room.roomNumber).toEqual(1)
        expect(reservation.guestName).toEqual("Luiz")
        expect(reservation.startDate).toEqual("01-11-2024")
        expect(reservation.endDate).toEqual("06-11-2024")
    })

    it("Reservation class / dateValidation function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const reservation = new Reservation(room, "Luiz", "01/11-2024", "06-11/2024")
        expect(reservation.startDate).toEqual("01-11-2024")
        expect(reservation.endDate).toEqual("06-11-2024")
    })

    it("Reservation class / getReservationDatails function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const reservation = new Reservation(room, "Luiz", "01/11/2024", "10/11/2024")
        const reservationDetails = reservation.getReservationDetails()
        expect(reservationDetails).toEqual("The reservation is in Luiz's name, and check-in is scheduled for the 01-11-2024, while check-out is scheduled for the 10-11-2024")
    })
})

describe("Hotel test block", () => {
    it("Hotel class / constructor function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const reservation = new Reservation(room, "Luiz", "01/11-2024", "06-11/2024")
        const hotel = new Hotel([room], [reservation])
        const arrayRooms = hotel.rooms
        const hotelRoom = arrayRooms[0]
        const roomIndex = hotelRoom.roomNumber
        expect(roomIndex).toEqual(1)

        const arrayReservations = hotel.reservations
        const hotelReservation = arrayReservations[0]
        const reservationIndex = hotelReservation.guestName
        expect(reservationIndex).toEqual("Luiz")
    })

    it("Hotel class / addRoom function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const hotel = new Hotel([room], [])
        hotel.addRoom(2, "suite", 200.00, true)
        const arrayRooms = hotel.rooms
        const hotelRoom1 = arrayRooms[0]
        const hotelRoom2 = arrayRooms[1]
        const roomIndex1 = hotelRoom1.roomNumber
        const roomIndex2 = hotelRoom2.roomNumber
        expect(roomIndex1).toEqual(1)
        expect(roomIndex2).toEqual(2)
    })

    it("Hotel class / listAvailableRooms function / test", () => {
        const room = new Room(1, "single", 90.00, false)
        const room1 = new Room(2, "suite", 200.00, true)
        const hotel = new Hotel([room, room1] , [])
        const arrayAvailableRooms = hotel.listAvailableRooms()
        const availableRoom = arrayAvailableRooms[0]
        const avaiableRoomNumber = availableRoom.roomNumber
        expect(avaiableRoomNumber).toEqual(2)
    })

    it("Hotel class / makeReservation function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const room1 = new Room(2, "suite", 200.00, true)
        const hotel = new Hotel([room, room1], [])
        hotel.makeReservation(1, "Luiz", "10/11/2024", "12/11/2024")
        const reservationMaked = hotel.reservations[0]
        const reservationRoom = reservationMaked.room
        const reservationRoomNumber = reservationRoom.roomNumber
        const reservationRoomStatus = reservationRoom.getRoomAvailable()
        const reservationGuest = reservationMaked.guestName
        expect(reservationRoomNumber).toEqual(1)
        expect(reservationGuest).toEqual("Luiz")
        expect(reservationRoomStatus).toEqual(false)
    })

    it("Hotel class / cancelReservation function / test", () => {
        const room = new Room(1, "single", 90.00, true)
        const hotel = new Hotel([room], [])
        hotel.makeReservation(1, "Luiz", "11/11/2024", "15/11/2024")
        hotel.cancelReservation(1, "Luiz")
        const reservations = hotel.reservations
        const rooms = hotel.rooms
        const roomAvailable = rooms[0].getRoomAvailable()
        expect(reservations.length).toEqual(0)
        expect(roomAvailable).toEqual(true)
    })

    it("Hotel class / listReservations function / test", () => {
        const room1 = new Room(1, "single", 90.00, true)
        const room2 = new Room(2, "single", 90.00, true)
        const hotel = new Hotel([room1, room2], [])
        hotel.makeReservation(2, "Luiz", "11/11/2024", "15/11/2024")
        hotel.makeReservation(1, "Gustavo", "11/11/2024", "15/11/2024")
        const reservationsArray = hotel.listReservations()
        const reservation = reservationsArray[0]
        const roomNumber = reservation.room.roomNumber
        expect(roomNumber).toEqual(2)
    })
})