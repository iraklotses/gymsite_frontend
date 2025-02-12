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
    if (!Array.isArray(trainers)) {
        console.error("Invalid trainers data:", trainers);
        return;
    }
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
    try {
        const response = await fetch(`${API_URL}/programs`);
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error("❌ Invalid programs data:", data);
            return;
        }

        const table = document.getElementById("programsTable");
        table.innerHTML = ""; // Καθαρισμός πίνακα

        data.forEach(program => {
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
    } catch (error) {
        console.error("❌ Error fetching programs:", error);
    }
}


    //ΕΛΕΓΧΟΣ
fetch("/programs")
  .then(res => res.json())
  .then(data => {
      if (!Array.isArray(data)) {
          console.error("Invalid programs data:", data);
          return;
      }
      data.forEach(program => {
          console.log("Πρόγραμμα:", program);
      });
  })
  .catch(err => console.error("Error fetching programs:", err));


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

function addUser() {
    const name = prompt("Όνομα χρήστη:");
    const email = prompt("Email:");
    const role = prompt("Ρόλος (admin/user):");

    if (name && email && role) {
        fetch(`${API_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: name, email, role })
        }).then(() => loadUsers());
    }
}

function addTrainer() {
    const name = prompt("Όνομα γυμναστή:");
    const specialty = prompt("Ειδικότητα:");

    if (name && specialty) {
        fetch(`${API_URL}/trainers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, specialty })
        }).then(() => loadTrainers());
    }
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
async function loadAnnouncements() {
    const response = await fetch(`${API_URL}/announcements`);
    const announcements = await response.json();
    const list = document.getElementById("announcementsList");
    list.innerHTML = "";

    announcements.forEach(announcement => {
        const item = `<li>
            <strong>${announcement.title}</strong>: ${announcement.content}
            <button onclick="deleteAnnouncement(${announcement.id})">🗑️</button>
        </li>`;
        list.innerHTML += item;
    });
}


// ❌ Αποσύνδεση
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
}
