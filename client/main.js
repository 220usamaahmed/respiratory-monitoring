let HOST_NAME = "192.168.137.151"

let webSocket, dataPlot;
let maxDataPoints = 20;

let data_points_record = []
let data_points_2 = []

function removeData(){
	dataPlot.data.labels.shift();
	dataPlot.data.datasets[0].data.shift();
	dataPlot.data.datasets[1].data.shift();
}

function addData(label, dp_1) {
	if(dataPlot.data.labels.length > maxDataPoints) removeData();
	dataPlot.data.labels.push(label);
	dataPlot.data.datasets[0].data.push(dp_1);
	dataPlot.data.datasets[1].data.push(dp_2);
	// dataPlot.data.datasets[2].data.push(dp_3);
	var date = new Date();
	// var timestamp = date.getTime();
	data_points_record.push([date.getTime(), dp_1, dp_2]);
	dataPlot.update();
}

function download_record() {
	var csv = 'dp1,dp2\n';
	data_points_record.forEach(function(row) {
		csv += row.join(',');
		csv += "\n";
	});

	console.log(csv);
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
	hiddenElement.target = '_blank';
	hiddenElement.download = 'data.csv';
	hiddenElement.click();
}

function init() {
	webSocket = new WebSocket('ws://' + HOST_NAME);
	
	dataPlot = new Chart(document.getElementById("line-chart"), {
		type: 'line',
		data: {
		labels: [],
		datasets: [{
			data: [],
			label: "Data Point 01",
			borderColor: "#3e95cd",
			fill: false
			}, 
			{
			data: [],
			label: "Data Point 02",
			borderColor: "#fe00cd",
			fill: false
			}, ]
		}
	});
	
	webSocket.onmessage = function(event) {
		let data = JSON.parse(event.data);
		console.log(data);
		let today = new Date();
		let t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		////// CHANGE HERE
		// addData(t, data.data_point_1, data.data_point_2);
		// addData(t, data.Object_temp, data.Ambient_temp);
	}
}

function sendDataRate(){
	let dataRate = document.getElementById("dataRateSlider").value;
	console.log(dataRate);
	webSocket.send(dataRate);
	dataRate = dataRate;
	document.getElementById("dataRateLabel").innerHTML = "One Sample every " + dataRate + " seconds.";
}