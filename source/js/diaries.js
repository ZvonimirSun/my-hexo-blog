function showDetail(e) {
  let tmp = document.getElementsByClassName("diary");
  for (const dom of tmp) {
    dom.classList.add("show");
  }
  e.classList.remove("show");
}
