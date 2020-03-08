let webSocket = null;

let channels = [];
let dataPlots = [];
let plotCounter = 0;
let PLOT_EVERY = 1;

let maxVisibleDataPoints = 64;

let sampleRate = 32;
let dSP = 1;
let MIN_SAMPLE_RATE = 1
let MAX_SAMPLE_RATE = 20;

let recording = false;
let data_records = [[]];

function toggleWebSocketConnection() {

	if (webSocket == null) {

		let hostName = document.getElementById("i-websocket-ip").value;
		updateConnectionStatusLabel("connecting");

		console.log("Attempting to connect to ws://" + hostName);

		try {

			webSocket = new WebSocket("ws://" + hostName);

			webSocket.onopen = function(event) {

				console.log("Connection established!");
				updateConnectionStatusLabel("connected");

				webSocket.send(sampleRate);

			}
	
			webSocket.onmessage = function(event) {

				// console.log(data);

				addData(JSON.parse(event.data));
			
			}

			webSocket.onclose = function(event) {

				if (event.wasClean) {

					console.log("Connection was closed cleanly.");
					updateConnectionStatusLabel("disconnected");

				}

				webSocket = null;

			}

			webSocket.onerror = function(error) {

				console.log(error.message);
				updateConnectionStatusLabel("disconnected");

			}

		} catch (error) {

			console.log(error);

		}

	} else if (webSocket != null && webSocket.readyState === WebSocket.OPENED) {

		webSocket.close();
	
	}

}


function addChannel(newChannelName=null) {

	if (newChannelName == null) newChannelName = document.getElementById("i-new-channel").value;
	channels.push(newChannelName);

	updateChannelList(newChannelName);
	dataPlot = createNewChannelPlot(newChannelName);

	dataPlots.push(dataPlot);

}


function addData(data) {

	data_list = [];

	for (let i=0; i<channels.length; i++) {
	
		let channel = channels[i];
		let dataPlot = dataPlots[i];

		if (dataPlot.data.labels.length > maxVisibleDataPoints) removeData(dataPlot);
		if (plotCounter % PLOT_EVERY == 0) {
			dataPlot.data.labels.push(new Date().getSeconds());
			dataPlot.data.datasets[0].data.push(data[channel])
		}

		plotCounter++;

		dataPlot.update();

		data_list.push(data[channel], (new Date()).getTime());

	}

	if (recording) { 
		data_records[data_records.length - 1].push(data_list);
		// updateRecordingStatus(data_records.length, data_records[data_records.length - 1].length);
	}

}

function removeData(dataPlot){
	
	dataPlot.data.labels.shift();
	dataPlot.data.datasets[0].data.shift();

}

function changeSampleRate(dSPSign){

	sampleRate += dSP * dSPSign;
	if (sampleRate < MIN_SAMPLE_RATE) sampleRate = MIN_SAMPLE_RATE;
	else if (sampleRate > MAX_SAMPLE_RATE) sampleRate = MAX_SAMPLE_RATE;

	document.getElementById("i-sample-rate").value = sampleRate + "Hz";

	if (webSocket != null && webSocket.readyState === WebSocket.OPEN) {
	
		console.log(sampleRate);
		webSocket.send(1 / sampleRate);
		
	}
	
}

function btnToggleRecordingClicked() {

	if (recording == false) { 
		recording = true;
		updateToggleRecordingBtn(status="recording");
	}
	else {
		recording = false;
		updateToggleRecordingBtn(status="not-recording");
	}

}

function btnSeperateClicked() {
	data_records.push([]);
}

function btnSaveRecordingClicked() {

	for (var i = data_records.length - 1; i >= 0; i--) {
		data_record = data_records[i];

		let csv = channels.join(',') + "\n";

		data_record.forEach(function(row) {

			csv += row.join(',');
			csv += "\n";

		});

		let hiddenElement = document.createElement('a');
		hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
		hiddenElement.target = '_blank';
		hiddenElement.download = 'data_' + i + '.csv';
		hiddenElement.click();

	}

}

function btnResetRecordingClicked() {
	data_records = [[]];
	recording = false;
	updateToggleRecordingBtn(status="not-recording");
}

addChannel('channel_01');
addChannel('channel_02');
addData({'channel_01': 11, 'channel_02': 0});
addData({'channel_01': 15, 'channel_02': 1});
addData({'channel_01': 11, 'channel_02': 2});
addData({'channel_01': 11, 'channel_02': 5});
addData({'channel_01': 11, 'channel_02': 1});
addData({'channel_01': 12, 'channel_02': 3});
addData({'channel_01': 12, 'channel_02': 2});
addData({'channel_01': 14, 'channel_02': 1});
addData({'channel_01': 13, 'channel_02': 1});
dataPlot.update();
