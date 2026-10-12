let form = document.getElementById("eventForm");
let error = document.getElementById("errorMessage");
let invitation = document.getElementById("invitation");

document.getElementById("closeError").addEventListener("click", function() {
    error.classList.add("hidden");});

form.addEventListener("submit", function(event) {
    event.preventDefault();

  let name = document.getElementById("eventName").value.trim();
    let date = document.getElementById("eventDate").value;
      let description = document.getElementById("description").value.trim();
     let end = document.getElementById("endTime").value;
  
    let start = document.getElementById("startTime").value;   
      let location = document.getElementById("location").value.trim();
    if (!name  ||!date||!start|| !end ||!description||!location) {
        error.classList.remove("hidden");
        return;
    }    error.classList.add("hidden");
 document.getElementById("inviteEventName").innerText = name;
    document.getElementById("inviteDate").innerText = "Date: " + date;
 document.getElementById("inviteTime").innerText =
  "Time: " + start + " - " + end;
 document.getElementById("inviteLocation").innerText =
        "Location: " + location;  document.getElementById("inviteDescription").innerText = description;
 form.style.display = "none";
    invitation.classList.remove("hidden");
});