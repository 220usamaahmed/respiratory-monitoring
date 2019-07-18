let webSocket = null;

// if statement here is not correct.
function toggleWebSocketConnection() {

	if (webSocket == null) {

		let hostName = document.getElementById("i-websocket-ip").value;

		console.log("Attempting to connect to ws://" + hostName);

		try {

			webSocket = new WebSocket("ws://" + hostName);
	
			webSocket.onmessage = function(event) {

				addData(JSON.parse(event.data));
			
			}

		} catch (error) {

			console.log("Could Not Connect.");

		}

	} else if (webSocket != null && webSocket.readyState === WebSocket.OPENED) {

		webSocket.close()
	
	}

	// Call btn label update function.

}

channels = [];
dataPlots = [];

function addChannel() {

	let newChannelName = document.getElementById("i-new-channel").value
	channels.push(newChannelName);

	let newLi = document.createElement("li");
	newLi.appendChild(document.createTextNode(newChannelName));
	document.getElementById("ul-channels").appendChild(newLi);

	let newCanvas = document.createElement("canvas");
	document.getElementById("charts-holder").appendChild(newCanvas);

	dataPlot = new Chart(newCanvas, {
		type: 'line',
		data: {
		labels: [],
		datasets: [{
			data: [],
			label: "Data Point 01",
			borderColor: "#E91E63",
			fill: false
			}]
		},
		options: {
			title: {
				display: true,
				text: newChannelName
			}
		}
	});

	dataPlots.push(dataPlot);

}

let maxDataPoints = 16;

function addData(data) {

	console.log(data);

	data_list = [];

	for (let i=0; i<channels.length; i++) {
	
		let channel = channels[i];
		let dataPlot = dataPlots[i];

		if(dataPlot.data.labels.length > maxDataPoints) removeData(dataPlot);
		dataPlot.data.labels.push(new Date().getSeconds());
		dataPlot.data.datasets[0].data.push(data[channel])

		dataPlot.update();

		data_list.push(data[channel]);

	}

	if (recording) data_record.push(data_list);

}

function removeData(dataPlot){
	
	dataPlot.data.labels.shift();
	dataPlot.data.datasets[0].data.shift();

}

let sampleRate = 1;
let dSP = 1;
let MIN_SAMPLE_RATE = 1
let MAX_SAMPLE_RATE = 10;

function changeSampleRate(dSPSign){

	sampleRate += dSP * dSPSign;
	if (sampleRate < MIN_SAMPLE_RATE) sampleRate = MIN_SAMPLE_RATE;
	else if (sampleRate > MAX_SAMPLE_RATE) sampleRate = MAX_SAMPLE_RATE;

	document.getElementById("i-sample-rate").value = sampleRate + "Hz";

	webSocket.send(1 / sampleRate);

	// if (webSocket != null && webSocket.readyState === WebSocket.OPENED) {
	// 	console.log(sampleRate);
	// 	
	// } 
}

let recording = false;
let data_record = [];

function toggleRecording() {

	if (recording == false) recording = true;
	else recording = false;

}

function saveRecording() {

	let csv = channels.join(',') + "\n";

	data_record.forEach(function(row) {

		csv += row.join(',');
		csv += "\n";

	});

	let hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'data.csv';
	hiddenElement.click();

}