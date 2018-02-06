# Local builds

As of Feb 4 2018, `docker-compose.yml` pulls the most recent build from dockerhub instead of locally building.

To do development builds, the compose needs to be augmented with the info that is in `build-compose-override.yml`

So to enable docker-compose to work locally use the following arguments to compose: 

```docker-compose -f docker-compose.yml -f build-compose-override.yml XXXX```

[`XXXX` being what ever compose command you wanted to run, `up`, `down`, `build api`, etc)

# Branching strategy

This project uses a 'cactus' branching strategy https://barro.github.io/2016/02/a-succesful-git-branching-model-considered-harmful/

This means:

1. The head of `master` is the newest development code
2. Released code can be found by looking at GitHub releases and/or project tags
3. Primary use of branches on GitHub is for releases (feel free to use locally, just don't try and push them unless they for a release)
4. Don't just `pull` - you should always use `pull --rebase`, in other word only do fast-forward merges
5. Any pull requests will need to be rebased to the head of `master` before they will be merge

# Release process

Process begins as soon as all the features that are destin for the release are in master

1. Make a release branch
2. Test/bug-fix until the release is ready
3. Edit the `docker-compoose.yml` so that it points to the release version
4. (optionally) do a local build then a up to double-check mods
5. Commit & push
6. Tag the commit with the release version number
7. (Wait for dockerhub to finish building everything
8. Do a `docker-compose up` and make sure its still as expected
9. Clone on that tag then delete all the git files
10. Tar/Zip
11. Edit the GitHub release with any useful notes, upload the tar/zip 
