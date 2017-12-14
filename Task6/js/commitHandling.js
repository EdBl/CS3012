var commitCache = {};
var treeCache = {};

var currentCommits;
var currentCommit = 0;

function handleCommitHistory(historyUrl){
    
    statusLoading('Loading commit history...');

    retrieveCommitHistory(
        
        historyUrl,

        (result) => {

            console.log(result);

            var l = result.length;

            if(l == 0) statusLoaded("This repo doesn't seem to have any commits");
            else {
                currentCommits = result;
                displayCommit(0);
                statusHide();
            }

        },

        (error) => {
            statusLoaded('Failed to load commit history :(');
        }

    );
    

}


function displayCommit(number){

    currentCommit = number;

    if(currentCommits != null){

        var l = currentCommits.length;

        if(currentCommit < 0) currentCommit = 0;
        if(currentCommit >= l) currentCommit = l - 1;

        var c = currentCommits[currentCommit];

        $("#devName").text(c.committer);
        $("#commitMessage").html(c.message);
        
        $("#commitHour").text(c.time);
        $("#commitDate").text(c.date);

        $("#pageNumber").text((l-currentCommit) + " of " + l);

    }


}

function left(){
    displayCommit(currentCommit+1);
}

function right(){
    displayCommit(currentCommit-1);
}

















/** Checks cache, if commit history is in the cache, runs onSuccess for it, else attempts to download it, processes and caches it. */
function retrieveCommitHistory(url, onSuccess, onFail){
    
    var h = commitCache[url];
    
    if(h != null) onSuccess(h);
    else authorisedAccess(
        
        url, 
        
        (result) => {

            // Process and cache
            try{

                statusLoading('Processing commit history...');

                var l = result.length;
                var commits = { length: l };

                for(i = 0; i < l; i++){

                    var a = result[i];

                    var options = {  
                        weekday: "short", year: "numeric", month: "short", day: "numeric"  
                    };  

                    var d = new Date(a.commit.committer.date);
                    var time = d.toTimeString().substr(0, 5);
                    var date = d.toLocaleDateString("en-UK", options);

                    var c = {

                        treeUrl: a.commit.tree.url,

                        committer: a.committer.login,
                        message: a.commit.message,

                        timestamp: a.commit.committer.date,
                        time: time,
                        date: date,

                        index: i

                    }

                    commits[i] = c;

                }

                // Cache result and return it.
                commitCache[url] = commits;
                onSuccess(commits);

        } catch (e) {
            statusLoaded("Failed to process this repo :(");
        }


        }, 

        onFail

    );

}

/** Checks cache, if tree is in the cache, runs onSuccess for it, else attempts to download it. */
function retrieveTree(url, onSuccess, onFail){

    var t = treeCache[url];

    if(t != null) onSuccess(t);
    else authorisedAccess(url, onSuccess, onFail);

}

