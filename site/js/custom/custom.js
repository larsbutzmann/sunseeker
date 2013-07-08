setTimeout(function () {
    window.scrollTo(0, 1);
}, 1000);

$("#rate").click(function() {
    $("#myModal").modal();
});

$(".box").click(function() {
    isSelected = this.getAttribute("selected");
    if (isSelected === "true") {
        this.setAttribute("selected", "false");
        $(this).css("background-color", "white");
    } else {
        this.setAttribute("selected", "true");
        $(this).css("background-color", "green");
    }
});

$(".modal-footer").click(function() {
    $(".collapse").collapse("hide");
});

$("#create-data").click(function() {
    addMarker();
});

// $("#slider").slider({
//   min: 0,
//   max: 10,
//   step: 1,
//   orientation: "horizontal",
//   value: 5
// });