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

1. Process begins as soon as all the features that are destin for the release are in master
   1. Make a release branch - "git checkout -b v0.5"
2. Test/bug-fix until the release is ready
   1. Set the "patch" number your attempting to build (`MAJOR.MINOR.PATCH`)
   2. Edit the `docker-compoose.yml` so that it points to that version - "api:0.5.1"
   3. Commit & push
   4. Do a local build then a up to double-check mods - `docker-compose -f docker-compose.yml -f build-compose-override.yml up`
3. If everything above all seems clean and your ready to really make the release (trigger the automatic builds)
   1. Tag with the full verison info - `git tag -a -m "The release" v0.5.1 ; git push origin v0.5.1`
   2. (Wait for dockerhub to finish building everything
   3. Do a `docker-compose up` and make sure its still as expected (best on clean clone and clean docker (flush releated images)
4. Make the release on github
   1. Click on "X releases" in github and "Draft a new release" with the version tag used above
   2. Build the Tar/Zips for the release
      1. Start in a clean/empty directory
      2. `clone https://github.com/samtecspg/articulate.git`
      3. `mv articulate articulate-src`
      4. `cd articulate-src`
      5. `git checkout v0.5.1`
      6. `cd ..`
      7. `mkdir articulate-0.5.1`
      8.  `cp -r articulate-src/docker-compose.yml articulate-src/local-storage articulate-0.5.1`
      9. `rm articulate-0.5.1/local-storage/redis-data/.gitignore articulate-0.5.1/local-storage/rasa/nlu-model/.gitignore`
      10. `zip -9 -y -r articulate-0.5.1.zip articulate-0.5.1`
      11. `tar cvf articulate-0.5.1.tar articulate-0.5.1`
      12. `gzip -9 articulate-0.5.1.tar`
  3. "Edit" the github relase and drag `articulate-0.5.1.zip` & `articulate-0.5.1.tar.gz` onto the release

11. Edit the GitHub release with any useful notes, upload the tar/zip 
