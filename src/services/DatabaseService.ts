import * as SQLite from 'expo-sqlite';
import { CatBreed } from '../types/CatBreed';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: SQLite.SQLiteDatabase;

  private constructor() {
    this.db = SQLite.openDatabaseSync('catBreeds.db');
    this.initializeDatabase();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeDatabase(): void {
    
    this.db.execSync('DROP TABLE IF EXISTS breeds');
    this.db.execSync('DROP TABLE IF EXISTS favorites');
    this.db.execSync('DROP TABLE IF EXISTS search_history');

    // Create breeds table with new fields
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS breeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tica_code TEXT,
        name TEXT NOT NULL,
        origin TEXT NOT NULL,
        coat_length TEXT NOT NULL,
        coat_pattern TEXT,
        body_type TEXT NOT NULL,
        temperament TEXT NOT NULL,
        activity_level TEXT NOT NULL,
        grooming_needs TEXT NOT NULL,
        health_issues TEXT,
        lifespan_min INTEGER NOT NULL,
        lifespan_max INTEGER NOT NULL,
        weight_min_female REAL NOT NULL,
        weight_max_female REAL NOT NULL,
        weight_min_male REAL NOT NULL,
        weight_max_male REAL NOT NULL,
        description TEXT NOT NULL,
        care_requirements TEXT,
        ideal_for TEXT,
        genetic_info TEXT,
        personality_scores TEXT,
        image_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create favorites table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        breed_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (breed_id) REFERENCES breeds (id),
        UNIQUE(breed_id)
      )
    `);

    // Create search history table
    this.db.execSync(`
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for faster searches
    this.db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_breeds_name ON breeds(name);
      CREATE INDEX IF NOT EXISTS idx_breeds_origin ON breeds(origin);
      CREATE INDEX IF NOT EXISTS idx_breeds_temperament ON breeds(temperament);
      CREATE INDEX IF NOT EXISTS idx_breeds_genetic_info ON breeds(genetic_info);
    `);
  }

  // Helper method to serialize personality scores
  private serializePersonalityScores(scores: any): string | null {
    if (!scores) return null;
    return JSON.stringify(scores);
  }

  // Helper method to deserialize personality scores
  private deserializePersonalityScores(scoresString: string | null): any {
    if (!scoresString) return null;
    try {
      return JSON.parse(scoresString);
    } catch (error) {
      console.error('Error parsing personality scores:', error);
      return null;
    }
  }

  // Helper method to transform database result to CatBreed
  private transformBreedResult(dbResult: any): CatBreed {
    return {
      ...dbResult,
      personality_scores: this.deserializePersonalityScores(dbResult.personality_scores)
    };
  }

  // Breed operations
  async getAllBreeds(): Promise<CatBreed[]> {
    const results = this.db.getAllSync('SELECT * FROM breeds ORDER BY name');
    return results.map(result => this.transformBreedResult(result));
  }

  async getBreedById(id: number): Promise<CatBreed | null> {
    const result = this.db.getFirstSync('SELECT * FROM breeds WHERE id = ?', [id]);
    return result ? this.transformBreedResult(result) : null;
  }

  async getBreedByTicaCode(ticaCode: string): Promise<CatBreed | null> {
    const result = this.db.getFirstSync('SELECT * FROM breeds WHERE tica_code = ?', [ticaCode]);
    return result ? this.transformBreedResult(result) : null;
  }

  async searchBreeds(query: string): Promise<CatBreed[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    const results = this.db.getAllSync(`
      SELECT * FROM breeds 
      WHERE LOWER(name) LIKE ? 
         OR LOWER(origin) LIKE ? 
         OR LOWER(temperament) LIKE ?
         OR LOWER(coat_pattern) LIKE ?
         OR LOWER(genetic_info) LIKE ?
      ORDER BY name
    `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);
    return results.map(result => this.transformBreedResult(result));
  }

  async getBreedsByOrigin(origin: string): Promise<CatBreed[]> {
    const results = this.db.getAllSync('SELECT * FROM breeds WHERE origin = ? ORDER BY name', [origin]);
    return results.map(result => this.transformBreedResult(result));
  }

  async getBreedsByActivityLevel(activityLevel: string): Promise<CatBreed[]> {
    const results = this.db.getAllSync('SELECT * FROM breeds WHERE activity_level = ? ORDER BY name', [activityLevel]);
    return results.map(result => this.transformBreedResult(result));
  }

  async getBreedsByCoatLength(coatLength: string): Promise<CatBreed[]> {
    const results = this.db.getAllSync('SELECT * FROM breeds WHERE coat_length = ? ORDER BY name', [coatLength]);
    return results.map(result => this.transformBreedResult(result));
  }

  async insertBreed(breed: Omit<CatBreed, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const serializedPersonalityScores = this.serializePersonalityScores(breed.personality_scores);
    
    const result = this.db.runSync(`
      INSERT INTO breeds (
        tica_code, name, origin, coat_length, coat_pattern, body_type,
        temperament, activity_level, grooming_needs, health_issues,
        lifespan_min, lifespan_max, weight_min_female, weight_max_female,
        weight_min_male, weight_max_male, description, care_requirements,
        ideal_for, genetic_info, personality_scores, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      breed.tica_code || null, 
      breed.name, 
      breed.origin, 
      breed.coat_length,
      breed.coat_pattern || null, 
      breed.body_type, 
      breed.temperament, 
      breed.activity_level,
      breed.grooming_needs, 
      breed.health_issues || null, 
      breed.lifespan_min, 
      breed.lifespan_max,
      breed.weight_min_female, 
      breed.weight_max_female, 
      breed.weight_min_male,
      breed.weight_max_male, 
      breed.description, 
      breed.care_requirements || null,
      breed.ideal_for || null,
      breed.genetic_info || null,
      serializedPersonalityScores,
      breed.image_path
    ]);
    return result.lastInsertRowId;
  }

  async updateBreed(id: number, breed: Partial<CatBreed>): Promise<void> {
    // Create a copy of breed data for processing
    const breedData: any = { ...breed };
    
    // Handle personality scores serialization
    if (breedData.personality_scores) {
      breedData.personality_scores = this.serializePersonalityScores(breedData.personality_scores);
    }
    
    const fields = Object.keys(breedData).filter(key => 
      key !== 'id' && 
      key !== 'created_at' && 
      key !== 'updated_at' && 
      breedData[key] !== undefined
    );
    
    if (fields.length === 0) {
      return; // Nothing to update
    }
    
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => breedData[field]).filter(value => value !== undefined);
    
    this.db.runSync(`
      UPDATE breeds 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `, [...values, id]);
  }

  async deleteBreed(id: number): Promise<void> {
    this.db.runSync('DELETE FROM breeds WHERE id = ?', [id]);
  }

  // Favorites operations
  async getFavorites(): Promise<CatBreed[]> {
    const results = this.db.getAllSync(`
      SELECT b.* FROM breeds b
      INNER JOIN favorites f ON b.id = f.breed_id
      ORDER BY f.created_at DESC
    `);
    return results.map(result => this.transformBreedResult(result));
  }

  async addToFavorites(breedId: number): Promise<void> {
    this.db.runSync('INSERT OR IGNORE INTO favorites (breed_id) VALUES (?)', [breedId]);
  }

  async removeFromFavorites(breedId: number): Promise<void> {
    this.db.runSync('DELETE FROM favorites WHERE breed_id = ?', [breedId]);
  }

  async isFavorite(breedId: number): Promise<boolean> {
    const result = this.db.getFirstSync('SELECT 1 FROM favorites WHERE breed_id = ?', [breedId]);
    return !!result;
  }

  // Search history operations
  async getSearchHistory(limit: number = 10): Promise<string[]> {
    const results = this.db.getAllSync(
      'SELECT DISTINCT query FROM search_history ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return results.map((row: any) => row.query);
  }

  async addToSearchHistory(query: string): Promise<void> {
    if (query.trim().length < 2) return;
    
    // Remove existing occurrence
    this.db.runSync('DELETE FROM search_history WHERE query = ?', [query.trim()]);
    
    // Add new entry
    this.db.runSync('INSERT INTO search_history (query) VALUES (?)', [query.trim()]);
    
    // Keep only latest 20 entries
    this.db.runSync(`
      DELETE FROM search_history 
      WHERE id NOT IN (
        SELECT id FROM search_history ORDER BY created_at DESC LIMIT 20
      )
    `);
  }

  async clearSearchHistory(): Promise<void> {
    this.db.runSync('DELETE FROM search_history');
  }

  // Utility operations
  async getUniqueOrigins(): Promise<string[]> {
    const results = this.db.getAllSync('SELECT DISTINCT origin FROM breeds ORDER BY origin');
    return results.map((row: any) => row.origin);
  }

  async getUniqueCoatLengths(): Promise<string[]> {
    const results = this.db.getAllSync('SELECT DISTINCT coat_length FROM breeds ORDER BY coat_length');
    return results.map((row: any) => row.coat_length);
  }

  async getUniqueActivityLevels(): Promise<string[]> {
    const results = this.db.getAllSync('SELECT DISTINCT activity_level FROM breeds ORDER BY activity_level');
    return results.map((row: any) => row.activity_level);
  }

  async getUniqueBodyTypes(): Promise<string[]> {
    const results = this.db.getAllSync('SELECT DISTINCT body_type FROM breeds ORDER BY body_type');
    return results.map((row: any) => row.body_type);
  }

  // Initialize with seed data
  async seedDatabase(): Promise<void> {
    // Force re-seeding
    console.log('Force re-seeding database...');
    
    // Clear existing data
    this.db.execSync('DELETE FROM breeds');
    this.db.execSync('DELETE FROM favorites');
    this.db.execSync('DELETE FROM search_history');
    
    // Re-seed with new data
    await this.populateInitialData();
  }

  private async populateInitialData(): Promise<void> {
    // Import the new breeds data
    const { catBreedsData } = await import('../data/newBreedsData');
    
    for (const breed of catBreedsData) {
      try {
        await this.insertBreed(breed);
        console.log(`✅ Inserted breed: ${breed.name}`);
      } catch (error) {
        console.error(`❌ Error inserting breed ${breed.name}:`, error);
      }
    }
    console.log(`🎉 Database seeded with ${catBreedsData.length} cat breeds!`);
  }
}