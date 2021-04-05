$(document).on("click", ".diary-content", function (e) {
  if (e.hasClass("show")) {
    e.removeClass("show");
  } else {
    e.addClass("show");
  }
});
