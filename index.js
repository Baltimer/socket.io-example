const socket = io()

socket.on('update-status', (id) => {
  let button = document.querySelector(`#target-${id}`)
  if(button.classList.contains("bg-green-600")) {
    button.classList.remove("bg-green-600")
    button.classList.add("bg-red-600")
  } else {
    button.classList.remove("bg-red-600")
    button.classList.add("bg-green-600")
  }
})

function updateEvent(button){
  socket.emit('new-status', button.id)
}