let tmp = document.getElementsByClassName("diary-content");
for (const dom of tmp) {
  dom.addEventListener(
    "click",
    function (e) {
      if (e && e.target && e.target.classList.contains("diary-content")) {
        let d = e.target;
        if (d.classList.contains("show")) {
          d.classList.remove("show");
        } else {
          d.classList.add("show");
        }
      }
    },
    false
  );
}
