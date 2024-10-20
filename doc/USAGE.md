# In-Depth Usage Guide

This document discusses in depth how to use each feature of this framework.

Stated more informally, this document just talks about the classes and things 
that you get by importing this framework. If you read through this entire 
document, you should have a good understanding of how each of the types are 
meant to be used and how they work together.

> **Note:** as I'm writing this right now, there aren't docstrings for every
function or type defined by this framework. This is definitely subject to 
change. Eventually, there should be docstrings for everything.

## Types

This section talks about the types (classes and interfaces) that this framework
provides.

### Organism

Every genetic algorithm (or at least the ones implemented using this framework)
have some sort of "population". This "population" consists of a bunch of pieces
of data and all of these have "genes" (hence "genetic"). This framework calls 
these "organisms". The `Organism` interface represents this concept.

The `Organism` interface is pretty simple. There are two instance variables.

* `genes`: this variable can be any type. This is probably usually an object or 
at least an array. I think better designs will define genes to be an object or 
array.
* `mutationChance`: the mutation chance for each gene. I recommend setting this 
to a value between 0 and 1 to properly represent a probability. This makes it 
easier to work with later in the `mutate` function. For example:
  
      const shouldMutate = Math.random() < organism.shouldMutate

  or

      const shouldMutate = Math.random() > (1 - organism.shouldMutate)

  are *marginally* simpler than something like this (where mutation rate is
  between 1 and 100):

      const shouldMutate = (Math.random() * 100) > organism.shouldMutate

This value is usually used in the `mutate` function to decide whether a single 
gene should mutate. You can read more about the design rationale for this 
variable [here](./DESIGN.md#design-notes---oct-14).

### Genetic Algorithm Model

The Terrarium framework was implemented in a way that hopefully makes it more
able to integrate with model-view-controller design (MVC). If you don't know 
what MVC is, there is plenty of information on the internet.

The `GeneticAlgorithmModel` interface should represent the "model" in MVC terms.
It kind of represents the state of the system at any given moment, and I think 
that's all it should ever represent.

Right now, it has three instance variables:

* `populationSize`: this is used to generate the population. This one doesn't 
really need any other clarification. It's the number of organisms that will 
exist in the system. It's a hyperparamter for creating the system. Maybe it 
could eventually be removed because it feels like something that can probably 
just be stored in the `GeneticAlgorithm` class.
* `generation`: this is the number of the current generation. It's pretty 
straightforward. This is increased by 1 each time the algorithm progresses to 
the next generation.
* `population`: this is the real meat of this model. This is an array of the 
organisms that live in the genetic algorithm.

### GeneticAlgorithm

This class should be your main interface with the framework. Don't expect any 
major support for interacting with the framework by circumventing this class.

It's a wrapper around the `GeneticAlgorithmModel` interface basically. There's a
few other things that I'll discuss, but that's how I think of it. It handles 
things that are outside the scope of the model itself. I think it can kind of be
thought of as the controller in MVC. Input should come in through this class and
then it should do things to the model if that's appropriate.

This is really the one thing that needs the most documentation, so this section
is going to be pretty long. I'm gonna talk about all of the methods and instance
variables that it has and then I'll talk about how to use it.

Since it's kind of hard to organize the data that's contained in this class, I'm
going to kind of just talk about the class free-form and make sure to cover 
everything at least once.

The `constructor` is obviously the entry point for this function. It's kind of 
an `init` function for the whole genetic algorithm. Here are the parameters it 
expects:

* `createOrganism`: user-defined method that has no inputs and should return an 
object of type Organism. This is used by the class to initialize the first 
generation of the genetic algorithm. It may also be used in the future to add 
reset functionality to this class.
* `stepFunction`: user-defined method that takes a `GeneticAlgorithmModel` as an
input and returns nothing. It makes changes to the `GeneticAlgorithmModel` 
in-place. On the backend, the `GeneticAlgorithm` class runs the model through
this function every frame.
* `shouldProgressGeneration`: user-defined method that takes a model as an input
and returns a boolean. Refer to [this image](../assets/Parts.png) for a better
understanding. This is the function that checks if it's time to move to the next
generation. You can probably figure out how to use it better if you take a look
at some of the examples. The user can define this however they want and the 
`GeneticAlgorithm` class will handle the rest.
* `produceNextGeneration`: user-defined method that takes a model as an input
and returns a new model. The `population` field of the model it returns should
represent the population of the new generation. **It is highly recommended to 
just use the default**. The default is pretty good. It increases the generation
by one and then finds the two most fit parents (with the user-defined fitness
function) and then performs crossover and the mutation. This is pretty standard
for genetic algorithms I think. This function is called when 
`shouldProgressGeneration` returns `true`.
* `calculateFitness`: user-defined method that takes a single organism as input
and returns a number that represents the fitness of the organism. Generally, 
you should write this function so that higher fitness means the organism is more
fit for creating offspring. If you use the default `produceNextGeneration` 
function, it will find two parents according to the two organisms with the 
highest fitness. You are completely able to write a function where smaller is 
better, but that means you either have to add a negative sign to the value 
before the function returns or you have to write your own 
`produceNextGeneration` function that takes this into account.
* `crossover`: user-defined method that takes two parents (of type `Organism`)
and returns an offspring organism. The user has to define this because there's 
really no way for the framework to figure out how to combine two organisms. I 
encourage putting some logic in this function to make sure the organism that the 
function returns is congruent with both of the parents. You probably don't want 
your offspring to have a few more or a few less genes than the parents. This is
obviously also something that the user has to define because it would be very
difficult (and not even completely robust) for the framework to try and do this
congruency check itself. By default, this function is leveraged by the 
`produceNextGeneration` function, but if you define your own function for that, 
then you have to be sure to call the `crossover` function.
* `mutate`: user-defined method that takes a single organism as input and 
returns the mutated organism. This should leverage the `mutationChance` instance
variable of the `Organism` type. This function has some similarities with the 
`crossover` function. You should check for congruency between the input organism
and the output organism. This function is also called by default in the 
`produceNextGeneration` function, so if you aren't using the default, you should
make sure to call this function in your version. Mutation is very necessary for 
an ecosystem to progress. `crossover` can only go so far. If you know how 
gradient descent works, you can think of a 0 mutation chance genetic algorithm
that has converged because of crossover just like a gradient descent algorithm 
that is stuck in a local minimum. Maybe an absolute minimum is right next door, 
but you'd never know if you didn't push the algorithm to do a little bit of 
exploration.
* `shouldTerminate`: user-defined method that takes a model as its only 
parameter and returns a boolean that represents a yes-or-no answer to the 
question, "should this genetic algorithm keep running". If you want it to run 
forever, this can be as simple as `return true;`. If you are using a genetic
algorithm to solve something like the traveling salesman problem, then you'll
probably want to "arrive" at a solution at some point. In the same way you 
could theoretically train a neural network for an infinite amount of time, you
could just let the genetic algorithm run forever. With neural networks, often, 
you might define a convergence point where if your improvements over a training
epoch are smaller than some number N, you just stop training. The same logic can
be applied to genetic algorithms.

So those are all of the user-defined methods. That's the real meat of the 
framework. It consumes those and puts them together so the user doesn't have to
worry about it at all. Later in these docs, I'll discuss exactly how the 
`GeneticAlgorithm` class brings everything together.

There is one more parameter that you can pass to the constructor: 
`populationSize`. This value defaults to 50. As I'll discuss in a second, the 
constructor creates an empty model and populates it and this `populationSize` 
value is passed directly to that object. In a more standard implementation, this
value represents the number of organisms that exist in your ecosystem. In code
terms, it's basically the `length` of the `population` array. It's theoretically
possible to implement a `produceNextGeneration` function that doesn't use the
`populationSize` value to generate a new `population`. However, that's probably 
a very rare use case. Most users of this framework will probably use the default
`produceNextGeneration` and the same number of organisms will exist during the
entire length of a generation. In those cases, the `populationSize` is the 
length of the population array. If the user uses the default 
`produceNextGeneration` but changes the number of organisms in the population 
during a generation, then the framework can only guarantee that the 
`populationSize` is the number of organisms that exist at the beginning of each 
generation. If they don't use the default `produceNextGeneration` function and 
they change the number of organisms during a generation, then the 
`populationSize` value may be completely meaningless.

Now that we've covered every single parameter that the constructor gets, I'll
discuss exactly what happens when the constructor runs. Obviously, this is all
documented in code, but it's worth discussing in plain english as well in case 
comments aren't sufficient.

As I mentioned previously, the constructor immediately creates an empty 
`GeneticAlgorithmModel` object. It has an empty population, a `generation` set
to 0, and a `populationSize` of whatever you gave it in the parameters.

I considered having some sort of input validation for all of the parameters, but
I figured that would constrain the user too much considering the fact that even
when using the framework, the user is still doing like 40-60% of the work.

It then saves all of the user-defined functions in the `this` object for use 
later.

It initializes a new variable: `isRunning`. This value represents whether or not
the genetic algorithm is running. More specifically, the `stepFunction` won't 
run repeatedly if this value is `false`.

The constructor then populations the `this.model.population` array. It leverages
the `createOrganism` function you just gave it to create a number of organisms
equal to `populationSize`.

> **Note:** `isRunning` is `false` at the end of the constructor, which means
the genetic algorithm doesn't start progressing until you tell it to.

That's everything the constructor does.

The next thing to discuss are the four very simple class methods:
* `step()`: runs every frame and handles the "game loop" sorta stuff. Tt 
immediately checks if the genetic algorithm should terminate. If the answer is
yes, then it checks if it should progress to the next generation. If the answer 
is yes, it produces a new generation and continues with the rest of the 
function. The last thing it does is check if `isRunning` is `true` and if it is,
it calls the user-defined `stepFunction` and then calls the next class method I
will discuss: `next`.
* `next()`: this one might seem kind of weird, but it's super simple and should 
kinda make intuitive sense. It might not though because I know `next()` is kind
of a reserved word for linked-lists. I knew I would be calling 
`requestAnimationFrame` a bunch in this class and I wanted to make that 
pretty easy and kind of abstract that away so the code was cleaner. The `next` 
function just makes a `requestAnimationFrame` call where the callback is an
arrow function that runs `this.step()`, which I just discussed.
* `play()`: exactly what it sounds like. This "plays" the genetic algorithm. In
more concrete terms, it sets `isRunning` to `true` and then bootstraps the 
game loop again by calling `next()`. As I mentioned before, the constructor 
**DOES NOT** start the genetic algorithm. Your code has to call this function
at some point to start running the genetic algorithm.
* `pause()`: also exactly what it sounds like. This just sets `isRunning` to 
`false`.

That's everything. You probably already noticed the framework is like 150 lines 
of code. It's pretty simple. Honestly, you could probably just learn the 
framework by reading the code just as fast as you can learn it by reading this
documentation.

Good luck!

If you have any questions, you can find my contact information 
[on my website](https://finnstjohn.dev/). Please don't hesitate to reach out!
