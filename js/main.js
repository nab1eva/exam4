const teachersRow = document.querySelector(".teachers-row");
const teacherForm = document.querySelector(".teachers-form");
const TeacherModal = document.querySelector("#TeacherModal");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const avatar = document.querySelector("#avatar");
const phone = document.querySelector("#category_phone");
const email = document.querySelector("#category_email");
const groups = document.querySelector("#category_group");
const isMarried = document.querySelector("#category_married");
const searchInput = document.querySelector("#search");
const addButton = document.querySelector("#add-button");
const modalSave = document.querySelector(".modal-save");
const filterMarried = document.querySelector("#filterMarried");
const pagination = document.querySelector(".pagination");
const marriedoption = ["Yes", "No"];
let search = "";
let married = "";
let selected = null;
let page = 1;
let limit = 8;
let pagination_items;

function saveId(id) {
  localStorage.setItem("teacher", id);
}
let userId = localStorage.getItem(saveId);

function getMarried() {
  filterMarried.innerHTML = `<option value="all">Is married?</option>`;
  marriedoption.forEach((gr) => {
    filterMarried.innerHTML += `<option value=${gr}>${gr}</option>`;
  });
}
getMarried();

function getTeacherCard({
  avatar,
  firstName,
  lastName,
  groups,
  isMarried,
  phoneNumber,
  email,
  id,
}) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
    <div class="card">
      <div >
        <img class="card-img card-img-top" src="${avatar}" alt="" />
      </div>
      <div class="card-body">
        <h5 class="card-title">${firstName} ${lastName}</h5>
        <p class="card-text">
          <b>Group</b>: ${groups} <br />
          <b>Married: </b>${isMarried ? "Yes" : "No"} <br>
          <b>Tel</b>: ${phoneNumber} <br />
          <b>Email</b>: ${email}
        </p>
        <div class="btns d-flex justify-content-between">
          <a href="student.html" onclick="saveId(${id})" class="btn btn-primary get-students">Get Students ${id}</a>
          <button class="btn btn-primary edit" data-bs-toggle="modal" data-bs-target="#TeacherModal" onClick="editTeacher(${id})">Edit</button>
          <button class="btn btn-primary del" onClick="deleteTeacher(${id})">Delete</button>
        </div>
      </div>
    </div>
  </div>`;
}

phone.addEventListener("input", function () {
  let inputValue = phone.value;
  let phoneRegex = /^\+998\((87|9[0-9])\)(\d{3}-\d{2}-\d{2})$/;
  let isPhoneValid = phoneRegex.test(inputValue);
  phone.setCustomValidity(
    isPhoneValid
      ? ""
      : "Please enter a valid phone number in the format +998(87)123-45-67."
  );
});

const getTeachers = async () => {
  teachersRow.innerHTML = `<div class="loadingio-spinner-spinner-df8bae3ws6a"><div class="ldio-uxfvduvpqi">
  <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
  </div></div>`;

  let res = await fetch(
    ENDPOINT +
      `teacher?firstName=${search}&isMarried=${married}&page=${page}&limit=${limit} `,
    {
      method: "GET",
    }
  );
  let data = await res.json();
  teachersRow.innerHTML = ` `;
  data.forEach((teacher) => {
    teachersRow.innerHTML += getTeacherCard(teacher);
  });
};

getTeachers();

teacherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let obj = {
    firstName: firstName.value,
    lastName: lastName.value,
    avatar: avatar.value,
    isMarried: isMarried.value,
    phone: phone.value,
    email: email.value,
    groups: groups.value.split(","),
  };
  if (teacherForm.checkValidity()) {
    if (selected) {
      fetch(ENDPOINT + `teacher/${selected}`, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        getTeachers();
      });
    } else {
      fetch(ENDPOINT + "teacher", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": "application/json" },
      }).then(() => {
        getTeachers();
      });
    }
    bootstrap.Modal.getInstance(TeacherModal).hide();
  } else {
    teacherForm.classList.add("was-validated");
  }
});

addButton.addEventListener("click", () => {
  selected = null;
  firstName.value = "";
  lastName.value = "";
  avatar.value = "";
  isMarried.value = "";
  phone.value = "";
  email.value = "";
  groups.value = "";
  modalSave.innerHTML = "Add";
});

searchInput.addEventListener("input", function () {
  search = this.value;
  getTeachers();
});
filterMarried.addEventListener("change", function () {
  married = this.value;
  getTeachers();
});

function deleteTeacher(id) {
  let isDeleted = confirm("Do you want to delete this item ?");
  if (isDeleted) {
    fetch(ENDPOINT + `teacher/${id}`, { method: "DELETE" }).then(() => {
      getTeachers();
    });
  }
}

const editTeacher = async (id) => {
  selected = id;
  let res = await fetch(ENDPOINT + `teacher/${id}`);
  let data = await res.json();
  firstName.value = data.firstName;
  lastName.value = data.lastName;
  avatar.value = data.avatar;
  isMarried.value = data.isMarried;
  phone.value = data.phone;
  email.value = data.email;
  groups.value = data.groups;
  modalSave.innerHTML = "Save";
};

async function getPagination() {
  let pagination_numbers = "";
  let res = await fetch(ENDPOINT + `teacher`);
  let teachers = await res.json();
  products_number = teachers.length;
  pagination_items = Math.ceil(products_number / limit);
  Array(pagination_items)
    .fill(1)
    .forEach((item, index) => {
      pagination_numbers += `<li class="page-item ${
        page == index + 1 ? "active" : ""
      }" onclick="getPage(${index + 1})">
          <span class="page-link">
            ${index + 1}
          </span>
        </li>`;
    });

  pagination.innerHTML = `
      <li onclick="getPage('-')" class="page-item ${
        page == 1 ? "disabled" : ""
      }"><button class="page-link" href="#">Previous</button></li>
      ${pagination_numbers}
      <li onclick="getPage('+')" class="page-item ${
        page == pagination_items ? "disabled" : ""
      }"><button class="page-link" href="#">Next</button></li>
    `;
}
getPagination();

function getPage(p) {
  if (p == "+") {
    page++;
  } else if (p == "-") {
    page--;
  } else {
    page = p;
  }
  if (page <= pagination_items) {
    getTeachers();
    getPagination();
  }
}
