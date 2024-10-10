// Example usage for word matching
const targetWord = "hello world";

const wordMatchingGA = new GeneticAlgorithm<string>({
    populationSize: 100,
    mutationRate: 0.02,
    
    calculateFitness: (word: string) => {
        let score = 0;
        for (let i = 0; i < targetWord.length; i++) {
            if (word[i] === targetWord[i]) score++;
        }
        return score / targetWord.length;
    },
    
    createIndividual: () => {
        const chars = "abcdefghijklmnopqrstuvwxyz ";
        return Array.from({ length: targetWord.length }, 
            () => chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    },
    
    crossover: (parent1: string, parent2: string) => {
        return parent1
            .split('')
            .map((char, i) => Math.random() > 0.5 ? char : parent2[i])
            .join('');
    },
    
    mutate: (word: string) => {
        const chars = "abcdefghijklmnopqrstuvwxyz ";
        const pos = Math.floor(Math.random() * word.length);
        const newChar = chars[Math.floor(Math.random() * chars.length)];
        return word.substring(0, pos) + newChar + word.substring(pos + 1);
    },
    
    terminationCondition: (population) => {
        return population.some(ind => ind.genes === targetWord);
    }
});

// Run the algorithm
wordMatchingGA.run().then(() => {
    console.log('Best solution:', wordMatchingGA.getBestIndividual().genes);
    console.log('Generations:', wordMatchingGA.getGeneration());
});