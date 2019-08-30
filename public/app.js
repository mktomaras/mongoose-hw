$("#scrapeBtn").on("click", function(){
    $.get("/scrape").then(function(data){
        getArticles();
    })

})

$("#clearBtn").on("click", function(){
    $(".card").remove();
});

function getArticles() {
    $.getJSON("/articles", function(data){
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<div class='card'><div class='card-body' data-id='" + data[i]._id + "'><h4><a target='_blank' href='" + data[i].link + "'>" + data[i].title + "'</a></h4><button type='button' class='btn btn-success btn-sm' data-toggle='modal' data-target='#noteModal' id='noteBtn'>Add Note</button></div></div>");
        }
    });
}

// $(document).on("click", "#noteBtn", function() {
//     $("#notes").empty();
//     var thisId = $(this).attr("data-id");
  
//     $.ajax({
//       method: "GET",
//       url: "/articles/" + thisId
//     })
//       .then(function(data) {
//         console.log(data);
//         $("#notes").append("<h2>" + data.title + "</h2>");
//         $("#notes").append("<input id='titleinput' name='title' >");
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
//         if (data.note) {
//           $("#titleinput").val(data.note.title);
//           $("#bodyinput").val(data.note.body);
//         }
//       });
//   });
  
//   $(document).on("click", "#savenote", function() {
    
//     var thisId = $(this).attr("data-id");
  
//     $.ajax({
//       method: "POST",
//       url: "/articles/" + thisId,
//       data: {
//         title: $("#titleinput").val(),
//         body: $("#bodyinput").val()
//       }
//     })
//       .then(function(data) {
//         console.log(data);
//         $("#notes").empty();
//       });
  
//     $("#titleinput").val("");
//     $("#bodyinput").val("");
//   });
  


