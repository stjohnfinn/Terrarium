// crossover function(s), all should work regardless of the data type
// of each gene
const crossover = {
    // takes a single ecosystem object
    // mutation: none
    // assumes the genes are a dictionary/hashmap, NOT an array
    basic: function (ecosystem) {
        ecosystem.state.previousPopulation = ecosystem.state.population;
        ecosystem.state.population = [];
        // calculate the two most fit parents
        // uses the .sort function with a custom criteria (the fitness function)
        // sorts descending
        ecosystem.state.previousPopulation = ecosystem.state.population.sort((a, b) => {
            const keyA = ecosystem.calculateFitness(a);
            const keyB = ecosystem.calculateFitness(b);
            if (keyA < keyB)
                return -1;
            if (keyA > keyB)
                return 1;
            return 0;
        });
        // select the top two parents
        const [parentA, parentB] = ecosystem.state.previousPopulation;
        // create new childern using either parentA's or parentB's gene
        // for that slot.
        for (let i = 0; i < ecosystem.state.populationSize; i++) {
            // assign it the value of one of the parents
            let offspring = parentA;
            // for each gene of the organism
            Object.keys(offspring.genes).forEach(key => {
                // generate random number
                let randomNumber = Math.random();
                // assign new gene randomly
                // basically 50% chance for each parent
                // at this point, child is a direct copy of parentA,
                // so we only need to account for parentB probability
                if (randomNumber > 0.5) {
                    offspring.genes[key] = parentB[key];
                }
            });
            ecosystem.state.population[i] = offspring;
        }
    }
};
