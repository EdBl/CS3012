# Task 6 - Repo visualisation using D3.js
Using the GitHub API to build a visualisation of the available data in order to elucidate some aspect of the softare engineering process.


## General info
- Open `index.html` using your browser to run.
- Please use a modern browser version. <sub>(I tested it on a recent version of Chrome and a 2 year old version of Firefox and it works as expected. It didn't work on as expected on Internet Explorer 11 though.)</sub>
- As you most likely know, Github API access is limited to anonymous users. In order to be able to use all of the API features, Github requires for the user to be authenticated. For that reason you must log
  in order to use this app.

## How to use
1. Log in.
1. On the left sidebar you will see two options:
    1. Your repos
    1. Other repos
1. "Your repos" displays all your repos, including private repos.
1. "Other repos" displays my repos by default. You are free to type any username into the search bar and press go in order to see their repos.
1. By clicking on a repo, the main view will change to display the current file structure of the selected repo.
1. Use the on screen arrows or the left and right keys on the keyboard to cycle through the repo's commit history and see how the file structure looked at that point in time.
1. Hover over a folder name to see its contents.
1. To view another repo, select an available one from the side bar or type in a different username into the search bar and press "GO".

## What happens when...
Quick, high level explanations of what happens behind the scenes after the user performs an action.

### On log in
1. User logs in
1. The user's account data is downloaded
    1. Using links from the account data, a list of the user's private and public repos are downloaded and displayed
    1. The first repo is selected by default (see "On repo selected in the side bar")
1. My (EdBl) account data is downloaded
    1. Using links from that data, a list of my public repos is downloaded and displayed
	1. (This works in the same way as "On search for another username")

### On search for another username
1. The user enters the username whose repos they would like to view and presses "GO". Let's say the user entered EdBl for the purpose of simplifying the discussion to follow.
1. EdBl's account data is downloaded.
1. Using that data, a link to all of EdBl's public repos is used to download data on all of EdBl's public repos.
1. On the sidebar, using the repo data, the user is presented with a list of EdBl's repos that the user may click on to view more info on.

### On repo selected in the side bar
1. The user clicks on a repo name in the side bar.
1. Data on that repo is retrieved from cache or downloaded.
1. That data is used to find a link to that repo's commit history (Github provides access to the 30 latest commits).
1. That repo's commit history is retrieved from cache or dowloaded.
1. The latest commit is chosen to be displayed for the user.
1. "On commit selected" is run.

### "On commit selected" or "On navigating through commit history"
1. The user decides to view a commit from the repo, let's say commit 12 of 15 for the purpose of simplifying the discussion to follow.
1. That commit's folder/file tree is retrieved from cache or downloaded from github.
    1. If the tree is dowloaded, the tree is processed in order to make it D3 friendly and to drop data that is not required for the purposed of this application.
    1. The processed tree is cached.
1. D3 is used to display that tree.




