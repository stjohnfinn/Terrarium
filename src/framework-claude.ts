interface Individual<T> {
  genes: T;
  fitness: number;
}

interface GeneticAlgorithmConfig<T> {
  // Functions that define the genetic algorithm behavior
  calculateFitness: (individual: T) => number;
  createIndividual: () => T;
  crossover: (parent1: T, parent2: T) => T;
  mutate: (individual: T) => T;
  
  // Configuration parameters
  populationSize: number;
  mutationRate: number;
  
  // Optional termination conditions
  terminationCondition?: (population: Individual<T>[], generation: number) => boolean;
  maxGenerations?: number;
}

class GeneticAlgorithm<T> {
  private population: Individual<T>[];
  private generation: number;
  private config: GeneticAlgorithmConfig<T>;
  
  constructor(config: GeneticAlgorithmConfig<T>) {
      this.config = config;
      this.generation = 0;
      this.population = this.initializePopulation();
  }
  
  private initializePopulation(): Individual<T>[] {
      return Array.from({ length: this.config.populationSize }, () => {
          const genes = this.config.createIndividual();
          return {
              genes,
              fitness: this.config.calculateFitness(genes)
          };
      });
  }
  
  step(): void {
      // Create next generation
      const newPopulation: Individual<T>[] = [];
      
      while (newPopulation.length < this.config.populationSize) {
          // Select parents using tournament selection
          const parent1 = this.tournamentSelect();
          const parent2 = this.tournamentSelect();
          
          // Create offspring
          let offspring = this.config.crossover(parent1.genes, parent2.genes);
          
          // Possibly mutate
          if (Math.random() < this.config.mutationRate) {
              offspring = this.config.mutate(offspring);
          }
          
          // Add to new population
          newPopulation.push({
              genes: offspring,
              fitness: this.config.calculateFitness(offspring)
          });
      }
      
      this.population = newPopulation;
      this.generation++;
  }
  
  private tournamentSelect(tournamentSize: number = 3): Individual<T> {
      let best: Individual<T> | null = null;
      
      for (let i = 0; i < tournamentSize; i++) {
          const contestant = this.population[Math.floor(Math.random() * this.population.length)];
          if (!best || contestant.fitness > best.fitness) {
              best = contestant;
          }
      }
      
      return best!;
  }
  
  async run(): Promise<void> {
      while (!this.shouldTerminate()) {
          this.step();
          // Optional: Add a small delay to prevent blocking
          await new Promise(resolve => setTimeout(resolve, 0));
      }
  }
  
  private shouldTerminate(): boolean {
      if (this.config.terminationCondition?.(this.population, this.generation)) {
          return true;
      }
      
      if (this.config.maxGenerations && this.generation >= this.config.maxGenerations) {
          return true;
      }
      
      return false;
  }
  
  // Getter methods for monitoring progress
  getBestIndividual(): Individual<T> {
      return [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
  }
  
  getGeneration(): number {
      return this.generation;
  }
  
  getAverageFitness(): number {
      return this.population.reduce((sum, ind) => sum + ind.fitness, 0) / this.population.length;
  }
}