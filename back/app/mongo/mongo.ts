import { MongoClient, Db, ObjectID, ObjectId } from 'mongodb';
import { environment } from '../environment';
import { Music } from './music';
import { Schedule } from './schedule';

export class Mongo {
  client: MongoClient;
  db: Db;

  constructor() {
  }

  start(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client = new MongoClient(environment.mongo.url, {useNewUrlParser: true});
      this.client.connect(error => {
        if (error) {
          console.error(error);
          reject(error);          
        } else {
          this.db = this.client.db('juketube');
          resolve();
        }
      })
    });    
  }

  stop(): Promise<any> {
    return this.client.close();
  }

  music(id: string): Promise<Music> {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('musics');
      collection.find({_id: new ObjectID(id)}).toArray(async (error, documents) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          if (documents.length > 0) {
            resolve(documents[0]);
          } else {
            resolve(null);
          }
        }
        await this.stop();
      });
    });
  }

  musics(): Promise<Array<Music>> {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('musics');
      collection.find({}).toArray(async (error, documents) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(documents);
        }
        await this.stop();
      });
    });
  }

  insertMusic(music: Music): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('musics');
      collection.insertOne(music).then(async inserted => {
        resolve(inserted);
        await this.stop();
      }).catch(async error => {
        console.error(error);
        reject(error);
        await this.stop();
      });
    });
  }

  updateMusic(id: string, newMusic: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('musics');
      collection.updateOne({_id: new ObjectID(id)}, {$set: newMusic}).then(async updated => {
        resolve(updated);
        await this.stop();
      }).catch(async error => {
        console.error(error);
        reject(error);
        await this.stop();
      });
    });
  }

  deleteMusic(id: string) {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('musics');
      collection.deleteOne({_id: new ObjectID(id)}).then(async deleted => {
        resolve(deleted);
        await this.stop();
      }).catch(async error => {
        console.error(error);
        reject(error);
        await this.stop();
      });
    });
  }

  schedule(): Promise<Schedule> {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('schedule');
      collection.find({}).toArray(async (error, documents) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          if (documents.length > 0) {
            resolve(documents[0]);
          } else {
            const schedule = new Schedule();
            const inserted = await this.insertSchedule(schedule);
            schedule._id = inserted.insertedId;
            resolve(schedule);
          }
        }
        await this.stop();
      });
    });
  }

  insertSchedule(schedule: Schedule): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await this.start();
      const collection = this.db.collection('schedule');
      collection.insertOne(schedule).then(async inserted => {
        resolve(inserted);
        await this.stop();
      }).catch(async error => {
        console.error(error);
        reject(error);
        await this.stop();
      });
    });
  }

  updateSchedule(newSchedule: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const schedule = await this.schedule();
      await this.start();
      const collection = this.db.collection('schedule');
      collection.updateOne({_id: new ObjectID(schedule._id)}, {$set: newSchedule}).then(async updated => {
        resolve(updated);
        await this.stop();
      }).catch(async error => {
        console.error(error);
        reject(error);
        await this.stop();
      });
    });
  }
}
