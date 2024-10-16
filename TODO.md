# Tasks

DO ALL THIS SHIT BEFORE YOU IMPLEMENT A BUNCH OF COOL EXAMPLES

- add default options for as much of these as possible.
- add a debug mode with logging only when a debug variable is active.
- add some documentation that tells them to add a throw Error line if the 
organisms aren't congruent.
- update documentation.
- put documentation through an LLM for proofreading and clarity.
- add docstrings to everything in `terrarium.js`
- test if we can remove the T from this and just replace it with `Organism`.

      interface GeneticAlgorithmModel<T> {
        populationSize: number;
        generation: number;
        population: T[];
      }

- if the above is true, then can we just remove the type parameter from the 
`GeneticAlgorithm` class as well?