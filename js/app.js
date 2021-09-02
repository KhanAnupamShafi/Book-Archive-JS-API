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
  const bookContainer = document.getElementById("book-container");
  bookContainer.textContent = "";
  document.getElementById(
    "resultStat"
  ).innerHTML = `<a href="#" class="btn btn-lg btn-outline-dark fs-6 resultMessages"
              >Displaying first <span class="bigNum">30</span> books for your query of <span class="bigNum">"${result.q}"</span> out of
              <span class="bigNum">${result.numFound}</span> total results
              <i class="bi bi-arrow-right-square fs-5 ms-2"></i
            ></a>`;

  //  Retrieve each book
  const arrayOfbooks = result.docs;
  const bookReciever = (recievedBooks) => {
    const recieved = recievedBooks.slice(0, 30);
    console.log("total books in book recieve", recieved);
    recieved.forEach((book) => {
      const bookCard = document.createElement("div");

      /* ------------------------- Getting book  cover url ------------------------ */

      const getCover = (cover) => {
        console.log(cover);
        if (cover) {
          return `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
        } else {
          return "../images/554106-M";
        }
      };

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
                    class="ms-2 fw-bolder badge bg-white text-black text-wrap"
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
                <h5 class="card-header rounded text-end">
                  <strong class="me-2 fw-light fs-4 "> - by </strong
                  ><span class="fst-italic fw-bold authorStyle">
                    ${
                      book.author_name
                        ? book.author_name[0]
                        : "No Author data exists"
                    }</span
                  >
                </h5>
                <p class="card-header fs-5 text-left">
                  <small class="me-3">First Publish Year:</small>
                  <span class="textColor text-wrap">${
                    book.first_publish_year
                  }</span>
                </p>

                <p class="card-header text-dark fs-5 text-left">
                  <small class="p-1 rounded">Publisher:</small>
                  <span class="ms-2 fw-bolder badge bg-primary text-wrap"
                    >${book.publisher ? book.publisher[0] : "N/A"}</span
                  >
                </p>
              </div>
            </div>
          `;

      bookContainer.appendChild(bookCard);
    });
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

    return bookReciever(mybookArray);
  } else bookReciever(arrayOfbooks);
  // Retrieve each book and display in a card

  //   arrayOfbooks.forEach((book) => {
  //     const bookCard = document.createElement("div");

  //     bookCard.classList.add("col-lg-4", "col-md-6", "my-2");
  //     bookCard.innerHTML = `
  //             <div
  //               class="
  //                 card
  //                 w-75
  //                 rounded
  //                 mx-auto
  //                 border border-warning
  //                 hover-shadow
  //                 mt-5
  //               "
  //             >
  //               <div
  //                 style="height: 328px"
  //                 class="text-center rounded bg-image hover-overlay ripple w-100"
  //                 data-mdb-ripple-color="light"
  //               >
  //                 <img
  //                   src="./images/554106-M.jpg"
  //                   class="img-fluid shadow-2-strong w-100 h-100"
  //                 />
  //                 <a href="#!">
  //                   <div
  //                     class="mask"
  //                     style="background-color: rgba(251, 251, 251, 0.15)"
  //                   ></div>
  //                 </a>
  //               </div>
  //               <div class="text-center">
  //                 <p class="card-header fs-5">
  //                   <span
  //                     class="ms-2 fw-bolder badge bg-white text-black text-wrap"
  //                     >Bibliographic information :</span
  //                   >
  //                 </p>
  //               </div>
  //               <div class="bg-white px-2 text-center text-capitalize">
  //                 <h4 class="bg-warning rounded p-2 text-dark">
  //                   <strong> Javascript a beginner approach easy made</strong>
  //                 </h4>
  //               </div>
  //               <div class="card-body text-capitalize p-0">
  //                 <h5 class="card-header rounded text-end">
  //                   <strong class="me-2 fw-light fs-4 "> - by </strong
  //                   ><span class="fst-italic fw-bold authorStyle">
  //                     D.f. Franklin jr..</span
  //                   >
  //                 </h5>
  //                 <p class="card-header fs-5 text-left">
  //                   <small class="me-3">First Publish Year:</small>
  //                   <span class="textColor text-wrap">2019</span>
  //                 </p>

  //                 <p class="card-header text-dark fs-5 text-left">
  //                   <small class="p-1 rounded">Publisher:</small>
  //                   <span class="ms-2 fw-bolder badge bg-primary text-wrap"
  //                     >sheba prokahoni</span
  //                   >
  //                 </p>
  //               </div>
  //             </div>
  //           `;

  //     bookContainer.appendChild(bookCard);
  //   });
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
