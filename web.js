console.log("JS conectado");

let sentence = [];

/* CONTADORES */
let counts = JSON.parse(localStorage.getItem("counts")) || {};
let logs = JSON.parse(localStorage.getItem("logs")) || [];

/* TARJETAS */
const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    const word = card.dataset.word;

    if(!counts[word]) counts[word] = 0;

    card.addEventListener("click", () => {
        addWord(word);

        /* CONTADOR */
        counts[word]++;
        localStorage.setItem("counts", JSON.stringify(counts));

        /* LOG CON HORA */
        const time = new Date().toLocaleTimeString();
        logs.push({word, time});
        localStorage.setItem("logs", JSON.stringify(logs));
    });
});

/* FRASE */
function addWord(word){
    sentence.push(word);
    updateSentence();
}

function updateSentence(){
    const sentenceDiv = document.getElementById("sentence");
    sentenceDiv.textContent = sentence.length 
        ? sentence.join(" ") 
        : "Aquí se muestra la oración";
}

/* AUDIO */
function speak(){
    if(sentence.length === 0) return;

    const utterance = new SpeechSynthesisUtterance(sentence.join(" "));
    utterance.lang = "es-MX";
    utterance.pitch = 1.2;

    speechSynthesis.speak(utterance);
}

/* BORRAR */
function deleteLast(){
    sentence.pop();
    updateSentence();
}

function clearAll(){
    sentence = [];
    updateSentence();
}

/* PANEL ADMIN */
const adminBtn = document.getElementById("adminBtn");
const panel = document.getElementById("adminPanel");

adminBtn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
});

/* CONTRASEÑA */
function checkPassword(){
    const pass = document.getElementById("password").value;

    if(pass === "1234"){  // 🔐 puedes cambiarla
        showTable();
    } else {
        alert("Contraseña incorrecta");
    }
}

/* TABLA */
function showTable(){
    const tableDiv = document.getElementById("dataTable");

    let html = "<table>";
    html += "<tr><th>Palabra</th><th>Conteo</th></tr>";

    for(let word in counts){
        html += `<tr><td>${word}</td><td>${counts[word]}</td></tr>`;
    }

    html += "</table><br>";

    html += "<table>";
    html += "<tr><th>Palabra</th><th>Hora</th></tr>";

    logs.forEach(log => {
        html += `<tr><td>${log.word}</td><td>${log.time}</td></tr>`;
    });

    html += "</table>";

    tableDiv.innerHTML = html;
}