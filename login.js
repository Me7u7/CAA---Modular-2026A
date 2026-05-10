console.log("LOGIN conectado");

/* USUARIOS */
let users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

/* CONTENEDOR */
const usersGrid =
    document.getElementById("usersGrid");

/* MOSTRAR USUARIOS */
function renderUsers(){

    usersGrid.innerHTML = "";

    users.forEach(user => {

        usersGrid.innerHTML += `

            <div
                class="user-card"
                onclick="selectUser('${user.id}')"
            >

                <div class="avatar">
                    👤
                </div>

                <div class="user-name">
                    ${user.name}
                </div>

            </div>

        `;
    });

}

/* MODAL */
function openModal(){

    document
        .getElementById("modal")
        .classList.remove("hidden");
}

function closeModal(){

    document
        .getElementById("modal")
        .classList.add("hidden");
}

/* CREAR USUARIO */
function createUser(){

    const username =
        document
        .getElementById("username")
        .value
        .trim();

    const pin =
        document
        .getElementById("pin")
        .value
        .trim();

    if(username === "" || pin.length < 4){

        alert("Completa los datos");

        return;
    }

    const newUser = {

        id: crypto.randomUUID(),

        name: username,

        pin: pin
    };

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    renderUsers();

    closeModal();

    document
        .getElementById("username")
        .value = "";

    document
        .getElementById("pin")
        .value = "";
}

/* SELECCIONAR USUARIO */
function selectUser(userId){

    const pin =
        prompt("Ingresa PIN");

    const user =
        users.find(
            u => u.id === userId
        );

    if(!user) return;

    if(pin === user.pin){

        localStorage.setItem(
            "currentUser",
            JSON.stringify(user)
        );

        window.location.href =
            "index.html";

    } else {

        alert("PIN incorrecto");
    }
}

/* INICIO */
renderUsers();