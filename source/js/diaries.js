document.getElementsByClassName("diary-content").addEventListener(
  "click",
  function (e) {
    if (e.classList.includes("show")) {
      e.classList.remove("show");
    } else {
      e.classList.add("show");
    }
  },
  false
);
