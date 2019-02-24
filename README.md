# waffle_test
test project to try out with waffle.io

testing commit


## Clean up git remote merged branches

https://stackoverflow.com/questions/6127328/how-can-i-delete-all-git-branches-which-have-been-merged


Seems to clean up the old branches
```
$ git branch -r --merged | egrep -v "(^\*|master)" | sed 's/origin\///' | xargs -n 1 git push --delete origin
To https://github.com/btateyama/waffle_test.git
 - [deleted]         4-issue-from-cli
To https://github.com/btateyama/waffle_test.git
 - [deleted]         bt#1-testbranch
To https://github.com/btateyama/waffle_test.git
 - [deleted]         bt#2-testbrach
To https://github.com/btateyama/waffle_test.git
 - [deleted]         bt#3-abc
```


## Adding extra fields (like rice scores) 

https://github.com/boblauer/GitHubPlus
- allows for embedding extra data in git comment
- installs as git 
- REALLY old...doesn't build anymore
    - browserify version is way behind and upgrading to the latest didn't work

Alternatively, maybe just put it in the issue body and parse it out using ghi, if needed?


## creating pull request from issue?
- GreaseMonkey?


## Automatically move Done to Deployed
https://help.waffle.io/tracking-deployed-work/automatically-track-when-work-is-deployed


## templates look interesting
https://help.github.com/en/articles/about-issue-and-pull-request-templates
- pull request template with 'closes # .' 

## git issue for create branch from issue
https://stackoverflow.com/questions/41614421/create-new-branch-from-the-issue


## Promising methods to enhance github webgui
https://github.com/sindresorhus/refined-github 
https://github.com/Mottie/GitHub-userscripts