const SUPABASE_URL =
"https://gsyzcovbrdceklzaijrt.supabase.co";

const SUPABASE_KEY =
"sb_publishable_29QILtAK6ztpr7FCSIcOIQ_zobUeRWR";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("LOGIN conectado");

/* USUARIOS */
let users = [];

/* CONTENEDOR */
const usersGrid =
    document.getElementById("usersGrid");

/* CARGAR USUARIOS */
async function loadUsers(){

    const { data, error } =
        await supabaseClient
        .from("users")
        .select("*");

    if(error){

        console.error(error);

        return;
    }

    users = data;

    renderUsers();
}

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
async function createUser(){

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

    const { data, error } =
        await supabaseClient
        .from("users")
        .insert([
            {
                name: username,
                pin: pin
            }
        ])
        .select();

    if(error){

        console.error(error);

        alert("Error al crear usuario");

        return;
    }

    loadUsers();

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
            u => u.id == userId
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
loadUsers();