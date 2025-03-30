function verifyAdmin() {
  let user = document.getElementById("user").value;
  let password = document.getElementById("password").value;

  if (user === "admin" && password === "admin") {
    window.location.href = "./management_page.html";
  }
  else {
    alert("Wrong user or password");
  }
}
