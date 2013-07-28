setTimeout(function () {
    window.scrollTo(0, 1);
}, 2000);

var l;

$("#rate").click(function() {
    $("#myModal").modal();
    $("#menuLink").click();
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