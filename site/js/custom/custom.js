setTimeout(function () {
    window.scrollTo(0, 1);
}, 2000);

var l;

$("#rate").click(function() {
    $("#rate-modal").modal();
    $("#menuLink").click();
});

$("#impressum").click(function() {
    $("#impressum-modal").modal();
    $("#menuLink").click();
});

$("#about").click(function() {
    $("#about-modal").modal();
    $("#menuLink").click();
});

$(".box").click(function() {
    $(".box").css("background-color", "white");
    $(this).css("background-color", "green");
    // isSelected = this.getAttribute("selected");
    // if (isSelected === "true") {
    //     this.setAttribute("selected", "false");
    //     $(this).css("background-color", "white");
    // } else {
    //     $(".box").css("background-color", "white");
    //     this.setAttribute("selected", "true");
    //     $(this).css("background-color", "green");
    // }
});

$("#submit-button").click(function() {
    $(".box").css("background-color", "white");
});

$("#create-data").click(function() {
    addMarker();
});

/**
 * Basic data structure functions
 */

Array.prototype.in_array = function (value) {
    return (this.indexOf(value) !== -1);
};

Array.prototype.push_unique = function (value) {
  if (!this.in_array(value)) {
    this.push(value);
  }
};