const API_URL = 'http://localhost:3000/api/contacts';

var loadingDiv = document.getElementById("loading");

function showSpinner() {
  loadingDiv.style.visibility = "visible";
}

function hideSpinner() {
  loadingDiv.style.visibility = "hidden";
}

function delayHideSpinner() {
  setTimeout(() => {
    console.log("cerrando spiner");
    hideSpinner();
  }, 1000);
}

const formulario = document.getElementById("formulario");
const listContact = document.getElementById("listContact");
const button = document.getElementById("button");

function cleanForm() {
  formulario.elements["name"].value = "";
  formulario.elements["lastname"].value = "";
  formulario.elements["phone"].value = "";
  formulario.elements["city"].value = "";
  formulario.elements["address"].value = "";

  document.getElementById("female").checked = false;
  document.getElementById("male").checked = false;
  button.value = "ADD";
  button.className = "btn btn-primary";
}

let contacts = [];

async function loadContacts() {
  try {
    const response = await fetch(API_URL);
    contacts = await response.json();
    loadListContact(contacts);
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
}

function loadListContact(contacts) {
  listContact.innerHTML = "";
  contacts.forEach((contact) => {
    listContact.innerHTML += renderContact(contact);
  });
}

loadContacts();

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = formulario.elements["name"].value;
  const lastname = formulario.elements["lastname"].value;
  const sex = formulario.elements["sex"].value;
  const phone = formulario.elements["phone"].value;
  const city = formulario.elements["city"].value;
  const address = formulario.elements["address"].value;

  const emptyInput = checkEmptyInput(name, lastname, sex, phone, city, address);
  if (emptyInput) {
    alert("Please complete all the inputs.");
  } else {
    showSpinner();

    const contactData = {
      name,
      lastname,
      sex,
      phone,
      city,
      address
    };

    if (button.value === "ADD") {
      await addContact(contactData);
    } else {
      await updateContact(button.id, contactData);
    }
  }
});

async function addContact(contact) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    });

    if (response.ok) {
      const newContact = await response.json();
      listContact.innerHTML += renderContact(newContact);
      delayHideSpinner();
      cleanForm();
    }
  } catch (error) {
    console.error('Error adding contact:', error);
  }
}

async function deleteContact(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      const contactDeleted = document.getElementById(id);
      if (contactDeleted) {
        listContact.removeChild(contactDeleted);
      }
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
  }
}

async function updateContact(id, contactData) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });

    if (response.ok) {
      await loadContacts();
      delayHideSpinner();
      cleanForm();
    }
  } catch (error) {
    console.error('Error updating contact:', error);
  }
}

function loadContactForm(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;

  button.value = "UPDATE";
  button.className = "btn btn-success";
  button.id = id;

  const name = document.getElementById("name");
  const lastname = document.getElementById("lastname");
  const female = document.getElementById("female");
  const male = document.getElementById("male");
  const phone = document.getElementById("phone");
  const city = document.getElementById("city");
  const address = document.getElementById("address");

  name.value = contact.name;
  lastname.value = contact.lastname;
  phone.value = contact.phone;
  city.value = contact.city;
  address.value = contact.address;
  if (contact.sex === "male") {
    male.checked = true;
  } else {
    female.checked = true;
  }
}

function checkEmptyInput(name, lastname, sex, phone, city, address) {
  if (name === "" || lastname === "" || sex === "" ||  phone === "" || city === "" || address === "" ) {
    return true;
  }
  return false;
}

function renderContact(contact) {
  return `<div class="contact-container" id="${contact.id}">
<label>
  <img
    src="./img/${contact.sex === "male" ? "hombre" : "mujer"}.png"
    id=""
    class="closeBtn"
    width="15px"
    height="15px"
    onClick="showSpinner()"
  />
  <span>${contact.name} ${contact.lastname} - ${contact.city}</span>
</label>
<label>
<img
  src="./img/escritura.png"
  id="${contact.id}"
  class="closeBtn"
  width="15px"
  height="15px"
  onClick="loadContactForm(${contact.id})"
/>
<img
  src="./img/basura.png"
  id="${contact.id}"
  class="closeBtn"
  width="15px"
  height="15px"
  onClick="deleteContact(${contact.id})"
/>
</label>
</div>`;
}