let currentQuestions = [];
let currentTopic = "Loading...";
let currentQuestionIndex = 0;

//--------------------------------------------------------------------------------
function loadXmlDoc(filename, callback) {
  let xhttp;
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
  currentTopic = xmlDoc.getElementsByTagName("topic")[0].childNodes[0].nodeValue;
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
  $("#topic").text(currentTopic);
  currentQuestionIndex = index;
  if (currentQuestions.length == 1) {
    $("#totalQuestions").text("1 question loaded.");
  } else {
    $("#totalQuestions").text(currentQuestions.length + " questions loaded.");
  }
  const thisQuestion = currentQuestions[currentQuestionIndex];
  $("#questionIndex").text("Q" + (index + 1) + ". ");
  const questionTextHTML = marked.parse(thisQuestion.text);
  $("#questionText").html('<div>' + questionTextHTML.replace(/<table>/g, '<table class="markdownTable">').replace(/<table>/g, '<table class="markdownTable">') + "</div>");
  $("#answersForm").empty(); // Clear previous options

  const isMultipleCorrect = thisQuestion.options.filter(option => option.isValid).length > 1;
  const inputType = isMultipleCorrect ? "checkbox" : "radio";

  thisQuestion.options.forEach((option, index) => {
    // Convert Markdown in option.detail to HTML
    const detailHTML = marked.parse(option.detail);

    // Create a new div element for the option
    const $optionDiv = $(`
      <div class="form-check">
        <input class="form-check-input" type="${inputType}" name="answer" id="option${index}" value="${option.isValid}">
        <label class="form-check-label" for="option${index}"></label>
      </div>
    `);
    // Append the converted HTML to the label within the div
    $optionDiv.find(`label[for="option${index}"]`).html("<div>" + detailHTML.replace(/<table>/g, '<table class="markdownTable">').replace(/<p>/g, '<p class="optionPara">') + "</div>");
    // Append the option div to the form
    $("#answersForm").append($optionDiv);
  });

  $("#submitBtn").prop('disabled', false);
  if (currentQuestionIndex <= 0) {
    $("#previousBtn").prop('disabled', true);
    $("#nextBtn").prop('disabled', false);
  } else if (currentQuestionIndex >= currentQuestions.length - 1) {
    $("#nextBtn").prop('disabled', true);
    $("#previousBtn").prop('disabled', false);
  } else {
    $("#previousBtn").prop('disabled', false);
    $("#nextBtn").prop('disabled', false);
  }
}

//--------------------------------------------------------------------------------
$("#resetBtn").click(function (e) {
  e.preventDefault();
  displayQuestion(currentQuestionIndex);
});

//--------------------------------------------------------------------------------
$("#submitBtn").click(function (e) {
  e.preventDefault();
  $("#answersForm input").each(function () {
    const isCorrect = $(this).val() === "true";
    $(this)
      .next("label")
      .css("color", isCorrect ? "green" : "red");
  });
  $("#submitBtn").prop('disabled', true);
});

//--------------------------------------------------------------------------------
$("#nextBtn").click(function (e) {
  e.preventDefault();
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    displayQuestion(currentQuestionIndex);
  }
});

//--------------------------------------------------------------------------------
$("#previousBtn").click(function (e) {
  e.preventDefault();
  currentQuestionIndex--;
  if (currentQuestionIndex < currentQuestions.length) {
    displayQuestion(currentQuestionIndex);
  } 
});


//--------------------------------------------------------------------------------
$(document).ready(function () {
  loadXmlDoc("qb-Google-Cloud-Big-Data-and-Machine-Learning-Fundamentals.xml", function(responseText) {
    currentQuestions = parseXML(responseText);
    displayQuestion(currentQuestionIndex);
  });
});
