interface Organism<T> {
  genes: T;
  fitness: number;
}

interface GeneticAlgorithmModel<T> {
  // Functions that define the genetic algorithm behavior
  calculateFitness: (individual: T) => number;
  createOrganism: () => T;
  crossover: (parent1: T, parent2: T) => T;
  mutate: (individual: T) => T;
  
  // Configuration parameters
  populationSize: number;
  mutationRate: number;
  
  // Optional termination conditions
  terminationCondition?: (population: Organism<T>[], generation: number) => boolean;
  maxGenerations?: number;
}

class GeneticAlgorithm<T> {
  private population: Organism<T>[];
  private generation: number;
  private model: GeneticAlgorithmModel<T>;
  
  constructor(config: GeneticAlgorithmModel<T>) {
      this.model = config;
      this.generation = 0;
      this.population = this.initializePopulation();
  }
  
  private initializePopulation(): Organism<T>[] {
      return Array.from({ length: this.model.populationSize }, () => {
          const genes = this.model.createOrganism();
          return {
              genes,
              fitness: this.model.calculateFitness(genes)
          };
      });
  }
  
  step(): void {
      // Create next generation
      const newPopulation: Organism<T>[] = [];
      
      while (newPopulation.length < this.model.populationSize) {
          // Select parents using tournament selection
          const parent1 = this.tournamentSelect();
          const parent2 = this.tournamentSelect();
          
          // Create offspring
          let offspring = this.model.crossover(parent1.genes, parent2.genes);
          
          // Possibly mutate
          if (Math.random() < this.model.mutationRate) {
              offspring = this.model.mutate(offspring);
          }
          
          // Add to new population
          newPopulation.push({
              genes: offspring,
              fitness: this.model.calculateFitness(offspring)
          });
      }
      
      this.population = newPopulation;
      this.generation++;
  }
  
  private tournamentSelect(tournamentSize: number = 3): Organism<T> {
      let best: Organism<T> | null = null;
      
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
      if (this.model.terminationCondition?.(this.population, this.generation)) {
          return true;
      }
      
      if (this.model.maxGenerations && this.generation >= this.model.maxGenerations) {
          return true;
      }
      
      return false;
  }
  
  // Getter methods for monitoring progress
  getBestIndividual(): Organism<T> {
      return [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
  }
  
  getGeneration(): number {
      return this.generation;
  }
  
  getAverageFitness(): number {
      return this.population.reduce((sum, ind) => sum + ind.fitness, 0) / this.population.length;
  }
}