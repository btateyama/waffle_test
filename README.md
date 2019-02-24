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