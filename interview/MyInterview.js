let xmlDocs = {
  Architecture: loadXMLDoc("MyInterview-Architecture.xml"),
  Behaviour: loadXMLDoc("MyInterview-Behaviour.xml"),
  Cloud: loadXMLDoc("MyInterview-Cloud.xml"),
  Coding: loadXMLDoc("MyInterview-Coding.xml"),
  DataStore: loadXMLDoc("MyInterview-DataStore.xml"),
  DataStructure: loadXMLDoc("MyInterview-DataStructure.xml"),
  Development: loadXMLDoc("MyInterview-Development.xml"),
  DevOps: loadXMLDoc("MyInterview-DevOps.xml"),
  General: loadXMLDoc("MyInterview-General.xml"),
  Integration: loadXMLDoc("MyInterview-Integration.xml"),
  Leadership: loadXMLDoc("MyInterview-Leadership.xml"),
  Microservice: loadXMLDoc("MyInterview-Microservice.xml"),
  Networking: loadXMLDoc("MyInterview-Networking.xml"),
  OperatingSystem: loadXMLDoc("MyInterview-OperatingSystem.xml"),
  Security: loadXMLDoc("MyInterview-Security.xml"),
  Testing: loadXMLDoc("MyInterview-Testing.xml"),
  Web: loadXMLDoc("MyInterview-Web.xml"),
};
let xslDoc = loadXMLDoc("MyInterview.xsl");
let currentXmlDoc = xmlDocs['Architecture'];
let filterKey = "*";
let filterType = "";
let filterQuestion = "";

function goDefault() {
  displayResult(currentXmlDoc);
}

function loadXMLDoc(filename) {
  if (window.ActiveXObject) {
    xhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } else {
    xhttp = new XMLHttpRequest();
  }
  xhttp.open("GET", filename, false);
  try {
    xhttp.responseType = "msxml-document"
  } catch (err) {
  } // Helping IE11
  xhttp.send("");
  return xhttp.responseXML;
}

function displayResult(xmlDoc) {
  if (window.ActiveXObject || xhttp.responseType === "msxml-document") {
    // code for IE
    document.getElementById("resultBody").innerHTML = xmlDoc.transformNode(xslDoc);
  } else if (document.implementation && document.implementation.createDocument) {
    // code for Chrome, Firefox, Opera, etc.
    let xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xslDoc);
    xsltProcessor.setParameter(null, "filterQuestion", filterQuestion);
    xsltProcessor.setParameter(null, "filterType", filterType);
    let resultDocument = xsltProcessor
            .transformToFragment(xmlDoc, document);
    document.getElementById("resultBody").innerHTML = new XMLSerializer().serializeToString(resultDocument);
  }
}

function getQuestion(control) {
  filterType = document.getElementById("typeFilterInput").value;
  if (filterType == '') {
    filterType = '*';
  }
  filterQuestion = document.getElementById("questionFilterInput").value;
  if (filterQuestion == '') {
    filterQuestion = '*';
  }
  displayResult(currentXmlDoc);
  if (filterType != '*') {
    document.getElementById("typeFilterInput").value = filterType;
  }
  if (filterQuestion != '*') {
    document.getElementById("questionFilterInput").value = filterQuestion;
  }
  if (control != null) {
    document.getElementById(control).focus();
  }
}

function goQuestionBank(which) {
  filterType = document.getElementById("typeFilterInput").value;
  filterQuestion = document.getElementById("questionFilterInput").value;
  currentXmlDoc = xmlDocs[which]; // Access the property dynamically
  if (currentXmlDoc) {
    displayResult(currentXmlDoc);
  } else {
    console.error("Document not found: " + which);
  }
  document.getElementById("typeFilterInput").value = filterType;
  document.getElementById("questionFilterInput").value = filterQuestion;
}

function resetInput() {
  document.getElementById('typeFilterInput').value = '';
  document.getElementById('questionFilterInput').value = '';
  getQuestion();
}