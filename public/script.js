// ==========================================
// GET HTML ELEMENTS
// ==========================================

const studentForm = document.getElementById("studentForm");

const studentId = document.getElementById("studentId");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const courseInput = document.getElementById("course");

const submitButton = document.getElementById("submitButton");

const formTitle = document.getElementById("formTitle");

const studentTable = document.getElementById("studentTable");

const studentModal = document.getElementById("studentModal");

const searchInput = document.getElementById("searchInput");

const totalStudents = document.getElementById("totalStudents");

const totalCourses = document.getElementById("totalCourses");

const totalRecords = document.getElementById("totalRecords");


// Store students in memory for search
let allStudents = [];


// ==========================================
// LOAD STUDENTS
// ==========================================

loadStudents();


// ==========================================
// GET / VIEW STUDENTS
// ==========================================

function loadStudents() {

    fetch("/api/students")

        .then(response => {

            if (!response.ok) {

                throw new Error("Unable to fetch students");

            }

            return response.json();

        })

        .then(students => {

            allStudents = students;

            displayStudents(students);

            updateStatistics(students);

        })

        .catch(error => {

            console.error(error);

            studentTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        Unable to load student records.
                    </td>
                </tr>
            `;

        });

}


// ==========================================
// DISPLAY STUDENTS
// ==========================================

function displayStudents(students) {

    studentTable.innerHTML = "";


    // No students
    if (students.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No student records found.
                </td>
            </tr>
        `;

        return;

    }


    students.forEach(student => {

        const row = document.createElement("tr");


        // Get initials
        const initials = getInitials(student.name);


        row.innerHTML = `

            <td>
                #${student.id}
            </td>


            <td>

                <div class="student-name">

                    <div class="student-avatar">
                        ${initials}
                    </div>

                    ${escapeHTML(student.name)}

                </div>

            </td>


            <td>

                <span class="email">
                    ${escapeHTML(student.email)}
                </span>

            </td>


            <td>

                <span class="course-badge">
                    ${escapeHTML(student.course)}
                </span>

            </td>


            <td>

                <button
                    class="action-button edit-button"
                    onclick="editStudent(${student.id})"
                >
                    Edit
                </button>


                <button
                    class="action-button delete-button"
                    onclick="deleteStudent(${student.id})"
                >
                    Delete
                </button>

            </td>

        `;


        studentTable.appendChild(row);

    });

}


// ==========================================
// UPDATE DASHBOARD STATISTICS
// ==========================================

function updateStatistics(students) {

    // Total students
    totalStudents.textContent = students.length;


    // Total records
    totalRecords.textContent = students.length;


    // Get unique courses
    const courses = new Set();

    students.forEach(student => {

        courses.add(student.course.toLowerCase());

    });


    totalCourses.textContent = courses.size;

}


// ==========================================
// SEARCH STUDENTS
// ==========================================

function searchStudents() {

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredStudents = allStudents.filter(student => {

        return (

            student.name.toLowerCase().includes(searchText)

            ||

            student.email.toLowerCase().includes(searchText)

            ||

            student.course.toLowerCase().includes(searchText)

            ||

            student.id.toString().includes(searchText)

        );

    });


    displayStudents(filteredStudents);

}


// ==========================================
// OPEN ADD STUDENT MODAL
// ==========================================

function openAddModal() {

    studentForm.reset();

    studentId.value = "";

    formTitle.textContent = "Add New Student";

    submitButton.textContent = "Add Student";

    studentModal.classList.add("show");

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    studentModal.classList.remove("show");

    studentForm.reset();

    studentId.value = "";

}


// ==========================================
// ADD / UPDATE STUDENT
// ==========================================

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const studentData = {

        name: nameInput.value.trim(),

        email: emailInput.value.trim(),

        course: courseInput.value.trim()

    };


    // ======================================
    // UPDATE
    // ======================================

    if (studentId.value) {

        fetch(`/api/students/${studentId.value}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(studentData)

        })

        .then(response => response.json())

        .then(data => {

            if (data.error) {

                alert(data.error);

                return;

            }


            closeModal();

            loadStudents();

        })

        .catch(error => {

            console.error(error);

            alert("Unable to update student.");

        });

    }


    // ======================================
    // ADD
    // ======================================

    else {

        fetch("/api/students", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(studentData)

        })

        .then(response => response.json())

        .then(data => {

            if (data.error) {

                alert(data.error);

                return;

            }


            closeModal();

            loadStudents();

        })

        .catch(error => {

            console.error(error);

            alert("Unable to add student.");

        });

    }

});


// ==========================================
// EDIT STUDENT
// ==========================================

function editStudent(id) {

    const student =
        allStudents.find(student => student.id === id);


    if (!student) {

        return;

    }


    studentId.value = student.id;

    nameInput.value = student.name;

    emailInput.value = student.email;

    courseInput.value = student.course;


    formTitle.textContent = "Edit Student";

    submitButton.textContent = "Save Changes";


    studentModal.classList.add("show");

}


// ==========================================
// DELETE STUDENT
// ==========================================

function deleteStudent(id) {

    const student =
        allStudents.find(student => student.id === id);


    if (!student) {

        return;

    }


    const confirmed = confirm(
        `Delete ${student.name}'s record?`
    );


    if (!confirmed) {

        return;

    }


    fetch(`/api/students/${id}`, {

        method: "DELETE"

    })

    .then(response => response.json())

    .then(data => {

        if (data.error) {

            alert(data.error);

            return;

        }


        loadStudents();

    })

    .catch(error => {

        console.error(error);

        alert("Unable to delete student.");

    });

}


// ==========================================
// GET INITIALS
// ==========================================

function getInitials(name) {

    const words = name.trim().split(" ");


    if (words.length === 1) {

        return words[0].substring(0, 2).toUpperCase();

    }


    return (

        words[0][0] +

        words[words.length - 1][0]

    ).toUpperCase();

}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHTML(value) {

    return value

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==========================================

studentModal.addEventListener("click", function(event) {

    if (event.target === studentModal) {

        closeModal();

    }

});


// ==========================================
// ESC KEY CLOSES MODAL
// ==========================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeModal();

    }

});