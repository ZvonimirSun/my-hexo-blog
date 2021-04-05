let tmp = document.getElementsByClassName("diary");
for (const dom of tmp) {
  dom.addEventListener("click", function (e) {
    if (e && e.target && e.target.classList.contains("diary")) {
      let d = e.target;
      if (d.classList.contains("show")) {
        d.classList.remove("show");
      } else {
        d.classList.add("show");
      }
    } else {
      e.stopPropagation();
    }
  });
}
