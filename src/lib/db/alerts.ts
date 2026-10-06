import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface AlertDocument {
  _id?:      ObjectId;
  userId:    string;
  keyword:   string;
  category?: string;
  frequency: 'immediate' | 'daily' | 'weekly';
  active:    boolean;
  createdAt: Date;
}

export async function getAlertsCollection() {
  return getCollection<AlertDocument>('alerts');
}

export async function getUserAlerts(userId: string) {
  const col = await getAlertsCollection();
  return col.find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function createAlert(data: Omit<AlertDocument, '_id' | 'createdAt'>) {
  const col = await getAlertsCollection();
  const result = await col.insertOne({
    ...data,
    createdAt: new Date(),
  });
  return { ...data, _id: result.insertedId, createdAt: new Date() };
}

export async function updateAlert(id: string, userId: string, data: Partial<AlertDocument>) {
  const col = await getAlertsCollection();
  await col.updateOne(
    { _id: new ObjectId(id), userId },
    { $set: data }
  );
}

export async function deleteAlert(id: string, userId: string) {
  const col = await getAlertsCollection();
  await col.deleteOne({ _id: new ObjectId(id), userId });
}