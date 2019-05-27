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
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('musics');
      collection.find({_id: new ObjectID(id)}).toArray((error, documents) => {
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
      });
    });
  }

  musics(): Promise<Array<Music>> {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('musics');
      collection.find({}).toArray((error, documents) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(documents);
        }
      });
    });
  }

  insertMusic(music: Music): Promise<any> {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('musics');
      collection.insertOne(music).then(inserted => {
        resolve(inserted);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  updateMusic(id: string, newMusic: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('musics');
      collection.updateOne({_id: new ObjectID(id)}, {$set: newMusic}).then(updated => {
        resolve(updated);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  deleteMusic(id: string) {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('musics');
      collection.deleteOne({_id: new ObjectID(id)}).then(deleted => {
        resolve(deleted);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  schedule(): Promise<Schedule> {
    return new Promise((resolve, reject) => {
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
      });
    });
  }

  insertSchedule(schedule: Schedule): Promise<any> {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection('schedule');
      collection.insertOne(schedule).then(inserted => {
        resolve(inserted);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  updateSchedule(newSchedule: Schedule): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const schedule = await this.schedule();
      const collection = this.db.collection('schedule');
      collection.updateOne({_id: new ObjectID(schedule._id)}, {$set: newSchedule}).then(updated => {
        resolve(updated);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }
}
