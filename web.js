const SUPABASE_URL = "https://gsyzcovbrdceklzaijrt.supabase.co";

const SUPABASE_KEY = "TU_PUBLIC_ANON_KEY";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase conectado");

let sentence = [];

let counts = JSON.parse(localStorage.getItem("counts")) || {
    yo: 0,
    hambre: 0,
    sed: 0,
    sueño: 0,
    dolor: 0,
    miedo: 0,
    sí: 0,
    no: 0
};

let logs = JSON.parse(localStorage.getItem("logs")) || [];

const sentenceBox = document.getElementById("sentence");

const cards = [
    { id: "yo", word: "yo" },
    { id: "hambre", word: "hambre" },
    { id: "sed", word: "sed" },
    { id: "sueno", word: "sueño" },
    { id: "dolor", word: "dolor" },
    { id: "miedo", word: "miedo" },
    { id: "si", word: "sí" },
    { id: "no", word: "no" }
];

function updateSentence(){

    if(sentence.length === 0){
        sentenceBox.innerText = "Aquí se muestra la oración";
    }
    else{
        sentenceBox.innerText = sentence.join(" ");
    }
}

function addWord(word){

    sentence.push(word);

    updateSentence();
}

function speak(){

    if(sentence.length === 0) return;

    const text = sentence.join(" ");

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "es-MX";

    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
}

function deleteLast(){

    sentence.pop();

    updateSentence();
}

function clearAll(){

    sentence = [];

    updateSentence();
}

function renderCounts(){

    const countsTable = document.getElementById("countsTable");

    countsTable.innerHTML = `
        <tr>
            <th>Palabra</th>
            <th>Conteo</th>
        </tr>
    `;

    for(let word in counts){

        countsTable.innerHTML += `
            <tr>
                <td>${word}</td>
                <td>${counts[word]}</td>
            </tr>
        `;
    }
}

function renderLogs(){

    const logsTable = document.getElementById("logsTable");

    logsTable.innerHTML = `
        <tr>
            <th>Palabra</th>
            <th>Hora</th>
            <th>Frase</th>
        </tr>
    `;

    logs.forEach(log => {

        logsTable.innerHTML += `
            <tr>
                <td>${log.word}</td>
                <td>${log.time}</td>
                <td>${log.phrase}</td>
            </tr>
        `;
    });
}

function checkPassword(){

    const password = document.getElementById("password").value;

    if(password === "1234"){

        document.getElementById("dataPanel").style.display = "block";

        renderCounts();

        renderLogs();
    }
    else{

        alert("Contraseña incorrecta");
    }
}

cards.forEach(card => {

    const element = document.getElementById(card.id);

    const word = card.word;

    element.addEventListener("click", async () => {

        addWord(word);

        counts[word]++;

        localStorage.setItem(
            "counts",
            JSON.stringify(counts)
        );

        const time = new Date().toLocaleTimeString();

        const currentPhrase = sentence.join(" ");

        logs.push({
            word,
            time,
            phrase: currentPhrase
        });

        localStorage.setItem(
            "logs",
            JSON.stringify(logs)
        );

        const { data, error } = await supabaseClient
            .from("card_logs")
            .insert([
                {
                    word,
                    phrase: currentPhrase,
                    count: counts[word]
                }
            ]);

        if(error){

            console.error("ERROR SUPABASE:", error);
        }
        else{

            console.log("Guardado:", data);
        }
    });
});

updateSentence();

renderCounts();

renderLogs();