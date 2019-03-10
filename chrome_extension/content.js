'use strict'; 

// parse the url 
function parseTabInfo(tab) { 
    let parts = tab.url.split("/"); 
    let issueNumber = parts.pop(); 
    parts.pop(); 
    let repo = parts.pop(); 
    let user = parts.pop(); 

    // this could be done via a call to github api 
    let tparts = tab.title.split("·");
    let title = tparts[0].trim();
    return { issueNumber, repo, user, title }; 
}

function parseGitHubUrl(url) {
    //https://github.com/USER/REPO_NAME/tree/master|authToken
    let authToken = null;
    let idx = url.indexOf("|");
    if (idx != -1) {
        authToken = url.substring(idx + 1);
        url = url.substring(0, idx);
    }

    let parts = url.split("/"); 
    let branch = parts.pop();
    parts.pop(); // tree
    let repo = parts.pop();
    let user = parts.pop();
    return { user, repo, branch, authToken };
}

function getOptions(defOpts) {
    return new Promise(function(resolve) {
        chrome.storage.sync.get(
            defOpts,
            function(items) {
                resolve(items);
            }
        );
    });
}

async function createBranchName(tabInfo, issuePrefix) {
    // 
    let title = tabInfo.title.replace(/\s+/g, "_");
    let bn =issuePrefix + "-" + tabInfo.issueNumber + "-" + title;
    return bn;
}

// A generic onclick callback function.
async function genericOnClick(info, tab) {
    //console.log("ITEM " + info.menuItemId + " was clicked");
    //console.log("info: " + JSON.stringify(info));
    //console.log("tab: " + JSON.stringify(tab));

    let ti = parseTabInfo(tab);
    console.log("tabInfo:",ti);

    let opts = await getOptions({issuePrefix:ti.user, repoUrls:''});
    let bn = await createBranchName(ti, opts.issuePrefix);
    console.log("bn:",bn);


    let sourceBranch = "master"
    let urlAuthToken = null;
    opts.repoUrls.split("\n").every((url) =>{
        // expect something like...
        //https://github.com/USER/REPO_NAME/tree/master
        let { user, repo, branch, authToken } = parseGitHubUrl(url);
        if (user === ti.user && repo === ti.repo ) {
            //console.log("Found Ref Url [%s], branch [%s]", url, branch);
            sourceBranch = branch;
            urlAuthToken = authToken;
        }
    });

    // prompt to check 
    let branchName = prompt(`Create branch for issue [${ti.issueNumber}] from [${sourceBranch}]?`, bn);


    if (branchName != null) {
        // get source sha
        let srcInfo = await querySourceRef(ti.user, ti.repo, urlAuthToken, sourceBranch);
        console.log("srcInfo=",srcInfo);
        let sha = srcInfo.object.sha;
        //console.log("sha=[%s], urlAuthToken=[%s]", sha, urlAuthToken);

        // send branch create POST request
        let res = await createBranch(branchName, ti.user, ti.repo, sha, urlAuthToken);
        if (res != null) {
            // got a response...check validity
            if (res.status === 201) {
                // success, nav to branch
                let body = await res.json();
                console.log("body=", body);
                let branchUrl = "https://github.com/" + ti.user + "/" + ti.repo + "/tree/" + branchName;
                chrome.tabs.update( { url: branchUrl } ); 
            } else {
                // doh!
                alert(
                    "Failed to create branch: " + branchName + 
                    ". status=" + res.status + ", statusText=" + res.statusText 
                );
            }
        } else {
            // doh!
            alert("Failed to create branch: " + branchName);
        }
    }    
}

async function querySourceRef(user, repo, authToken, sourceBranch="master"){
    let sourceRef = "https://api.github.com/repos/" + user + "/" + repo + "/git/refs/heads/" + sourceBranch;
    return await fetch(
        sourceRef, 
        {  
            method: "GET",
            headers: {
                Authorization: "token " + authToken
            }
        }).then((resp) => resp.json());
}

async function createBranch(branchName, user, repo, sha, authToken){
    //console.log("branchName=%s, sha=%s, authToken=%s", branchName, sha, authToken);
    let createRefUrl = "https://api.github.com/repos/" + user + "/" + repo + "/git/refs";
    let postData = {
        method: "POST",
        headers : {
            Authorization: "token " + authToken
        },
        body: JSON.stringify(
            {
                "ref" : "refs/heads/" + branchName,
                "sha" : sha
            }
        )
    };

    //console.log("createRefUrl:",createRefUrl);
    //console.log("postData:",postData);
    return await fetch(createRefUrl, postData)
        .then((res) => {
            console.log("res=", res);
            return res;
        })
        .catch((err) => {
            console.log("err=", err);
            return null;
        });
    //return "https://www.buzzfeed.com/chelseamarshall/wtf-cats";
}

var menuId = chrome.contextMenus.create({
    "title": "Create Branch from Issue", 
    "contexts":["page"],
    "documentUrlPatterns":[ "https://github.com/*/*/issues/*" ],
    "onclick": genericOnClick
});

// https://stackoverflow.com/questions/33736233/how-to-show-a-modal-popup-from-the-context-menu/33753524
  

  
