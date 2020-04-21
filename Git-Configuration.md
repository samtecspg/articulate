# Private Fork of Articulate

We don't have a great name for whatever this is yet, so we'll just stick to Articulate Plus for now.

## Git Configuration

After you clone this repo, you may want to add an additional remote so that you can pull the latest from the public master. Below are the commands to get that setup.

```
git remote add public-origin https://github.com/samtecspg/articulate.git
```

## Pulling Public master

Once you have the above done you can then pull in the latest changes from the public master by

```
git pull public-origin master
```

All of the above is trying to follow [this](https://medium.com/@bilalbayasut/github-how-to-make-a-fork-of-public-repository-private-6ee8cacaf9d3) guide.

The biggest thing we're trying to ever avoid is pushing the private repo into the public one, thus exposing all of the premium features as open source. Which is more or less irreversable.
