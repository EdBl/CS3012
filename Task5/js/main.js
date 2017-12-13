$(function(){
    // On Documnent Ready
});

var username, password;


function logIn(){
    
    username = $('#username').val();
    password = $('#password').val();


    statusLoading('Logging you in...')

    authorisedAccess(
        
        "https://api.github.com/users/EdBl", 

        (result) => {
            statusLoaded('Welcome ' + result.login);
            console.log(result);
        },

        (error) => {
            if(error.status == 401) statusLoaded('Please double check if the username and password is entered correctly');
            else statusLoaded('Failed to log you in');
        }
    );

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

