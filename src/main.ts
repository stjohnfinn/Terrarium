const chars = "abcdefghijklmnopqrstuvwxyz";
const targetStringLength = 10;

class WordOrganism implements Organism<string> {
  genes: string;

  constructor() {
    this.genes = "";
  }
}
