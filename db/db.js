//there are three parkings (id 1-3)
let isParkingFreeArray = [true, true, true]

function getParkingStatusArray() {
    return isParkingFreeArray
}

function getParkingStatus(id) {
    isParkingFree = isParkingFreeArray[id - 1]
    console.log("Parking n. " + id + "is free:" + isParkingFree)
    return isParkingFree
}

function changeParkingStatus(id, isFree) {
    isParkingFreeArray[id-1] = isFree
}

module.exports = {
    getParkingStatusArray, 
    getParkingStatus,
    changeParkingStatus
}