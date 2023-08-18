const WEIN_ANZAHL = 4;
const MWST = 0.19;
const versand_dhl = document.getElementById("versand_dhl");
const versand_spedition = document.getElementById("versand_spedition");


/**
 * 
 * @param {DOMElement} element 
 * @description Updated die Wein-Summen, Versand-Optionen und Gesamt-Summen
 */
function updateValue(element) {
    if (!checkInput(element)) return;

    let wein_summe = document.getElementById(element.id + "_summe");
    let wein_preis = document.getElementById(element.id + "_preis");
    let preis = element.value * parseFloat(wein_preis.innerText);
    wein_summe.value = preis.toFixed(2);

    //Check if Flaschen-Summe > 12 und DHL is checked
    if (versand_dhl.checked && getFlaschenAnzahl() > 12) {
        versand_dhl.checked = false;
        versand_spedition.checked = true;
    }
    updateSumme();
}

/**
 * 
 * @param {DOMElement} input 
 * @returns {false}   if input-Value is Not a Number
 * Gives visual Feedback
 */
function checkInput(input) {
    if (isNaN(input.value)) {
        input.style = "box-shadow: 0 0 3px #CC0000";
        document.getElementById(input.id + "_summe").value = 0;
        return false;
    }
    input.style = "box-shadow: none;";
    return true;
}


versand_dhl.addEventListener("click", (e) => {
    if (getFlaschenAnzahl() > 12) {
        e.preventDefault();
    } else {
        document.getElementById("dhl_preis").value = 10;
        document.getElementById("spedition_preis").value = "";
        updateSumme();
    }
});

versand_spedition.addEventListener("click", () => {
    document.getElementById("spedition_preis").value = 15;
    document.getElementById("dhl_preis").value = "";
    updateSumme();
});

/**
 * @description Updated die zwischenSumme, Mehrwertsteuer und Gesamtsumme 
 */
function updateSumme() {
    const zwischenSumme = document.getElementById("zwischensumme");
    const mwst = document.getElementById("mwst");
    const summe = document.getElementById("summe");

    //Zwischensumme
    let zsumme = 0;
    getWeinPreise().forEach(preis => {
        zsumme += preis;
    });
    zwischenSumme.value = zsumme.toFixed(2);

    //Mehrwertsteuer
    let mehrwert = zsumme * MWST;
    mwst.value = mehrwert.toFixed(2);

    //Gesamt Summe
    let s = zsumme + mehrwert;
    summe.value = s.toFixed(2);
}

/**
 * 
 * @returns {Array} Die berechneten Wein-Summen
 */
function getWeinPreise() {
    let preise = []
    for(let i=1; i<=WEIN_ANZAHL; i++) {
        let preis = document.getElementById("wein" + i + "_summe").value;
        preise.push(parseFloat(preis));
    }
    if(versand_dhl.checked) {
        preise.push(10);
    } else {
        preise.push(15);
    }
    return preise;
}

/** 
 * @returns  {Number} Die gesamte eingegebene Flaschen Anzahl  
*/
function getFlaschenAnzahl() {
    let anzahl = 0;
    for(let i=1; i<=WEIN_ANZAHL; i++) {
        let flaschen = document.getElementById("wein" + i).value;
        if(isNaN(flaschen)) continue;
        anzahl += parseInt(flaschen);
    }
    return anzahl;
}