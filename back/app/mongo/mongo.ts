import { MongoClient, Db, ObjectId, InsertOneResult, UpdateResult, DeleteResult} from 'mongodb';
import { environment } from '../environment';
import { Music } from './music';
import { Schedule } from './schedule';

export class Mongo {
  client: MongoClient;
  db: Db;

  constructor() {
  }

  async start() {
    if (this.client) { return; }

    this.client = new MongoClient(environment.mongo.url);
    await this.client.connect();

    this.db = this.client.db('juketube');
    console.log('MongoDB connected');
  }

  async stop() {
    if (!this.client) { return; }

    await this.client.close();
    this.client = null;
    this.db = null;
    console.log('MongoDB disconnected');
  }

  async music(id: string): Promise<Music | null> {
    await this.start();

    const collection = this.db.collection<Music>('musics');
    const doument = await collection.findOne({ _id: new ObjectId(id) });
    return doument;
  }

  async musics(): Promise<Music[]> {
    await this.start();

    const collection = this.db.collection<Music>('musics');
    const documents = await collection.find({}).toArray();
    return documents;
  }

  async insertMusic(music: Music): Promise<InsertOneResult<Music>> {
    await this.start();

    const collection = this.db.collection<Music>('musics');
    const result = await collection.insertOne(music);
    return result;
  }

  async updateMusic(id: string, newMusic: Partial<Music>): Promise<UpdateResult> {
    await this.start();

    const collection = this.db.collection<Music>('musics');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: newMusic }
    );
    return result;
  }

  async deleteMusic(id: string): Promise<DeleteResult> {
    await this.start();

    const collection = this.db.collection<Music>('musics');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
  }

  async schedule(): Promise<Schedule> {
    await this.start();

    const collection = this.db.collection<Schedule>('schedule');
    const documents = await collection.find({}).toArray();

    if (documents.length > 0) {
      return documents[0];
    }

    const schedule = new Schedule();
    const inserted = await this.insertSchedule(schedule);
    schedule._id = inserted.insertedId;
    return schedule;
  }

  async insertSchedule(schedule: Schedule): Promise<InsertOneResult<Schedule>> {
    await this.start();

    const collection = this.db.collection<Schedule>('schedule');
    const result = await collection.insertOne(schedule);
    return result;
  }

  async updateSchedule(newSchedule: Partial<Schedule>): Promise<UpdateResult> {
    await this.start();

    const schedule = await this.schedule();
    const collection = this.db.collection<Schedule>('schedule');
    const result = await collection.updateOne(
      { _id: new ObjectId(schedule._id) },
      { $set: newSchedule }
    );
    return result;
  }
}
