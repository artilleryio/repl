const socket = io();
const resultElement = document.getElementById("result");
const runScenarioButton = document.getElementById("run-scenario");
const stopScenarioButton = document.getElementById("stop-scenario");
const chartLink = document.getElementById("chart-link");
const rawLink = document.getElementById("raw-link");
const rawPanel = document.getElementById("raw-panel");
const chartPanel = document.getElementById("chart-panel");
const chartCanvas = document.getElementById("chart-canvas");
const loadingDataMessage = document.getElementById("loading-message");
let chart;

const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "yaml",
  styleActiveLine: true,
  lineNumbers: true,
});

editor.setSize(null, 690);

async function runScenarioHandler(event) {
  event.preventDefault();
  resultElement.textContent = "";

  await submitScenario(editor.getValue());

  createPieChart(chartCanvas);

  loadingDataMessage.style.display = "block";
}

async function stopScenarioHandler(event) {
  event.preventDefault();

  try {
    await fetch("/stop", {
      method: "POST",
      body: {},
    });
  } catch (err) {
    console.log("Error stopping scenario", err);
  }
}

async function submitScenario(value) {
  try {
    await fetch("/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/yaml",
      },
      cache: "no-cache",
      body: value,
    });
  } catch (err) {
    console.log("Error posting scenario", err);
  }
}

function getResponseCodeColour(value) {
  valueInt = parseInt(value, 10);

  if (valueInt < 300) {
    return "lightgreen";
  }

  if (valueInt < 400) {
    return "lightblue";
  }

  if (valueInt < 500) {
    return "orange";
  }

  if (valueInt < 600) {
    return "red";
  }
}

function createPieChart(element) {
  if (chart) chart.destroy();

  chart = new Chart(element, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
      labels: [],
    },
  });
}

runScenarioButton.addEventListener("click", runScenarioHandler);

stopScenarioButton.addEventListener("click", stopScenarioHandler);

rawLink.addEventListener("click", (event) => {
  event.preventDefault();

  chartPanel.style.display = "none";
  rawPanel.style.display = "block";

  rawLink.classList.add("active-link");
  chartLink.classList.remove("active-link");
});

chartLink.addEventListener("click", (event) => {
  event.preventDefault();

  rawPanel.style.display = "none";
  chartPanel.style.display = "block";

  chartLink.classList.add("active-link");
  rawLink.classList.remove("active-link");
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    runScenarioHandler(event);
  }
});

function updateChart(data) {
  const labels = Object.keys(data.codes);
  const values = Object.values(data.codes);

  if (!values.length) return;

  if (data.summaryReport) {
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.data.datasets[0].backgroundColor = labels.map(getResponseCodeColour);
  } else {
    labels.forEach((label, index) => {
      labelIdx = chart.data.labels.indexOf(label);

      if (labelIdx < 0) {
        const newLength = chart.data.labels.push(label);
        chart.data.datasets[0].data[newLength - 1] = values[index];
      } else {
        chart.data.datasets[0].data[labelIdx] += values[index];
      }
    });

    chart.data.datasets[0].backgroundColor = chart.data.labels.map(
      getResponseCodeColour
    );
  }

  loadingDataMessage.style.display = "none";
  chart.update();
}

socket.on("artilleryOutput", (data) => {
  if (data.text) {
    resultElement.textContent += data.text;
  }

  if (data.codes) {
    updateChart(data);
  }
});

socket.on("artilleryStatus", (status) => {
  if (status === "READY") {
    stopScenarioButton.style.display = "none";
    runScenarioButton.style.display = "block";
  }

  if (status === "RUNNING") {
    stopScenarioButton.style.display = "block";
    runScenarioButton.style.display = "none";
  }
});
