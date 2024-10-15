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

* `genes`: this variable can be any type, but you have to tell it which type 
this should be upon instantiation. This is probably usually an object or at 
least an array. I think better designs will define genes to be an object or 
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

This value is usually used in the `mutate` function to decide whether a single gene should mutate. You can read more about the design rationale for this 
variable [here](./DESIGN.md#design-notes---oct-14).

### Genetic Algorithm Model
