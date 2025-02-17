const API_URL = "https://gymsite-six.vercel.app";
const tableBody = document.getElementById("pendingUsersTable");

// 🔄 Φόρτωση Δεδομένων
document.addEventListener("DOMContentLoaded", async () => {
    loadUsers();
    loadTrainers();
    loadPrograms();
    loadAnnouncements();
});

// 🏋️ Φόρτωση Χρηστών
async function loadUsers() {
    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();
    const table = document.getElementById("usersTable");
    table.innerHTML = ""; // Καθαρισμός πριν την ενημέρωση

    users.forEach(user => {
        const row = `<tr>
            <td>${user.id}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="editUser(${user.id})">✏️</button>
                <button onclick="deleteUser(${user.id})">🗑️</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}

// 🏋️ Φόρτωση Γυμναστών
async function loadTrainers() {
    const response = await fetch(`${API_URL}/trainers`);
    const trainers = await response.json();

    if (!Array.isArray(trainers)) {
        console.error("Invalid trainers data:", trainers);
        return;
    }

    const table = document.getElementById("trainersTable");
    table.innerHTML = "";

    trainers.forEach(trainer => {
        const row = `<tr>
            <td>${trainer.id}</td>
            <td>${trainer.full_name}</td>
            <td>${trainer.specialty}</td>
            <td>
                <button onclick="editTrainer(${trainer.id})">✏️</button>
                <button onclick="deleteTrainer(${trainer.id})">🗑️</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}


// 📅 Φόρτωση Προγραμμάτων
async function loadPrograms() {
    const response = await fetch(`${API_URL}/programs`);
    const programs = await response.json();
    const table = document.getElementById("programsTable");

    if (!Array.isArray(programs)) {
        console.error("Invalid programs data:", programs);
        return;
    }

    table.innerHTML = ""; // Καθαρισμός πριν προσθέσουμε νέες γραμμές

    programs.forEach(program => {
        const row = `<tr>
            <td>${program.name}</td>
            <td>${program.max_capacity}</td>
            <td>${program.trainer_id}</td>
            <td>${program.day_of_week}</td>
            <td>${program.time}</td>
            <td>
                <button onclick="editProgram(${program.id})">✏️</button>
                <button onclick="deleteProgram(${program.id})">🗑️</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}


// ➕ Προσθήκη Χρήστη
function addUser() {
    const name = prompt("Όνομα χρήστη:");
    const email = prompt("Email:");
    const role = prompt("Ρόλος (admin/user):");
    const password = prompt("Κωδικός πρόσβασης:"); // ✅ Ζητάμε password

    if (name && email && role && password) {
        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: name, email, role, password }) // ✅ Στέλνουμε και το password
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("❌ Σφάλμα: " + data.error);
            } else {
                alert("✅ Ο χρήστης προστέθηκε!");
                loadUsers(); // Φόρτωσε ξανά τη λίστα των χρηστών
            }
        })
        .catch(error => console.error("❌ Σφάλμα στο API:", error));
    } else {
        alert("❌ Όλα τα πεδία είναι υποχρεωτικά!");
    }
}


// ➕ Προσθήκη Γυμναστή
function addTrainer() {
    const name = prompt("Όνομα γυμναστή:");
    const specialty = prompt("Ειδικότητα:");

    if (name && specialty) {
        fetch(`${API_URL}/trainers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: name, specialty }) // Σωστό όνομα πεδίου
        }).then(() => loadTrainers());
    }
}

// ➕ Προσθήκη Προγράμματος
function addProgram() {
    const name = prompt("Όνομα προγράμματος:");
    const trainer_id = prompt("ID γυμναστή:");
    const day_of_week = prompt("Ημέρα (Monday, Tuesday, ...):");
    const time = prompt("Ώρα (HH:MM:SS):");
    const max_capacity = prompt("Μέγιστη χωρητικότητα:");

    // Αν κάποιο πεδίο είναι άδειο, μην προχωρήσεις
    if (!name || !trainer_id || !day_of_week || !time || !max_capacity) {
        alert("❌ Συμπλήρωσε όλα τα πεδία!");
        return;
    }

    // Δες τι δεδομένα στέλνονται
    console.log("📤 Αποστολή προγράμματος:", { name, trainer_id, day_of_week, time, max_capacity });

    fetch(`${API_URL}/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, trainer_id, day_of_week, time, max_capacity })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || "Σφάλμα στον server!"); });
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Πρόγραμμα προστέθηκε:", data);
        alert("✅ Το πρόγραμμα προστέθηκε!");
        loadPrograms(); // Επαναφόρτωση της λίστας
    })
    .catch(error => console.error("❌ Σφάλμα προσθήκης προγράμματος:", error));
}


function addAnnouncement() {
    const title = prompt("Τίτλος ανακοίνωσης:");
    const content = prompt("Περιεχόμενο ανακοίνωσης:");

    if (title && content) {
        fetch(`${API_URL}/announcements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }) // Τα σωστά πεδία
        }).then(() => loadAnnouncements()); // Επαναφόρτωση λίστας ανακοινώσεων
    }
}


// 📣 Φόρτωση Ανακοινώσεων
function loadAnnouncements() {
    fetch(`${API_URL}/announcements`)
        .then(response => response.json())
        .then(announcements => {
            const announcementsList = document.getElementById("announcementsList");
            announcementsList.innerHTML = ""; // Καθαρισμός πριν την προσθήκη

            announcements.forEach(announcement => {
                // Δημιουργία στοιχείου <li> για κάθε ανακοίνωση
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>Ημερομηνία:</strong> ${announcement.created_at} <br>
                    <strong>Περιγραφή:</strong> ${announcement.content} <br>
                    <button onclick="deleteAnnouncement(${announcement.id})">🗑</button>
                `;
                announcementsList.appendChild(li);
            });
        })
        .catch(error => console.error("❌ Σφάλμα φόρτωσης ανακοινώσεων:", error));
}




function editUser(id) {
    const full_name = prompt("Νέο όνομα χρήστη:");
    const email = prompt("Νέο email χρήστη:");
    const role = prompt("Νέος ρόλος χρήστη:");

    if (full_name && email && role) {
        fetch(`${API_URL}/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, role })
        }).then(() => loadUsers());
    }
}

function editTrainer(id) {
    const full_name = prompt("Νέο όνομα γυμναστή:");
    const specialty = prompt("Νέα ειδικότητα:");

    if (!full_name || !specialty) {
        alert("Και τα δύο πεδία είναι υποχρεωτικά!");
        return;
    }

    fetch(`${API_URL}/trainers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, specialty })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert("Ο γυμναστής ενημερώθηκε επιτυχώς!");
        loadTrainers(); // Επαναφόρτωση της λίστας των trainers
    })
    .catch(error => {
        console.error("Error updating trainer:", error);
        alert("Σφάλμα κατά την ενημέρωση του γυμναστή!");
    });
}


function editProgram(id) {
    const name = prompt("Νέο όνομα προγράμματος:");
    const trainer_id = prompt("Νέο ID γυμναστή:");
    const day_of_week = prompt("Νέα ημέρα εβδομάδας:");
    const time = prompt("Νέα ώρα (HH:MM:SS):");
    const max_capacity = prompt("Νέα μέγιστη χωρητικότητα:");

    if (name && trainer_id && day_of_week && time && max_capacity) {
        fetch(`${API_URL}/programs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, trainer_id, day_of_week, time, max_capacity })
        }).then(() => loadPrograms());
    }
}

function editAnnouncement(id) {
    const title = prompt("Νέος τίτλος ανακοίνωσης:");
    const content = prompt("Νέο περιεχόμενο:");

    if (title && content) {
        fetch(`${API_URL}/announcements/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        }).then(() => loadAnnouncements());
    }
}


function deleteProgram(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το πρόγραμμα;")) return;

    fetch(`${API_URL}/programs/${id}`, { method: "DELETE" })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            return response.json().catch(() => ({}));
        })
        .then(data => {
            if (data.error) throw new Error(data.error);
            alert("✅ Το πρόγραμμα διαγράφηκε επιτυχώς!");
            loadPrograms(); // Επαναφόρτωση της λίστας προγραμμάτων
        })
        .catch(error => {
            console.error("❌ Σφάλμα στη διαγραφή προγράμματος:", error);
            alert(`❌ Σφάλμα: ${error.message}`);
        });
}


function deleteUser(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτόν τον χρήστη;")) return;

    fetch(`${API_URL}/users/${id}`, { method: "DELETE" })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            return response.json().catch(() => ({}));
        })
        .then(data => {
            if (data.error) throw new Error(data.error);
            alert("✅ Ο χρήστης διαγράφηκε επιτυχώς!");
            loadUsers(); // Επαναφόρτωση της λίστας χρηστών
        })
        .catch(error => {
            console.error("❌ Σφάλμα στη διαγραφή χρήστη:", error);
            alert(`❌ Σφάλμα: ${error.message}`);
        });
}


function deleteTrainer(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτόν τον γυμναστή;")) return;

    fetch(`${API_URL}/trainers/${id}`, { method: "DELETE" })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            return response.json().catch(() => ({})); // Αν δεν είναι valid JSON, επιστρέφουμε ένα κενό object
        })
        .then(data => {
            if (data.error) throw new Error(data.error);
            alert("✅ Ο γυμναστής διαγράφηκε επιτυχώς!");
            loadTrainers(); // Επαναφόρτωση της λίστας γυμναστών
        })
        .catch(error => {
            console.error("❌ Σφάλμα στη διαγραφή:", error);
            alert(`❌ Σφάλμα: ${error.message}`);
        });
}


function deleteAnnouncement(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτή την ανακοίνωση;")) return;

    fetch(`${API_URL}/announcements/${id}`, { method: "DELETE" })
        .then(async response => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
            }
            return response.json().catch(() => ({}));
        })
        .then(data => {
            if (data.error) throw new Error(data.error);
            alert("✅ Η ανακοίνωση διαγράφηκε επιτυχώς!");
            loadAnnouncements(); // Επαναφόρτωση της λίστας ανακοινώσεων
        })
        .catch(error => {
            console.error("❌ Σφάλμα στη διαγραφή ανακοίνωσης:", error);
            alert(`❌ Σφάλμα: ${error.message}`);
        });
}


async function loadPendingUsers() {
        tableBody.innerHTML = ""; // Καθαρισμός πίνακα

        try {
            const response = await fetch("https://gymsite-six.vercel.app/pending_users");
            const users = await response.json();

            users.forEach(user => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.id}</td>  <!-- ID στη σωστή θέση -->
                    <td>${user.full_name}</td>  <!-- Όνομα στη σωστή θέση -->
                    <td>${user.email}</td>  <!-- Email στη σωστή θέση -->
    <td>
        <button onclick="approveUser(${user.id}, 'user')">✔ Έγκριση</button>
        <button onclick="approveUser(${user.id}, 'admin')">✔ Έγκριση ως Admin</button>
        <button onclick="rejectUser(${user.id})">❌ Απόρριψη</button>
    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Σφάλμα φόρτωσης χρηστών:", error);
        }
    }

    // 🔹 Έγκριση χρήστη (approve) και ανάθεση ρόλου
   async function approveUser(userId, role) {
    console.log("Approving user:", { userId, role }); // 🔍 Debugging

    if (!userId || !role) {
        alert("Σφάλμα: Το userId ή το role λείπει!");
        return;
    }

    try {
        const response = await fetch("https://gymsite-six.vercel.app/approve_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, role }) 
        });

        if (response.ok) {
            alert("Ο χρήστης εγκρίθηκε!");
            loadPendingUsers();
        } else {
            const result = await response.json();
            alert("Σφάλμα: " + result.error);
        }
    } catch (error) {
        console.error("Σφάλμα έγκρισης χρήστη:", error);
    }
}


    // 🔹 Απόρριψη χρήστη (reject)
   async function rejectUser(userId) {
    console.log("Rejecting user:", userId); // 🔍 Debugging

    if (!userId) {
        alert("Σφάλμα: Λείπει το userId!");
        return;
    }

    try {
        const response = await fetch("https://gymsite-six.vercel.app/reject_user", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });

        if (response.ok) {
            alert("Ο χρήστης απορρίφθηκε!");
            loadPendingUsers();
        } else {
            const result = await response.json();
            alert("Σφάλμα: " + result.error);
        }
    } catch (error) {
        console.error("Σφάλμα απόρριψης χρήστη:", error);
    }
}


    // Φόρτωση χρηστών στην αρχή
    loadPendingUsers();


// ❌ Αποσύνδεση
function logout() {
    localStorage.removeItem("user_id");
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "index.html";
}
