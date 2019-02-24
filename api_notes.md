

Get master ref
```
$ curl https://api.github.com/repos/btateyama/waffle_test/git/refs/heads/master
{
  "ref": "refs/heads/master",
  "node_id": "MDM6UmVmMTcxOTQ4Njg0Om1hc3Rlcg==",
  "url": "https://api.github.com/repos/btateyama/waffle_test/git/refs/heads/master",
  "object": {
    "sha": "f07fe11c9a33efb9a487b5b05eab99245d6cc90a",
    "type": "commit",
    "url": "https://api.github.com/repos/btateyama/waffle_test/git/commits/f07fe11c9a33efb9a487b5b05eab99245d6cc90a"
  }
}
```


# Create a reference
https://developer.github.com/v3/git/refs/#create-a-reference

example POST
```
{
  "ref": "refs/heads/branch_from_curl",
  "sha": "f07fe11c9a33efb9a487b5b05eab99245d6cc90a"
}
```

curl post
```
curl --user "btateyama:XXXXXXX" --data '{ "ref":"refs/heads/branchFromCurl", "sha":"f07fe11c9a33efb9a487b5b05eab99245d6cc90a" }' https://api.github.com/repos/btateyama/waffle_test/git/refs
```
