let currentQuestions = [];
let currentQuestionIndex = 0;

//--------------------------------------------------------------------------------
function loadXmlDoc(filename, callback) {
  var xhttp;
  if (window.ActiveXObject) {
    xhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } else {
    xhttp = new XMLHttpRequest();
  }
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // Call the callback function and pass the response text
      callback(this.responseText);
    }
  };
  xhttp.open("GET", filename, true); // Set true for asynchronous
  try {
    xhttp.responseType = "msxml-document";
  } catch (err) {} // Helping IE11, but we're actually using responseText
  xhttp.send();
}

//--------------------------------------------------------------------------------
function parseXML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const entries = xmlDoc.getElementsByTagName("entry");
  const questions = [];
  for (let entry of entries) {
    const question = new Object();
    question.text = entry.getElementsByTagName("question")[0].childNodes[0].nodeValue;
    const options = entry.getElementsByTagName("option");
    question.options = [];
    for (let option of options) {
      const isValid = option.getElementsByTagName("valid")[0].childNodes[0].nodeValue === "true";
      const detail = option.getElementsByTagName("detail")[0].childNodes[0].nodeValue;
      question.options.push({ isValid, detail });
    }
    questions.push(question);
  }
  return questions;
}

//--------------------------------------------------------------------------------
function displayQuestion(index) {
  currentQuestionIndex = index;
  const thisQuestion = currentQuestions[currentQuestionIndex];
  $("#questionText").text(thisQuestion.text);
  $("#answersForm").empty(); // Clear previous options

  const isMultipleCorrect =
  thisQuestion.options.filter((option) => option.isValid).length > 1;
  const inputType = isMultipleCorrect ? "checkbox" : "radio";
  thisQuestion.options.forEach((option, index) => {
    $("#answersForm").append(`
          <div class="form-check">
              <input class="form-check-input" type="${inputType}" name="answer" id="option${index}" value="${option.isValid}">
              <label class="form-check-label" for="option${index}">${option.detail}</label>
          </div>
      `);
  });
}

//--------------------------------------------------------------------------------
$("#submitBtn").click(function (e) {
  e.preventDefault();
  $("#answersForm input").each(function () {
    const isCorrect = $(this).val() === "true";
    $(this)
      .next("label")
      .css("color", isCorrect ? "green" : "red");
  });
  $("#submitBtn").show();
});

//--------------------------------------------------------------------------------
$("#nextBtn").click(function (e) {
  e.preventDefault();
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    displayQuestion(currentQuestionIndex);
    $("#submitBtn").show();
  }
  if (currentQuestionIndex >= currentQuestions.length - 1) {
    $("#nextBtn").hide();
  } else {
    $("#previousBtn").show();
    $("#nextBtn").show();
  }
});

//--------------------------------------------------------------------------------
$("#previousBtn").click(function (e) {
  e.preventDefault();
  currentQuestionIndex--;
  if (currentQuestionIndex < currentQuestions.length) {
    displayQuestion(currentQuestionIndex);
    $("#submitBtn").show();
    $("#previousBtn").hide();
  } 
  if (currentQuestionIndex <= 0) {
    $("#previousBtn").hide();
  } else {
    $("#previousBtn").show();
    $("#nextBtn").show();
  }
});


//--------------------------------------------------------------------------------
$(document).ready(function () {
  loadXmlDoc("qb-example.xml", function(responseText) {
    currentQuestions = parseXML(responseText);
    displayQuestion(currentQuestionIndex);
  });
});
