const SUPABASE_URL = "https://gsyzcovbrdceklzaijrt.supabase.co";

const SUPABASE_KEY = "sb_publishable_29QILtAK6ztpr7FCSIcOIQ_zobUeRWR";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("JS conectado");

let sentence = [];

/* CONTADORES */
let counts = JSON.parse(localStorage.getItem("counts")) || {};
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* TARJETAS */
const cards = document.querySelectorAll(".card");

cards.forEach(card => {

    const word = card.dataset.word;

    /* INICIALIZAR CONTADOR */
    if(!counts[word]){
        counts[word] = 0;
    }

    card.addEventListener("click", async () => {

        /* AGREGAR PALABRA */
        addWord(word);

        /* CONTADOR */
        counts[word]++;

        localStorage.setItem(
            "counts",
            JSON.stringify(counts)
        );

        /* HORA */
        const time = new Date().toLocaleTimeString();

        logs.push({ word, time });

        localStorage.setItem(
            "logs",
            JSON.stringify(logs)
        );

        /* SUPABASE */
        const { error } = await supabaseClient
            .from('card_logs')
            .insert([
                { word }
            ]);

        if(error){
            console.error("ERROR SUPABASE:", error);
        } else {
            console.log("Dato guardado");
        }

    });

});

/* FRASE */
function addWord(word){

    sentence.push(word);

    updateSentence();
}

/* ACTUALIZAR TEXTO */
function updateSentence(){

    const sentenceDiv =
        document.getElementById("sentence");

    sentenceDiv.textContent = sentence.length
        ? sentence.join(" ")
        : "AQUÍ SE MUESTRA LA ORACIÓN";
}

/* AUDIO */
function speak(){

    if(sentence.length === 0) return;

    const utterance =
        new SpeechSynthesisUtterance(
            sentence.join(" ")
        );

    utterance.lang = "es-MX";
    utterance.pitch = 1.2;
    utterance.rate = 1;

    speechSynthesis.speak(utterance);
}

/* BORRAR ÚLTIMA */
function deleteLast(){

    sentence.pop();

    updateSentence();
}

/* LIMPIAR */
function clearAll(){

    sentence = [];

    updateSentence();
}

/* PANEL ADMIN */
const adminBtn =
    document.getElementById("adminBtn");

const panel =
    document.getElementById("adminPanel");

adminBtn.addEventListener("click", () => {

    panel.classList.toggle("hidden");

});

/* CONTRASEÑA */
function checkPassword(){

    const pass =
        document.getElementById("password").value;

    if(pass === "1234"){

        showTable();

    } else {

        alert("Contraseña incorrecta");

    }
}

/* TABLA */
function showTable(){

    const tableDiv =
        document.getElementById("dataTable");

    let html = "";

    /* TABLA CONTADORES */
    html += "<table>";

    html += `
        <tr>
            <th>Palabra</th>
            <th>Conteo</th>
        </tr>
    `;

    for(let word in counts){

        html += `
            <tr>
                <td>${word}</td>
                <td>${counts[word]}</td>
            </tr>
        `;
    }

    html += "</table><br>";

    /* TABLA HISTORIAL */
    html += "<table>";

    html += `
        <tr>
            <th>Palabra</th>
            <th>Hora</th>
        </tr>
    `;

    logs.forEach(log => {

        html += `
            <tr>
                <td>${log.word}</td>
                <td>${log.time}</td>
            </tr>
        `;
    });

    html += "</table>";

    tableDiv.innerHTML = html;
}