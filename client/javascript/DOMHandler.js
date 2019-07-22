let connectionBtn = document.getElementById("btn-websocket-connection");
let newInputChannel = document.getElementById("i-new-channel");
let btnToggleRecording = document.getElementById("btn-toggle-recording");


function updateConnectionStatusLabel(status) {
	
	if (status == "disconnected") connectionBtn.innerHTML = "CONNECT";
	else if (status == "connecting") connectionBtn.innerHTML = "CONNECTING";
	else if (status == "connected") connectionBtn.innerHTML = "DISCONNECT";

}


function updateChannelList(newChannelName) {

	let newLi = document.createElement("li");
	newLi.appendChild(document.createTextNode(newChannelName));
	document.getElementById("ul-channels").appendChild(newLi);

	newInputChannel.value = "";

}

function createNewChannelPlot(newChannelName) {

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

	return dataPlot;

}


function updateToggleRecordingBtn(status) {

	console.log(status);

	if (status == "recording") btnToggleRecording.innerHTML = "STOP";
	else if (status == "not-recording") btnToggleRecording.innerHTML = "RECORD";

}


function updateRecordingStatus() {



}