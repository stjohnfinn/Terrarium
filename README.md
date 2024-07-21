# Terrarium

A framework for building genetic algorithms.

## Design

I'm really interested in genetic algorithms. I think I like the idea of implementing some rules and then
just letting the program run. It's cool to watch the organisms learn new things and develop strategies.

One of my past projects was a genetic algorithm, but as I've progressed in my career, I've discovered
ways to improve upon that project's implementation.

I want to build a framework that I can use to implement new genetic algorithms easily.

Here's the design:

Basically, I wanted to standardize and abstract away the common parts of genetic algorithms.

The only things that change between genetic algorithms is the genes, how the genes are expressed, and
how fitness is calculated. These three thigns are the only things that the users of this framework
should have to implement themselves. I'd like to implement a few reproduction algorithms that they can 
choose from. That should include implementing automatic mutation based on the data type of each gene.

What parts must the user implement:
- gene definition (genome)
- gene expression (what happens during each "step")
- fitness algorithm

What parts are already implemented:
- evolution loop (the loop that executes a "step" for each loop)
- play, pause, stop, and restart functions
- metrics (per generation and all-time)

So, ideally, the user implements the gene definition, the "step" function, and the fitness algorithm.

Then, they just call something like `genetic_algorithm_framework.go()`. The framework automatically
runs the "step" function for each frame and then calculates the fitness at the end, performs reproduction,
and then starts a new generation.

## Limitations

This assumes reproduction happens at the same time for every organism. This is something that doesn't 
happen in real life. All members of each "generation" (baby boomers, millenials) are born at different
times. There is overlap between real-life generations. That isn't the case with genetic algorithms.

## The "step" function

This is the bulk of the genetic algorithm. It determines how genes are expressed. It determines how 
organisms interact with each other and the environment. This is the core of how the organisms will 
evolve. Obviously, this framework does not implement this function already, because it is unique to 
every genetic algorithm.

## Goal

Someone should be able to import this framework, create a set of genes, write the step function, and 
write the fitness function and then just let it run.
