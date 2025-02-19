const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("📌 Το dashboard.js φορτώθηκε!");

// ✅ Έλεγχος αν υπάρχει αποθηκευμένο user_id
const userId = localStorage.getItem("user_id");
console.log("🔍 Βρέθηκε user_id:", userId);

if (!userId) {
    console.error("❌ Δεν βρέθηκε user_id! Μεταφορά στην αρχική σελίδα...");
    window.location.href = "index.html"; // Σε γυρνάει πίσω στο login
} else {
    loadUserProfile();
}

// ✅ Φόρτωση προφίλ χρήστη
async function loadUserProfile() {
    try {
        console.log(`📡 Κάνω fetch από: ${API_URL}/profile?id=${userId}`);

        const response = await fetch(`${API_URL}/profile?id=${userId}`);
        const data = await response.json(); // Χρειάζεται await!

        console.log("ℹ️ Δεδομένα χρήστη:", data);

        if (data.error) {
            console.error("❌ Σφάλμα στο profile:", data.error);
            alert("❌ Πρόβλημα με τη φόρτωση των δεδομένων. Ξανακάνε login.");
            localStorage.removeItem("user_id");
            window.location.href = "index.html";
            return; // Βγες από τη συνάρτηση
        }

        const emailDisplay = document.getElementById("emailDisplay");
        if (emailDisplay) {
            emailDisplay.innerText = `Email: ${data.email}`;
        } else {
            console.error("❌ Το στοιχείο emailDisplay δεν βρέθηκε στη σελίδα!");
        }

        localStorage.setItem("userEmail", data.email);
    } catch (err) {
        console.error("❌ Σφάλμα στο fetch:", err);
        alert("⚠️ Πρόβλημα επικοινωνίας με τον server!");
        window.location.href = "index.html";
    }
}


// 📌 LOGOUT FUNCTION
function logout() {
    localStorage.clear();
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "index.html";
}

// ✅ Ανάκτηση email χρήστη από το localStorage
const userEmail = localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "index.html";
} else {
    const emailDisplay = document.getElementById("emailDisplay");
    if (emailDisplay) {
        emailDisplay.innerText = `Email: ${userEmail}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPrograms();
    loadReservations();
});

// Φέρνει τα διαθέσιμα προγράμματα και τα εμφανίζει
function loadPrograms() {
    fetch("/dashboard/programs")
        .then(response => response.json())
        .then(programs => {
            const tableBody = document.getElementById("programsTable");
            tableBody.innerHTML = "";
            programs.forEach(program => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${program.name}</td>
                    <td>${program.max_capacity}</td>
                    <td>${program.trainer_id}</td>
                    <td>${program.day}</td>
                    <td>${program.time}</td>
                    <td><button onclick="reserveProgram(${program.id})">Κράτηση</button></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Σφάλμα κατά τη φόρτωση των προγραμμάτων:", error));
}

// Κάνει κράτηση για τον συνδεδεμένο χρήστη
function reserveProgram(programId) {
    const userId = localStorage.getItem("user_id"); // Αποθηκεύουμε το user_id κατά το login

    fetch("/dashboard/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, program_id: programId })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadPrograms(); // Ανανέωση προγραμμάτων
        loadReservations(); // Ανανέωση ιστορικού
    })
    .catch(error => console.error("Σφάλμα κατά την κράτηση:", error));
}

// Φέρνει το ιστορικό κρατήσεων του χρήστη
function loadReservations() {
    const userId = localStorage.getItem("user_id");

    fetch(`/dashboard/reservations/${userId}`)
        .then(response => response.json())
        .then(reservations => {
            const tableBody = document.getElementById("reservationsTable");
            tableBody.innerHTML = "";
            reservations.forEach(reservation => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reservation.program_name}</td>
                    <td>${reservation.trainer_id}</td>
                    <td>${reservation.day}</td>
                    <td>${reservation.time}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Σφάλμα κατά τη φόρτωση του ιστορικού κρατήσεων:", error));
}
