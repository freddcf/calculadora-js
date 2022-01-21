// Get main show and preview input
const output = document.querySelector("#output");
const preview = document.querySelector("#preview");
// Get all buttons
const keyBtn = document.querySelector(".buttons");
const historicBtn = document.querySelector("button.historic");
const clearHistoricBtn = document.querySelector("button.clearHistoric");
const histLayout = document.querySelector(".historic_layout");
const histList = document.querySelector(".historic_list");

let previewResult,
  currentResult,
  strNum = "",
  newValue = "",
  toggle = true,
  historic = [],
  previuosOutput = "";

// ---------- Event listeners ----------

// Event to open and close the historic
historicBtn.addEventListener("click", (e) => {
  // Set historic scroll
  document.querySelector(".historic_list").scrollTop =
    document.querySelector(".historic_list").scrollHeight;

  if (toggle === true) {
    historicBtn.innerHTML = `<i class="fas fa-calculator"></i>`;
    keyBtn.style.display = "none";
    histLayout.style.display = "flex";
    toggle = false;
  } else if (toggle === false) {
    historicBtn.innerHTML = `<i class="far fa-clock"></i>`;
    keyBtn.style.display = "grid";
    histLayout.style.display = "none";
    toggle = true;
  }
});

// Event to clear the historic
clearHistoricBtn.addEventListener("click", (e) => {
  historic = "";
  histList.innerHTML = `<li align="center" id="res">-------------</li><li align="center" id="res">Sem registros</li><li align="center" id="res">-------------</li>`;
});

// Event checking if a button was clicked
keyBtn.addEventListener("click", (e) => {
  // Get value of clicked buttons
  if (
    e.target.classList[0] === "common" ||
    e.target.classList[0] === "operation" ||
    e.target.classList[0] === "operationEsp" ||
    e.target.classList[0] === "dot"
  ) {
    print(e.target.innerHTML);
  }

  // Getting clear options
  if (e.target.classList[1] === "backspace") {
    console.log((previewResult = output.value));
    previewResult = output.value;
    output.value = previewResult.substr(0, previewResult.length - 1);
    preview.value = maskedValues();
    newValue = output.value;
  }
  if (e.target.classList[1] === "clear") {
    output.value = "";
    strNum = "";
    newValue = "";
  }

  if (e.target.classList[0] === "change") {
    if (!["-"].includes(output.value.charAt(0))) {
      output.value = "-" + output.value;
      newValue = output.value;
    } else if (["-"].includes(output.value.charAt(0))) {
      output.value = output.value.substr(1);
      newValue = output.value;
    }
  }

  // Save preview value
  if (output.value !== "") {
    preview.value = maskedValues();
  }
  if (output.value === "") {
    preview.value = "";
  }

  // Check if equals was clicked
  if (e.target.classList[1] === "equals" && output.value !== "") {
    historic.push(output.value);
    output.value = maskedValues();
    historic.push("=" + output.value);
    preview.value = "";
    strNum = output.value;

    histList.innerHTML = "";
    historic.forEach((element) => {
      if (historic.indexOf(element) % 2 === 0) {
        histList.innerHTML += `<li>${element}</li>`;
      } else {
        histList.innerHTML += `<li id="res">${element}</li>`;
      }
    });
  }

  //---------- Functions ----------

  // Print and check values
  function print(val) {
    let filteredValue =
      e.target.classList[1] === "multi"
        ? "x"
        : e.target.classList[1] === "divide"
        ? "/"
        : e.target.classList[1] === "percent"
        ? "%"
        : val;
    if (e.target.classList[1] !== "equals") {
      if (
        !["+", "-", "x", "/", "%", "."].includes(filteredValue) &&
        output.value == ""
      ) {
        output.value = filteredValue;
        newValue += filteredValue;
        strNum += filteredValue;
      } else if (
        ["+", "-", "x", "/", "%", "."].includes(filteredValue) &&
        !["+", "-", "x", "/", "%", ".", ""].includes(
          output.value.charAt(output.value.length - 1)
        )
      ) {
        if (filteredValue === "%") {
          strNum = output.value;
          strNum = maskedValues();
          strNum = strNum / 100;
          newValue = "";
          newValue += strNum;
        } else {
          newValue += filteredValue;
        }

        output.value += filteredValue;
        strNum = "";
      } else if (
        filteredValue === "-" &&
        ["+", "x", "/", "%"].includes(
          output.value.charAt(output.value.length - 1)
        )
      ) {
        strNum += filteredValue;
        newValue += filteredValue;
        output.value += filteredValue;
      } else if (e.target.classList[0] === "common") {
        if (["%"].includes(output.value.charAt(output.value.length - 1))) {
          filteredValue = "x" + filteredValue;
        }

        strNum += filteredValue;
        newValue += filteredValue;
        output.value += filteredValue;
      }
    }
  }

  // Preventing values from going wrong
  function maskedValues() {
    let previewNum;
    currentResult = output.value;
    try {
      if (["+", "-"].includes(currentResult.charAt(currentResult.length - 1))) {
        previewNum = "0";
        return calc(previewNum);
      } else if (
        ["/", "x"].includes(currentResult.charAt(currentResult.length - 1))
      ) {
        previewNum = "1";
        return calc(previewNum);
      } else {
        return calc(previewNum);
      }
    } catch {
      return "NaN";
    }
  }

  // Main calculation function
  function calc(previewNum) {
    currentResult = newValue;
    currentResult = currentResult.replaceAll("x", "*");
    if (previewNum === undefined) {
      previewNum = "";
    }
    return eval(currentResult + previewNum);
  }
});
