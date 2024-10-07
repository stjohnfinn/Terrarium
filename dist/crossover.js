// crossover function(s), all should work regardless of the data type
// of each gene
const crossover = {
    // takes a single ecosystem object
    // mutation: none
    // assumes the genes are a dictionary/hashmap, NOT an array
    basic: function (ecosystem) {
        let newGeneration = new Ecosystem([], ecosystem.calculateFitness);
        return newGeneration;
    }
};
