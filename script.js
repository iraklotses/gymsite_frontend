const API_URL = "https://gymsite-six.vercel.app"; // Backend URL

console.log("Το script.js φορτώθηκε!");

document.addEventListener("DOMContentLoaded", () => {
    const userLoginForm = document.getElementById("userLoginForm");
    const adminLoginForm = document.getElementById("adminLoginForm");

    if (userLoginForm) {
        userLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("userEmail").value;
            const password = document.getElementById("userPassword").value;

            await handleLogin(email, password, "user");
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("adminEmail").value;
            const password = document.getElementById("adminPassword").value;

            await handleLogin(email, password, "admin");
        });
    }
});

// Handle Login
async function handleLogin(email, password, expectedRole) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        console.log("Απάντηση από server:", result);

        if (result.success) {
            if (result.user.role === expectedRole) {
                localStorage.setItem("user_id", result.user.id);
                localStorage.setItem("user_role", result.user.role);

                alert(" Επιτυχής σύνδεση!");
                
                if (expectedRole === "user") {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "admin.html";
                }
            } else {
                alert(" Δεν έχετε πρόσβαση σε αυτό το τμήμα!");
            }
        } else {
            alert(" Λάθος στοιχεία!");
        }
    } catch (error) {
        console.error("Σφάλμα στο fetch:", error);
        alert("⚠ Πρόβλημα σύνδεσης στον server!");
    }
}

    // Φόρτωση Υπηρεσιών και Ανακοινώσεων
    loadServices();
    loadAnnouncements();

document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const full_name = document.getElementById("full_name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const formData = {
        full_name: full_name,
        email: email,
        password: password
    };

    try {
        const response = await fetch("https://gymsite-six.vercel.app/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Επιτυχής εγγραφή! Περιμένετε έγκριση από τον διαχειριστή.");
            document.getElementById("registerForm").reset(); 
        } else {
            alert("Σφάλμα: " + result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Πρόβλημα σύνδεσης με τον server.");
    }
});

//  Φόρτωση Υπηρεσιών 
async function loadServices() {
    try {
        console.log(" Ζητάμε υπηρεσίες από:", `${API_URL}/services`);
        const response = await fetch(`${API_URL}/services`);
        console.log(" Απάντηση από server:", response);

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const services = await response.json();
        console.log(" Ληφθείσες υπηρεσίες:", services);

        const servicesList = document.getElementById("servicesList");
        servicesList.innerHTML = "";

        if (services.length === 0) {
            servicesList.innerHTML = "<li>Δεν υπάρχουν διαθέσιμες υπηρεσίες.</li>";
            return;
        }

        services.forEach(service => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${service.name}</strong> <br>
                            
                            Περιγραφή: ${service.description} <br>
                            Τιμή: €${service.price}`;
            servicesList.appendChild(li);
        });
    } catch (error) {
        console.error(" Σφάλμα κατά τη φόρτωση των υπηρεσιών:", error);
        document.getElementById("servicesList").innerHTML = "<li> Αποτυχία φόρτωσης!</li>";
    }
}

// Φόρτωση Ανακοινώσεων
async function loadAnnouncements() {
    try {
        console.log(" Ζητάμε ανακοινώσεις από:", `${API_URL}/announcements`);
        const response = await fetch(`${API_URL}/announcements`);
        console.log(" Απάντηση από server:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const announcements = await response.json();
        console.log(" Ανακοινώσεις που λήφθηκαν:", announcements);

        const announcementsList = document.getElementById("announcementsList");
        announcementsList.innerHTML = "";

        if (announcements.length === 0) {
            console.log("⚠ Δεν υπάρχουν ανακοινώσεις!");
            announcementsList.innerHTML = "<li>Δεν υπάρχουν ανακοινώσεις.</li>";
            return;
        }

        announcements.forEach(announcement => {
            const li = document.createElement("li");

            // Μορφοποίηση ημερομηνίας
            const formattedDate = formatDate(announcement.created_at);

            li.innerHTML = `<strong>${announcement.title}</strong> <br>
                            <span style="color: gray; font-size: 14px;">🗓️ ${formattedDate}</span> <br>
                            <p>${announcement.content}</p>`;

            announcementsList.appendChild(li);
        });
    } catch (error) {
        console.error(" Σφάλμα στη φόρτωση των ανακοινώσεων:", error);
        document.getElementById("announcementsList").innerHTML = "<li> Πρόβλημα με τη φόρτωση των ανακοινώσεων.</li>";
    }
}

// Μορφοποίηση ημερομηνίας (π.χ. 16 Φεβρουαρίου 2025)
function formatDate(isoString) {
    const months = [
        "Ιανουαρίου", "Φεβρουαρίου", "Μαρτίου", "Απριλίου", "Μαΐου", "Ιουνίου",
        "Ιουλίου", "Αυγούστου", "Σεπτεμβρίου", "Οκτωβρίου", "Νοεμβρίου", "Δεκεμβρίου"
    ];

    const date = new Date(isoString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

