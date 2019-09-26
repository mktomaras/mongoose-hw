$(document).ready( function() {

    getArticles();

    $("#scrapeBtn").on("click", function(){
        $.get("/scrape").then(function(data){
            getArticles();
        })
    })

    $(document).on("click", "#noteBtn", function() {
        console.log("noteBtn clicked");
        var articleId = $(this).attr("data-id");

        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        })
        .then(function(data) {
            console.log(data);
            $(".modal-title").text("Note for " + data.title);
            $("#noteSubmit").attr("data-id", data._id);

            if (data.note) {
                $("#insertTitle").val(data.note.title);
                $("#insertNote").val(data.note.body);
            }
        })
    })

    $(document).on("click", "#noteSubmit", function() {
        var articleId = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                title: $("#insertTitle").val(),
                body: $("#insertNote").val(),
                articleId: articleId
            }
        })
        .then(function(data) {
            console.log(data.note);
        })
    })

    $(document).on("click", "#viewBtn", function() {
        var articleID = $(this).attr("data-id");
        $("#listNotes").empty();

        $.ajax({
            method: "GET",
            url: "/notes/" + articleID
        })
        .then(function(data) {
            console.log(data);
                for (var i=0; i < data.length; i++) {
                    if (data[i].articleId === articleID) {
                        $("#listNotes").append("<div class='modal-body'><h6>" + data[i].title + "</h6><p>" + data[i].body + "</p><button class='btn btn-success btn-sm' id='delete' data-noteID='" + data[i]._id + "' data-artId='" + data[i].articleId + "'>Delete</button></div>")
                    }
                }
            }             
        )
    })

    $(document).on("click", "#delete", function() {
        console.log("testing");
        var noteId = $(this).attr("data-noteID");
        var articleId = $(this).attr("data-artId");

        $.ajax({
            method: "DELETE",
            url: "/delete/" + noteId
        })
        .then(function(res) {
            location.reload();

        })

    })

    function getArticles() {
        $("#articles").empty();

        $.getJSON("/articles", function(data){
            for (var i = 0; i < data.length; i++) {
                $("#articles").append("<div class='card'><div class='row no-gutters'><div class='col-sm-4'>" + data[i].image + "</div><div class='col-sm-8'><div class='card-body' data-id='" + data[i]._id + "'><h3><a target='_blank' href='" + data[i].link + "'>" + data[i].title + "</a></h3><h5>Written by " + data[i].author + " | " + data[i].articleDate + "</h5><button class='btn btn-success btn-sm' id='noteBtn' data-toggle='modal' data-target='#notesModal' data-id='" + data[i]._id + "'>Add Note</button><button class='btn btn-success btn-sm' id='viewBtn' data-toggle='modal' data-target='#savedNotesModal' data-id='" + data[i]._id + "'>View Notes</button></div></div></div><div id='noteSection' class='card' style='display: none;'><div class='card-header'>Notes for <strong>"+ data[i].title + "</strong></div><div class='card-body' data-id='" + data[i]._id + "'><div id='noteContents'></div><button class='btn btn-link' id='closeNotes'>Close Notes</button></div></div>");
            }
        });
    }

})

  


