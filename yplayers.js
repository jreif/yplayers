$(document).ready(function() {
  var ratings_url = "http://yankee.org/images/uploads/download_forms/ratings.csv";
  var ratings5_url = "http://yankee.org/images/uploads/download_forms/5_year.csv";
  var ratings;
  var ratings5;
  $.when(
    $.get(ratings_url, function(data){ratings = $.csv.toArrays(data);}),
    $.get(ratings5_url, function(data){ratings5 = $.csv.toArrays(data);})
  ).then(function() {
    var current_ids = ratings.map(function(x) {return x[6].slice(0,-4);});
    var currents = ratings.map(function(x) {return [x[0], x[1], x[2], x[3], "Yes"];});
    var lapsed = ratings5.filter(function(x) {return $.inArray(x[6].slice(0,-4), current_ids) == -1}).map(function(x) {return [x[0], x[1], x[2], x[3], "No"]});
    var players = currents.concat(lapsed);
    var dt = $("table#players").DataTable({
      "data": players,
      "searching": true,
      "paging": true,
      "pageLength": 20,
      "drawCallback": genderColors,
      "lengthMenu": [[10, 20, 50, 100], [10, 20, 50, 100]]
    });
    var ratingVals = [...new Set(players.map(function(x) {return x[3];}))].sort();
    ratingVals.forEach(function(x) {$("select#ratings").append($("<option></option>").attr("value",x).text(x));});
    $("input#last").on("input", function() {dt.column(0).search(this.value).draw();});
    $("input#first").on("input", function() {dt.column(1).search(this.value).draw();});
    $("select#gender").on("change", function() {dt.column(2).search(searchVal(this.value), true, false).draw();});
    $("select#ratings").on("change", function() {dt.column(3).search(searchVal(this.value), true, false).draw();});
    $("select#current").on("change", function() {dt.column(4).search(searchVal(this.value), true, false).draw();});
  });
});

function genderColors() {
  $("tr").each(function() {
    $(this).find("td:eq(3)").html("<span class='badge badge-pill badge-primary'>" + $(this).find("td:eq(3)").text() + "</span>");
    if ($(this).find("td:eq(2)").text() == "Female") {$(this).find("td:eq(2)").html("<span class='badge badge-pill badge-female'>&female;</span>")}
    else if ($(this).find("td:eq(2)").text() == "Male") {$(this).find("td:eq(2)").html("<span class='badge badge-pill badge-male'>&male;</span>")}
    if ($(this).find("td:eq(4)").text() == "Yes") {$(this).find("td:eq(4)").html("<span class='badge badge-pill badge-success'>Yes</span>")}
    else if ($(this).find("td:eq(4)").text() == "No") {$(this).find("td:eq(4)").html("<span class='badge badge-pill badge-secondary'>No</span>")}
  });
}

function searchVal(value) {
  return value.length == 0 ? "" : "(^" + value.replace("+", "\\+").replace("?", "\\?") + "$)";
}
