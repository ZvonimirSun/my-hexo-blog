function showDetail(e) {
  let d = e.target;
  if (d.classList.contains("show")) {
    d.classList.remove("show");
  } else {
    d.classList.add("show");
  }
}
