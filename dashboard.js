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
function loadUserProfile() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        console.error("❌ Το userId είναι άδειο ή undefined!");
        alert("⚠️ Πρόβλημα ταυτοποίησης. Παρακαλώ ξανασυνδεθείτε.");
        window.location.href = "index.html";
        return;
    }

    console.log(`📡 Κάνω fetch από: ${API_URL}/profile?id=${userId}`);

    fetch(`${API_URL}/profile?id=${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`❌ Σφάλμα HTTP! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("ℹ️ Δεδομένα χρήστη:", data);

            if (data.error) {
                console.error("❌ Σφάλμα στο profile:", data.error);
                alert("❌ Πρόβλημα με τη φόρτωση των δεδομένων. Ξανακάνε login.");
                localStorage.removeItem("user_id");
                window.location.href = "index.html";
                return;
            }

            const emailDisplay = document.getElementById("emailDisplay");
            if (emailDisplay) {
                emailDisplay.innerText = `Email: ${data.email}`;
            } else {
                console.error("❌ Το στοιχείο emailDisplay δεν βρέθηκε στη σελίδα!");
            }

            localStorage.setItem("userEmail", data.email);
            console.log("✅ Το προφίλ φορτώθηκε επιτυχώς!");
        })
        .catch(error => {
            console.error("❌ Σφάλμα στο fetch:", error);
            alert("⚠️ Πρόβλημα επικοινωνίας με τον server!");
            window.location.href = "index.html";
        });
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

// Φέρνει τα διαθέσιμα προγράμματα και τα εμφανίζει
async function loadPrograms() {
    try {
        const response = await fetch("https://gymsite-six.vercel.app/programs"); // Χωρίς API_URL
        const programs = await response.json();

        if (!Array.isArray(programs)) { // Σωστός έλεγχος
            console.error("❌ Invalid programs data:", programs);
            return;
        }

        const table = document.getElementById("dashboardProgramsTable"); // Έλεγξε το ID

        if (!table) {
            console.error("❌ Το στοιχείο dashboardProgramsTable δεν βρέθηκε στη σελίδα!");
            return;
        }

        let rows = ""; // Συγκεντρώνουμε τις γραμμές

        programs.forEach(program => {
            rows += `<tr>
                <td>${program.name}</td>
                <td>${program.max_capacity}</td>
                <td>${program.trainer_id}</td>
                <td>${program.day_of_week}</td>
                <td>${program.time}</td>
                <td>
                    <button onclick="reserveProgram(${program.id})">📅 Κράτηση</button>
                </td>
            </tr>`;
        });

        table.innerHTML = rows; // Προσθήκη όλων των σειρών μαζί

        console.log("✅ Προγράμματα φορτώθηκαν επιτυχώς!");
    } catch (error) {
        console.error("❌ Σφάλμα φόρτωσης προγραμμάτων:", error);
    }
}

// 🔥 Κάλεσέ το όταν φορτώσει η σελίδα
document.addEventListener("DOMContentLoaded", () => {
    loadPrograms();
    loadReservations();  // ✅ Θα φορτώνει αυτόματα τις κρατήσεις
});

// Κάνει κράτηση για τον συνδεδεμένο χρήστη
function reserveProgram(programId) {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("Πρέπει να είστε συνδεδεμένος για να κάνετε κράτηση.");
        return;
    }

    fetch(`${API_URL}/reserve`, { // ✅ Βάλε το σωστό backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, program_id: programId })
    })
    .then(response => response.json())
.then(data => {
    if (!data.success) {
        alert(data.error); // Δείχνει "Πλήρες πρόγραμμα" αν δεν υπάρχει διαθεσιμότητα
        return;
    }
    alert(data.message); // Εμφανίζει επιτυχές μήνυμα κράτησης
    loadPrograms();
    loadReservations();
})
    .catch(error => console.error("Σφάλμα κατά την κράτηση:", error));
}


// Φέρνει το ιστορικό κρατήσεων του χρήστη
function loadReservations() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        console.error("❌ Δεν υπάρχει user_id στο localStorage.");
        return;
    }

    fetch(`${API_URL}/reservations/${userId}`) // ✅ Σωστό backend URL
        .then(response => {
            if (!response.ok) {
                throw new Error("Αποτυχία φόρτωσης κρατήσεων.");
            }
            return response.json();
        })
        .then(reservations => {
            const tableBody = document.getElementById("reservationsTable");
            tableBody.innerHTML = "";

            reservations.forEach(reservation => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reservation.program_name}</td>
                    <td>${reservation.trainer_id}</td>
                    <td>${reservation.day}</td> <!-- ✅ Διόρθωση του πεδίου -->
                    <td>${reservation.time}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Σφάλμα κατά τη φόρτωση του ιστορικού κρατήσεων:", error));
}
