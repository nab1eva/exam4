let studentsRow = document.getElementById("students");
const student = document.getElementById("firstName");
const studentLast = document.getElementById("lastName");
const studentGroup = document.getElementById("groups");
const studentEmail = document.getElementById("email");
const studentphoneNumber = document.getElementById("phoneNumber");
const studentIsWork = document.getElementById("isWork");
const studentField = document.getElementById("field");
const studentImage = document.getElementById("avatar");
const studentForm = document.getElementById("studentForm");
const studentModal = document.getElementById("student-modal");
const studentBtn = document.getElementById("student-add-btn");
const modalOpenBtn = document.getElementById("modal-open-btn");
const searchInput = document.querySelector("#search");
let teacherId = localStorage.getItem("teacher");
const pagination = document.querySelector(".pagination");
const workoption = ["Yes", "No"];
let search = "";
let work = "";
let selected = null;
let page = 1;
let limit = 8;
let pagination_items;

function getwork() {
  filterWork.innerHTML = `<option value="all">Is work?</option>`;
  workoption.forEach((gr) => {
    filterWork.innerHTML += `<option value=${gr}>${gr}</option>`;
  });
}
getwork();

const getStudentCard = ({
  id,
  avatar,
  firstName,
  lastName,
  birthday,
  email,
  isWork,
  field,
  phoneNumber,
}) => {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
    <div class="card">
      <div >
        <img class="card-img card-img-top" src="${avatar}" alt="" />
      </div>
      <div class="card-body">
        <h5 class="card-title">${firstName} ${lastName}</h5>
        <p class="card-text">
          <b>Birthday</b>: ${birthday} <br />
          <b>Works: </b>${isWork ? "Yes" : "No"} <br>
          <b>Tel</b>: ${phoneNumber} <br />
          <b>Email</b>: ${email} <br/>
          <b>Field</b>: ${field}
        </p>
        <div class="btns d-flex justify-content-between">
          <button class="btn btn-primary edit" data-bs-toggle="modal" data-bs-target="#student-modal" onClick="editStudent(${id})">Edit</button>
          <button class="btn btn-primary del" onClick="deleteStudent(${id})">Delete</button>
        </div>
      </div>
    </div>
  </div>`;
};

async function getStudents() {
  studentsRow.innerHTML = `<div class="loadingio-spinner-spinner-df8bae3ws6a"><div class="ldio-uxfvduvpqi">
    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
    </div></div>`;
  let res = await fetch(
    ENDPOINT +
      `teacher/${teacherId}/student?birthday=${search}&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  let students = await res.json();
  studentsRow.innerHTML = "";
  students.forEach((student) => {
    studentsRow.innerHTML += getStudentCard(student);
  });
}

getStudents();

searchInput.addEventListener("input", function () {
  search = this.value;
  getStudents();
});
filterWork.addEventListener("change", function () {
  married = this.value;
  getStudents();
});

studentForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let check = this.checkValidity();
  this.classList.add("was-validated");
  if (check) {
    bootstrap.Modal.getInstance(studentModal).hide();
    let data = {
      firstName: student.value,
      lastName: studentLast.value,
      avatar: studentImage.value,
      email: studentEmail.value,
      isWork: studentIsWork.checked,
      field: studentField.value,
      phoneNumber: studentphoneNumber.value,
    };
    if (selected) {
      fetch(ENDPOINT + `/teacher/${teacherId}/student/${selected}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Student is edited");
        getStudents();
        emptyForm();
      });
    } else {
      fetch(ENDPOINT + `teacher/${teacherId}/student`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      }).then(() => {
        alert("Student is added");
        getStudents();
        emptyForm();
      });
    }
  }
});

studentphoneNumber.addEventListener("input", function () {
  let inputValue = studentphoneNumber.value;
  let phoneRegex = /^\+998\((87|9[0-9])\)(\d{3}-\d{2}-\d{2})$/;
  let isPhoneValid = phoneRegex.test(inputValue);
  studentphoneNumber.setCustomValidity(
    isPhoneValid
      ? ""
      : "Please enter a valid phone number in the format +998(87)123-45-67."
  );
});

addButton.addEventListener("click", () => {
  student.value = "";
  studentLast.value = "";
  studentImage.value = "";
  studentEmail.value = "";
  studentphoneNumber.value = "";
  studentIsWork.checked = "";
  studentField.value = "";
  modalSave.innerHTML = "Add";
});

function editStudent(id) {
  selected = id;
  studentBtn.innerHTML = "Save";
  fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      student.value = res.firstName;
      studentLast.value = res.lastName;
      studentImage.value = res.avatar;
      studentEmail.value = res.email;
      studentphoneNumber.value = res.phoneNumber;
      studentIsWork.checked = res.isWork;
      studentField.value = res.field;
    });
}

function deleteStudent(id) {
  let check = confirm("Rostanam o'chirishni xohlaysizmi ?");
  if (check) {
    fetch(ENDPOINT + `teacher/${teacherId}/student/${id}`, {
      method: "DELETE",
    }).then(() => {
      getStudents();
    });
  }
}

function emptyForm() {
  student.value = "";
  studentImage.value = "";
}

modalOpenBtn.addEventListener("click", () => {
  selected = null;
});

async function getPagination() {
    let pagination_numbers = "";
    let res = await fetch(ENDPOINT + `teacher/${teacherId}/student`);
    let students = await res.json();
    products_number = students.length;
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
      getStudents();
      getPagination();
    }
  }