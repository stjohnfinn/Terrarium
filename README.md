# Terrarium

A TypeScript/JavaScript framework that attempts to simplify the process of 
writing a genetic algorithm.

## Rationale

There are some things that are exactly the same between all (or most) genetic
algorithms (performing crossover when creating a new generation, selecting 
parents based on some metric for fitness, etc.). There are other things that are always
different between genetic algorithms (how fitness is calculated, the "form" of 
a member of the population).

My goal in writing this was to create a framework that takes, as input, all of 
the things that are unique to each implementation of a genetic algorithm and put
them together for the user so they don't have to worry about it.

**Don't get it twisted**. While this framework might make it easier to write a 
genetic algorithm, you'll probably struggle to use it if you don't already know
how they work.

## Intro

There are two main types that the framework defines:
* `GeneticAlgorithmModel`
* `GeneticAlgorithm`

`GeneticAlgorithmModel` is basically the "state" of your ecosystem at any given
moment. I think it can be thought of as the "model" of a program that implements
model-view-controller design (MVC).

`GeneticAlgorithm` is a wrapper around the model that might be thought of as the 
"controller" in MVC. It abstracts running the genetic algorithm behind a 
`play()` function. The genetic algorithm can be stopped at any point with the 
`pause()` function.

### Basic Usage:

1. Define the necessary functions:
    * createOrganism
    * stepFunction
    * calculateFitness
    * crossover
    * mutate
    * shouldTerminate
    * shouldProgressGeneration
1. Pick out your hyperparameters:
    * populationSize
    * mutationRate
1. Create a `GeneticAlgorithm`.
    
        let geneticAlgorithm = new GeneticAlgorithm(
          createOrganism,
          stepFunction,
          calculateFitness,
          crossover,
          mutate,
          shouldTerminate,
          shouldProgressGeneration
        );

1. Start the genetic algorithm.

        geneticAlgorithm.play();

1. Optionally, read the model and display it however you like:

        # this infinite loop probably isn't the best way to do this
        while (true) {
          display(geneticAlgorithm.model);
        }

    > **Note**: you have to write the code for `display()`. This function can be
    > thought of as the "view" in MVC.

## Other Documentation

* [In-Depth Usage Guide](./doc/USAGE.md)
* [Design Notes](./doc/DESIGN.md)
