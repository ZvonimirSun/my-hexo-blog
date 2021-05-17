function showDetail(e) {
  if (e.classList.contains("show")) {
    let tmp = document.getElementsByClassName("diary");
    for (const dom of tmp) {
      dom.classList.add("show");
    }
    e.classList.remove("show");
  } else {
    e.classList.add("show");
  }
}
