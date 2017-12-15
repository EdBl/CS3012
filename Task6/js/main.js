$(function(){
    var username = $('#otherUsername').val("EdBl");
});

var username, password;
var repoCache = {};


function logIn(){

    username = $('#username').val();
    password = $('#password').val();

    statusLoading('Logging you in...')

    authorisedAccess(
        
        "https://api.github.com/user", 

        (result) => {

            $('.loginHolder').addClass('shrunk');
            $('#content').removeClass('invisible');

            $("#profileImage").attr("src", result.avatar_url);
            $("#profileName").text(result.login);

            loadMyReposList();

        },

        (error) => {
            if(error.status == 401) statusLoaded('Please double check if the username and password is entered correctly');
            else statusLoaded('Failed to log you in');
        }
    );

}

function loadMyReposList(){
    
    statusLoading('Loading your repos...');

    var url = "https://api.github.com/user/repos";

    var cached = repoCache[url];
    
    if(cached != null){
        console.log('Cache hit!');
        onSuccess(cached);
    } else authorisedAccess(

        url,

        (result) => {

            extractRepos(result, "#myRepos", "Looks like you don't have any repos");
            if(result.length != 0) selectedRepo(result[0].url);

            loadOtherReposList("EdBl");


        },

        (error) => {
            statusLoaded("Failed to load your repos :(");
        }
    );
}

function loadOtherReposList(username){

    statusLoading("Loading " + username + "'s repos...");

    var url = "https://api.github.com/users/" + username + "/repos"

    var cached = repoCache[url];

    if(cached != null){
        console.log('Cache hit!');
        onSuccess(cached);
    } else authorisedAccess(
            
        url,

        (result) => {
            statusHide();
            clearOtherRepos();
            extractRepos(result, "#otherRepos", "Looks like " + username + " doesn't have any public repos");
        },

        (error) => {
            clearOtherRepos();

            var t = "The user " + username + " doesn't exist";
            if(error.status != 404) t = "Failed to load " + username + "'s repos :(";

            setOtherReposMessage(t);
            statusLoaded(t);
        }
    );

}

function extractRepos(result, addTo, messageIfEmpty){

    var l = result.length;
    
    if(l == 0){
        $(addTo).append("<p>" + messageIfEmpty + "</p>");
    } else {
        for(i = 0; i < l; i++){
            addRepoTo(addTo, result[i].name, result[i].url);
            repoCache[result[i].url] = result[i];
        }
    }

}

function search(){

    var username = $('#otherUsername').val();

    clearOtherRepos();
    setOtherReposMessage("Loading " + username + "'s repos...");

    loadOtherReposList(username);

}

function clearOtherRepos(){
    $("#otherRepos > a").remove();
    $("#otherRepos p").remove();
}

function setOtherReposMessage(message){
    $("#otherRepos").append("<p>" + message + "</p>");
}

function authorisedAccess(url, onSuccess, onFail){

    var auth = btoa(username + ":" + password);
    
    $.ajax({

        headers: {'Authorization' : 'Basic ' + auth},
        url: url, 
        success: onSuccess,
        error: onFail

    })

}

function addRepoTo(divName, repoName, repoLink){

    $(divName).append('<a href="javascript:selectedRepo(\'' + repoLink + '\')" class="repoClicker">' + repoName + '</a>');

}

function selectedRepo(url){

    statusLoading("Loading repo...");

    $('a.repoClicker').removeClass("selected"); // Remove all old selections.
    $('a.repoClicker[href="javascript:selectedRepo(\'' + url + '\')"]').addClass("selected"); // Set the link with this url as the selection.

    authorisedAccess(
        url,

        (result) => {

            // $('#mainHolder').empty();
            // $('#mainHolder').append("<pre>" + JSON.stringify(result, null, "     ") + "</pre>");
            
            handleCommitHistory(result.commits_url.replace("{/sha}", ""));

        },

        (error) => {
            statusLoaded("Failed to load repo :(");
        }
    )
}



$(document).keydown(function(e) {
    if(e.which == 37) left();
    if(e.which == 39) right();
    //e.preventDefault(); // prevent the default action (scroll / move caret)
});

