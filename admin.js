const API_URL = "https://gymsite-six.vercel.app";

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

    if (name && email && role) {
        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: name, email, role }) // Σωστό όνομα πεδίου
        }).then(() => loadUsers());
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
    const day_of_week = prompt("Ημέρα εβδομάδας:");
    const time = prompt("Ώρα (HH:MM:SS):");
    const max_capacity = prompt("Μέγιστη χωρητικότητα:");

    if (name && trainer_id && day_of_week && time && max_capacity) {
        fetch(`${API_URL}/programs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, trainer_id, day_of_week, time, max_capacity }) // Σωστά πεδία
        }).then(() => loadPrograms());
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
                    ${announcement.text} 
                    <button onclick="deleteAnnouncement(${announcement.id})">🗑</button>
                `;
                announcementsList.appendChild(li);
            });
        })
        .catch(error => console.error("❌ Σφάλμα φόρτωσης ανακοινώσεων:", error));
}



function editProgram(id) {
    console.log(`✏️ Επεξεργασία προγράμματος με ID: ${id}`);
    alert(`Επεξεργασία προγράμματος με ID: ${id}`);
    // Εδώ μπορείς να ανοίξεις μια φόρμα για να αλλάξεις τα δεδομένα
}

function deleteProgram(id) {
    if (confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το πρόγραμμα;")) {
        console.log(`🗑️ Διαγραφή προγράμματος με ID: ${id}`);
        console.log("🔗 API URL:", `${API_URL}/programs/${id}`);
        
        fetch(`${API_URL}/programs/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => {
            console.log("✅ Πρόγραμμα διαγράφηκε:", data);
            loadPrograms(); // Επαναφόρτωση των δεδομένων
        })
        .catch(error => console.error("❌ Σφάλμα στη διαγραφή:", error));
    }
}

function deleteUser(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτόν τον χρήστη;")) return;

    fetch(`${API_URL}/users/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            alert("Ο χρήστης διαγράφηκε επιτυχώς!");
            loadUsers(); // Επαναφόρτωση της λίστας χρηστών
        })
        .catch(error => console.error("❌ Σφάλμα στη διαγραφή:", error));
}

function deleteTrainer(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτόν τον γυμναστή;")) return;

    fetch(`${API_URL}/trainers/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            alert("Ο γυμναστής διαγράφηκε επιτυχώς!");
            loadTrainers(); // Επαναφόρτωση της λίστας γυμναστών
        })
        .catch(error => console.error("❌ Σφάλμα στη διαγραφή:", error));
}

function deleteAnnouncement(id) {
    if (!id) {
        console.error("❌ Λάθος: Το ID της ανακοίνωσης είναι undefined!");
        return;
    }

    console.log(`🗑 Διαγραφή ανακοίνωσης με ID: ${id}`);

    fetch(`${API_URL}/announcements/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Ανακοίνωση διαγράφηκε:", data);
        loadAnnouncements(); // Επαναφόρτωση λίστας
    })
    .catch(error => console.error("❌ Σφάλμα στη διαγραφή ανακοίνωσης:", error));
}




// ❌ Αποσύνδεση
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
}
