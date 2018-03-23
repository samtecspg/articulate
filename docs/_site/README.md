# Jekyll src for Conveyor documentation

If you want to view this documentation locally you can use docker to kick-it-off without having to locally install jekyll.   The following will get it running locally on port 4000 (assuming you run the command in the docs directory)

```docker run -p 4000:4000 -v `pwd`:/srv/jekyll -it jekyll/jekyll jekyll```
