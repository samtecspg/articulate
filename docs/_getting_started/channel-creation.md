---
title: Create First Channel
layout: default
order: 2
---

# Create your first channel
If you've made it here then you likely are already staring at Conveyor inside of Kibana. This is what you should be seeing, you may have more or less sources showing depending on how many ones have been published.


### The Sources Screen
![Starting screen for conveyor]({{ "/img/conveyor.png" | absolute_url }})

The easiest way to get started is with the `Data File Upload` source, which expects a delimited text file, JSON, or XML file. Clicking on it will bring you to a screen with additional fields you need to fill in. One of which is a file upload. Fill out the form and choose a CSV file to upload. If you need some good examples download one of the files from [here](https://www.data.gov). I'm going to grab the [Air Quality Measurements Dataset](https://catalog.data.gov/dataset/air-quality-measures-on-the-national-environmental-health-tracking-network)

### The Create Screen
Here's what my **+ Create** page looks like after everything is filled in:

![Create a CSV based channel]({{ "/img/conveyor-create.png" | absolute_url }})


### The Channel List Screen
Once you click **Finish** you will be re-directed to the channels list page and you should see your newly created channel!

![Channel List showing our newly created channel]({{ "/img/conveyor-channels.png" | absolute_url }})
