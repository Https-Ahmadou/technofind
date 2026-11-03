import { getCollection } from './mongodb';
import { ObjectId } from 'mongodb';

export interface ReportDocument {
  _id?:       ObjectId;
  articleId:  string;
  articleUrl: string;
  articleTitle: string;
  reason:     'inexact' | 'inapproprie' | 'droits_auteur' | 'spam' | 'autre';
  details?:   string;
  userId?:    string;
  createdAt:  Date;
  status:     'pending' | 'reviewed' | 'resolved';
}

export async function getReportsCollection() {
  return getCollection<ReportDocument>('reports');
}

export async function createReport(data: Omit<ReportDocument, '_id' | 'createdAt' | 'status'>) {
  const col = await getReportsCollection();
  const result = await col.insertOne({
    ...data,
    createdAt: new Date(),
    status:    'pending',
  });
  return result.insertedId;
}