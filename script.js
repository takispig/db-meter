let localDbValues = [];     // array to store db values for each loop withing the refresh_rate
let refresh_rate = 500;
let color = 'green';
let stream;
let offset = 0;
let date;

navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
    
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(2048, 1, 1);
    const analyser = context.createAnalyser();

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 256;

    source.connect(analyser);
    analyser.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = () => {

        let data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        let rms = 0;

        for (var i = 0; i < data.length; i++) {
            if (data[i]>120) data[i] = 120
            rms += data[i]*data[i]
        }
        rms = Math.sqrt(rms / data.length);
        console.log("RMS: " + rms)

        offset = parseInt(document.getElementById("offset").value);
        document.getElementById("offset_value").innerText = offset;
        value = rms + offset;
        localDbValues.push(value);
    };
})

// update the volume every refresh_rate m.seconds
let updateDb = function() {
    window.clearInterval(interval);

    const db = document.getElementById("db");
    let volume = Math.round(localDbValues.reduce((a,b) => a+b) / localDbValues.length);
    //var volume = Math.round(Math.max.apply(null, localDbValues));
    if (!isFinite(volume)) volume = 0;  // we don't want/need negative decibels in that case
    db.innerText = volume;
    localDbValues = []; // clear previous values
    changeColor(volume);

    changeUpdateRate();
    interval = window.setInterval(updateDb, refresh_rate);
}
let interval = window.setInterval(updateDb, refresh_rate);


// change the visualization colors according to the dbValue
function changeColor(decibels) {
    if (decibels < 50) {color = 'green'}
    else if (decibels >=50 && decibels <70) {color = 'yellow'}
    else if (decibels >= 70 && decibels <90) {color = 'orange'}
    else {color = 'red'}

    //document.getElementById("visuals").style.height = dbValue + "px";
    document.getElementById("visuals").style.width = decibels*2/10 + "rem";
    if (decibels>=70) document.getElementById("visuals").style.background = 'red';
    else document.getElementById("visuals").style.background = 'black';
    document.getElementById("db").style.color = color;
}


// change update rate
function changeUpdateRate() {
    refresh_rate = Number(document.getElementById("refresh_rate").value);
    document.getElementById("refresh_value").innerText = refresh_rate;
    window.setInterval(function() {
        updateDb;
    }, refresh_rate);
}


// update the date of last project's version
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let repos = JSON.parse(this.responseText);
    repos.forEach((repo)=>{
        if (repo.name == "db-meter") {
            date = new Date(repo.pushed_at);
            document.getElementById("date").innerText = date.toLocaleDateString();
        }
    });
  }
};
xhttp.open("GET", "https://api.github.com/users/takispig/repos", true);
xhttp.send();