const SUPABASE_URL =
"https://gsyzcovbrdceklzaijrt.supabase.co";

const SUPABASE_KEY = "sb_publishable_29QILtAK6ztpr7FCSIcOIQ_zobUeRWR";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("LOGIN conectado");

/* LOGIN */
async function login(){

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

    if(username === "" || pin === ""){

        alert("Completa los datos");

        return;
    }

    const { data, error } =
        await supabaseClient
        .from("users")
        .select("*")
        .eq("name", username)
        .eq("pin", pin)
        .single();

    if(error || !data){

        alert("Usuario o PIN incorrecto");

        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(data)
    );

    window.location.href =
        "index.html";
}

/* ABRIR MODAL */
function openModal(){

    document
        .getElementById("modal")
        .classList.remove("hidden");
}

/* CERRAR MODAL */
function closeModal(){

    document
        .getElementById("modal")
        .classList.add("hidden");
}

/* CREAR USUARIO */
async function createUser(){

    const username =
        document
        .getElementById("newUsername")
        .value
        .trim();

    const pin =
        document
        .getElementById("newPin")
        .value
        .trim();

    if(username === "" || pin.length < 4){

        alert("Datos incompletos");

        return;
    }

    const { error } =
        await supabaseClient
        .from("users")
        .insert([
            {
                name: username,
                pin: pin
            }
        ]);

    if(error){

        console.error(error);

        alert("Error al crear usuario");

        return;
    }

    alert("Usuario creado");

    closeModal();

    document
        .getElementById("newUsername")
        .value = "";

    document
        .getElementById("newPin")
        .value = "";
}