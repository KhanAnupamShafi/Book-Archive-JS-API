const getInputValue = () => {
  // Selecting the input element and get its value
  const textArea = document.getElementById("myInput");
  const inputVal = textArea.value;

  // Clear input field
  document.getElementById("myInput").value = "";
  document.getElementById("error").classList.add("d-none");
  document.getElementById("errortwo").classList.add("d-none");
  document.getElementById("resultStat").textContent = "";

  if (inputVal === "") {
    displayError("empty");
    return;
  }

  const url = `http://openlibrary.org/search.json?q=${inputVal}`;

  fetch(url)
    .then((response) => response.json())
    .then((books) => getAllbooks(books));

  return;
};

/* ------------------ Get all the books and check for error ----------------- */
const getAllbooks = (books) => {
  if (books.error) {
    displayError("timeout");
  } else if (books.numFound === 0) {
    displayError("noresult");
  } else if (books.numFound) {
    foundBooks(books);
  }
};

/* ------------------------- All found books process ------------------------ */
const foundBooks = (result) => {
  document.getElementById(
    "resultStat"
  ).innerHTML = `<a href="#" class="btn btn-lg btn-outline-dark fs-6 resultMessages"
              >Showing only first <span class="bigNum">30</span> books out of
              <span class="bigNum">${result.numFound}</span> total results
              <i class="bi bi-arrow-right-square fs-5 ms-2"></i
            ></a>`;
  console.log(result.numFound);
};

/* ----------------------------- Display Errors ----------------------------- */

const displayError = (errorType) => {
  const errorDiv = document.getElementById("error");

  if (errorType === "empty") {
    errorDiv.classList.remove("d-none");
    console.log("Search Field Cannot be empty! Pls provide a name");
  } else if (errorType === "timeout") {
    document.getElementById("errortwo").classList.remove("d-none");
    console.log("Sorry taking too long to respond");
  } else if (errorType === "noresult") {
    document.getElementById(
      "resultStat"
    ).innerHTML = `  <a href="#" class="btn btn-lg btn-outline-dark fs-6 btn-danger"
              ><i class="bi bi-x-circle fs-5 ms-2"></i
            > Sorry! No Result Found. Check Your Spell and try again! </a>`;
  }
};
