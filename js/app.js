/* ----------------------------- Spinner toggle ----------------------------- */

const spinnerToggle = (setDisplay) => {
  document.getElementById("spinner").style.display = setDisplay;
};
document.getElementById("error").style.display = "none";
spinnerToggle("none");

const getInputValue = () => {
  spinnerToggle("block");
  // Selecting the input element and get its value
  const textArea = document.getElementById("myInput");
  const inputVal = textArea.value;

  // Clear input field
  document.getElementById("myInput").value = "";
  document.getElementById("error").style.display = "none";
  document.getElementById("errortwo").classList.add("d-none");
  document.getElementById("resultStat").textContent = "";
  document.getElementById("book-container").textContent = "";

  if (inputVal === "") {
    displayError("empty");
    return;
  }

  const url = `https://openlibrary.org/search.json?q=${inputVal}`;

  fetch(url)
    .then((response) => response.json())
    .then((books) => getAllbooks(books));

  return;
};

/* ------------------ Get all the books and check for error ----------------- */
const getAllbooks = (books) => {
  // console.log("status code", books);
  if (books.error) {
    displayError("timeout");
  } else if (books.numFound === 0) {
    displayError("noresult");
  } else if (books.numFound) {
    foundBooks(books);
  } else alert("Unknown Error Occured");
};

/* ------------------------- All found books process ------------------------ */

const foundBooks = (result) => {
  const bookContainer = document.getElementById("book-container");
  bookContainer.textContent = "";

  const arrayOfbooks = result.docs;

  //  Retrieve each book

  const bookReciever = (recievedBooks, bookInfo) => {
    const recieved = recievedBooks.slice(0, 30);
    console.log("total books  recieved", recieved);
    recieved.forEach((book) => {
      const bookCard = document.createElement("div");

      /* ------------------------- Getting book  cover url ------------------------ */

      const getCover = (cover) => {
        if (cover) {
          return `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
        } else {
          return "../images/554106-M";
        }
      };

      // show numbers of book found

      document.getElementById(
        "resultStat"
      ).innerHTML = `<a href="#" class="btn btn-lg btn-outline-dark fs-6 resultMessages"
              >Displaying first <span class="bigNum">${
                recievedBooks.length > 30 ? "30" : recievedBooks.length
              }</span> books for your query of <span class="bigNum">"${
        bookInfo.q
      }"</span> out of
              <span class="bigNum">${bookInfo.numFound}</span> total results
              <i class="bi bi-arrow-right-square fs-5 ms-2"></i
            ></a>`;

      /* ----------------------------  Adding books and display in a card  --------------------------- */
      bookCard.classList.add("col-lg-4", "col-md-6", "my-2");
      bookCard.innerHTML = ` 
            <div
              class="
                card
                w-75
                rounded
                mx-auto
                border border-warning
                hover-shadow
                mt-5
              "
            >
              <div
                style="height: 328px"
                class="text-center rounded bg-image hover-overlay ripple w-100"
                data-mdb-ripple-color="light"
              >
                <img
                  src="${getCover(book.cover_i)}"
                  class="img-fluid shadow-2-strong w-100 h-100"
                />
                <a href="#!">
                  <div
                    class="mask"
                    style="background-color: rgba(251, 251, 251, 0.15)"
                  ></div>
                </a>
              </div>
              <div class="text-center">
                <p class="card-header fs-5">
                  <span
                    class="ms-2 fw-bolder badge bg-white text-dark text-wrap"
                    >Bibliographic information :</span
                  >
                </p>
              </div>
              <div class="bg-white px-2 text-center text-capitalize">
                <h4 class="bg-warning rounded p-2 text-dark">
                  <strong> ${book.title}</strong>
                </h4>
              </div>
              <div class="card-body text-capitalize p-0">
                <h5 class="card-header rounded text-end text-wrap">
                 <span class="fst-italic px-2 fw-bold authorStyle"> - by 
                   <a href="#"> ${
                     book.author_name
                       ? book.author_name[0]
                       : "No Author data exists"
                   }</a></span
                  >
                </h5>
                <p class="card-header d-flex justify-content-center align-items-center fs-6 text-dark text-left">
                  <strong class="me-3">First Publish Year:</strong>
                  <span class="fw-bold fs-5 text-danger">${
                    book.first_publish_year
                  }</span>
                </p>

                <p class="card-header d-flex justify-content-center align-items-center text-dark fs-5 text-left">
                  <strong class="p-1 rounded">Publisher:</strong>
                  <span class="ms-2 fw-bolder badge bg-danger text-wrap"
                    >${book.publisher ? book.publisher[0] : "N/A"}</span
                  >
                </p>
              </div>
            </div>
          `;

      bookContainer.appendChild(bookCard);
    });
    spinnerToggle("none");
  };
  //   Checking and filtering valid books

  if (arrayOfbooks.length > 30) {
    const mybookArray = [];
    const filteredArray = arrayOfbooks.filter((e) => e.cover_i);
    mybookArray.push(...filteredArray.slice(0, 30));
    console.log("all book with cover found", mybookArray[21]);

    if (mybookArray.length < 30) {
      mybookArray.push(...arrayOfbooks.slice(0, 30));
    }

    return bookReciever(mybookArray, result);
  } else bookReciever(arrayOfbooks, result);
};

/* ----------------------------- Display Errors ----------------------------- */

const displayError = (errorType) => {
  const errorDiv = document.getElementById("error");

  if (errorType === "empty") {
    errorDiv.style.display = "block";
    spinnerToggle("none");
  } else if (errorType === "timeout") {
    document.getElementById("errortwo").classList.remove("d-none");
    console.log("Sorry taking too long to respond");
    spinnerToggle("none");
  } else if (errorType === "noresult") {
    document.getElementById("resultStat").innerHTML = `  <button
        type="button"
        class="btn btn-outline-danger  fs-5 bg-spinner"
        data-mdb-ripple-color="dark disabled"
      >
        <span><i class="bi bi-emoji-frown  rounded-circle fs-5 me-2"></i></span>
        Sorry! No Result Found. Check Your Spell and try again!
      </button>`;
    spinnerToggle("none");
  }
};
