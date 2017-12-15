var commitCache = {};
var treeCache = {};

var currentCommits;
var currentCommit = 0;

function handleCommitHistory(historyUrl){
    
    statusLoading('Loading commit history...');
    

    retrieveCommitHistory(
        
        historyUrl,

        (result) => {

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

        displayTree(c.treeUrl);

    }


}

function displayTree(url){

    statusLoading("Loading tree...");

    retrieveTree(
      
        url,
        
        (tree) => {

            console.log(tree);

            // Make sure the user is still looking at the page for the tree that just loaded
            if(tree.url === currentCommits[currentCommit].treeUrl){
                drawTree(tree);
            }


            statusHide();
        },

        (error) => {
            statusLoaded("Failed to load tree :(");
        }
    
    );

}

function drawTree(data){

    var startOfProcessing = new Date().getTime();

    // By default the tree extends downwards, so all of the x and y coordinates must be flipped
    // for it to be drawn left to right.
    h = data.maxWidth * 40;
    
    $("#mainContent").empty();

    $("#mainContent").attr("style", "height:" + h);

    // Create the canvas
    var canvas = d3.select("#mainContent").append("svg")
        .attr("width", 750)
        .attr("height", h + 100)
        .append("g")
        .attr("transform", "translate(50, 50)");
    
    // Create the tree layout
    var tree = d3.layout.tree()
        .size([h,650]);
        
    // Create node and links points
    var nodeData = tree.nodes(data);
    var linkData = tree.links(nodeData);

    // Draw all the links
    canvas.selectAll(".link")
        .data(linkData)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#BBB")
        .attr("d", d3.svg.diagonal().projection((d) => { return [d.y, d.x]; }));

    // Create groups that will hold the node circles and labels on the canvas
    var nodes = canvas.selectAll(".node")
        .data(nodeData)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (p) => { return "translate(" + p.y + "," + p.x + ")" } )
        .on("mouseover", function(d) {
            var g = d3.select(this);

            $("#tooltipHolder").removeClass("invisible");

            $("#tooltipHolder > h3").text(d.name + "'s items");

            var s = "";
            for(var i = 0; i < d.blobs.length; i++) s += "<br>" + d.blobs[i];

            $("#tooltipHolder > P").html(s);

            var info = g.append('text')
               .classed('info', true)
               .attr('x', 20)
               .attr('y', 10)
               .text(d.blobs.length + ' items');
        })
        .on("mouseout", function() {

            // Remove the info text on mouse out.
            d3.select(this).select('text.info').remove();
            $("#tooltipHolder").addClass("invisible");
        });

    // Add circles to each node group
    nodes.append("circle")
        .attr("r", 5)
        .attr("fill", "#89D0A7");
    
    // Add a label to each node group
    nodes.append("text")
        .text((p) => { return p.name; })
        .style("text-anchor", "end")
        .style("alignment-baseline", "middle")
        .style("font-size", "10px")
        .attr("transform", "translate(-5.5, 0)");
        
    
    // Output stats
    var duration = (new Date().getTime()) - startOfProcessing;
    $("#processedIn").html('Data processing took ' + gs(data.processingTime + 'ms'));
    $("#displayedIn").html('Data displaying took '  + gs(duration + 'ms'));
    $("#structure").html('The folder structure has ' + gs(data.items) + ' items<br> with ' + gs(data.maxWidth) + ' folders at its widest level');
}

function left(){
    displayCommit(currentCommit+1);
}

function right(){
    displayCommit(currentCommit-1);
}

function gs(s){
    return '<span class="greenSpan">' + s + '</span>';
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

                        treeUrl: a.commit.tree.url + "?recursive=1",

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

/** Checks cache, if tree is in the cache, runs onSuccess for it, else attempts to download, process and cache it. */
function retrieveTree(url, onSuccess, onFail){

    var t = treeCache[url];

    if(t != null) onSuccess(t);
    else authorisedAccess(url, (result) => {


        var startOfProcessing = new Date().getTime();

        var p = {
            url: url,
            items: result.tree.length,
            name: "Root",
            children: [],
            blobs: []
        };

        for(var i = 0; i < result.tree.length; i++){
            var unflattened = result.tree[i];
            unflatten(unflattened, p);
        }

        p.maxWidth = getMaxTreeWidth(p);
        p.processingTime = (new Date().getTime()) - startOfProcessing;

        onSuccess(p);


    }, onFail);

}


function unflatten(from, to, isTree){
    var s = from.path;
    var current = to;
    while(s !== ""){

        var dot = s.indexOf(".");
        if(dot === 0) return; // Do not display hidden files.

        var pre, post;
        var i = s.indexOf("/");
        
        if(i !== -1){
            pre = s.slice(0, i);
            post = s.slice(i+1);
        } else {
            pre = s;
            post = "";
        }

        if(!isTree && post === ""){

            current.blobs.push(pre);

        } else {

            var child = getChild(current.children, pre);
            
                if(child === null){
                    child = {
                        name: pre,
                        children: [],
                        blobs: []
                    }
                    current.children.push(child);
            } 

        }

        

        current = child;
        s = post;
    }
}

function getChild(childArray, childName){
    var l = childArray.length;
    for(var i = 0; i < l; i++){
        if(childArray[i].name === childName) return childArray[i];
    }
    return null;
}


function getMaxTreeWidth(tree){

    widths = {};

    computeWidths(tree, widths, 0);

    var max = 0;
    var i = 0;
    var c;

    while((c=widths[i]) != null){
        if(widths[i] > max) max = widths[i];
        i++;
    }

    return max;

}

function computeWidths(tree, widths, level){

    if(widths[level] == null) widths[level] = 1;
    else widths[level] = widths[level] + 1;

    for(var i = 0; i < tree.children.length; i++){
        computeWidths(tree.children[i], widths, level+1);
    }


}

