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
    table.innerHTML = "";

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

    table.innerHTML = "";

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

// 📣 Φόρτωση Ανακοινώσεων
function loadAnnouncements() {
    fetch(`${API_URL}/announcements`)
        .then(response => response.json())
        .then(announcements => {
            const announcementsList = document.getElementById("announcementsList");
            announcementsList.innerHTML = "";

            announcements.forEach(announcement => {
                const date = new Date(announcement.created_at).toLocaleDateString();
                const li = document.createElement("li");
                li.innerHTML = `
                    <strong>${announcement.title}</strong> <br>
                    <strong>Ημερομηνία:</strong> ${date} <br>
                    <strong>Περιγραφή:</strong> ${announcement.content} <br>
                    <button onclick="editAnnouncement(${announcement.id})">✏</button>
                    <button onclick="deleteAnnouncement(${announcement.id})">🗑</button>
                `;
                announcementsList.appendChild(li);
            });
        })
        .catch(error => console.error("❌ Σφάλμα φόρτωσης ανακοινώσεων:", error));
}

// ➕ Προσθήκη Χρήστη
function addUser() {
    const full_name = prompt("Όνομα χρήστη:");
    const email = prompt("Email:");
    const role = prompt("Ρόλος (admin/user):");

    if (full_name && email && role) {
        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, email, role })
        }).then(() => loadUsers());
    }
}

// ➕ Προσθήκη Γυμναστή
function addTrainer() {
    const full_name = prompt("Όνομα γυμναστή:");
    const specialty = prompt("Ειδικότητα:");

    if (full_name && specialty) {
        fetch(`${API_URL}/trainers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, specialty })
        }).then(() => loadTrainers());
    }
}

// ➕ Προσθήκη Προγράμματος
function addProgram() {
    const name = prompt("Όνομα προγράμματος:");
    const trainer_id = Number(prompt("ID γυμναστή:"));
    const day_of_week = prompt("Ημέρα εβδομάδας:");
    const time = prompt("Ώρα (HH:MM:SS):");
    const max_capacity = Number(prompt("Μέγιστη χωρητικότητα:"));

    if (name && trainer_id && day_of_week && time && max_capacity) {
        fetch(`${API_URL}/programs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, trainer_id, day_of_week, time, max_capacity })
        }).then(() => loadPrograms());
    }
}

// 🔄 Επεξεργασία & Διαγραφή Δεδομένων
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

    if (full_name && specialty) {
        fetch(`${API_URL}/trainers/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name, specialty })
        }).then(() => loadTrainers());
    }
}

function editProgram(id) {
    const name = prompt("Νέο όνομα προγράμματος:");
    const trainer_id = Number(prompt("Νέο ID γυμναστή:"));
    const day_of_week = prompt("Νέα ημέρα εβδομάδας:");
    const time = prompt("Νέα ώρα (HH:MM:SS):");
    const max_capacity = Number(prompt("Νέα μέγιστη χωρητικότητα:"));

    if (name && trainer_id && day_of_week && time && max_capacity) {
        fetch(`${API_URL}/programs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, trainer_id, day_of_week, time, max_capacity })
        }).then(() => loadPrograms());
    }
}

function deleteAnnouncement(id) {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτήν την ανακοίνωση;")) return;

    fetch(`${API_URL}/announcements/${id}`, { method: "DELETE" })
        .then(response => response.text())
        .then(() => loadAnnouncements())
        .catch(error => console.error("❌ Σφάλμα στη διαγραφή ανακοίνωσης:", error));
}

// ❌ Αποσύνδεση
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
}
