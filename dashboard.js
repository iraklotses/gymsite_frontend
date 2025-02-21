const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("📌 Το dashboard.js φορτώθηκε!");

// LOGOUT FUNCTION
function logout() {
    localStorage.clear();
    alert("👋 Αποσυνδεθήκατε!");
    window.location.href = "index.html";
}

// Φέρνει τα διαθέσιμα προγράμματα και τα εμφανίζει
async function loadPrograms() {
    try {
        const response = await fetch("https://gymsite-six.vercel.app/programs"); 
        const programs = await response.json();

        if (!Array.isArray(programs)) { 
            console.error("❌ Invalid programs data:", programs);
            return;
        }

        const table = document.getElementById("dashboardProgramsTable"); // Έλεγχος το ID

        if (!table) {
            console.error("❌ Το στοιχείο dashboardProgramsTable δεν βρέθηκε στη σελίδα!");
            return;
        }

        let rows = ""; 

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

        table.innerHTML = rows; 

        console.log("✅ Προγράμματα φορτώθηκαν επιτυχώς!");
    } catch (error) {
        console.error("❌ Σφάλμα φόρτωσης προγραμμάτων:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPrograms();
    loadReservations(); 
});

// Κάνει κράτηση για τον συνδεδεμένο χρήστη
function reserveProgram(programId) {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
        alert("Πρέπει να είστε συνδεδεμένος για να κάνετε κράτηση.");
        return;
    }

    fetch(`${API_URL}/reserve`, { 
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

    fetch(`${API_URL}/reservations/${userId}`)
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
