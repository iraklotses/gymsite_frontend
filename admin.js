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
    const table = document.getElementById("trainersTable");

    trainers.forEach(trainer => {
        const row = `<tr>
            <td>${trainer.id}</td>
            <td>${trainer.name}</td>
            <td>${trainer.specialty}</td>
            <td>
                <button onclick="editTrainer(${trainer.id})">✏️</button>
                <button onclick="deleteTrainer(${trainer.id})">🗑️</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}

async function loadPrograms() {
    const response = await fetch(`${API_URL}/programs`);
    const programs = await response.json();
    const table = document.getElementById("programsTable");

    programs.forEach(program => {
        const row = `<tr>
            <td>${program.name}</td>
            <td>${program.capacity}</td>
            <td>
                <button onclick="editProgram(${program.id})">✏️</button>
                <button onclick="deleteProgram(${program.id})">🗑️</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });
}


// 📅 Προσθήκη Προγράμματος
function addProgram() {
    const name = prompt("Όνομα προγράμματος:");
    const capacity = prompt("Μέγιστη χωρητικότητα:");

    if (name && capacity) {
        fetch(`${API_URL}/programs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, capacity })
        }).then(() => loadPrograms());
    }
}

// 📣 Προσθήκη Ανακοίνωσης
function addAnnouncement() {
    const title = prompt("Τίτλος ανακοίνωσης:");
    const content = prompt("Περιεχόμενο:");

    if (title && content) {
        fetch(`${API_URL}/announcements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content })
        }).then(() => loadAnnouncements());
    }
}

// ❌ Αποσύνδεση
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
}
