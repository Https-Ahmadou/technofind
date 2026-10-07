import { getCollection } from './mongodb';

export interface SubscriptionDocument {
  userId:   string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth:   string;
  };
  createdAt: Date;
}

export async function getSubscriptionsCollection() {
  return getCollection<SubscriptionDocument>('push_subscriptions');
}

export async function saveSubscription(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
) {
  const col = await getSubscriptionsCollection();
  await col.updateOne(
    { userId, endpoint: subscription.endpoint },
    { $set: { ...subscription, userId, createdAt: new Date() } },
    { upsert: true }
  );
}

export async function getUserSubscriptions(userId: string) {
  const col = await getSubscriptionsCollection();
  return col.find({ userId }).toArray();
}

export async function deleteSubscription(endpoint: string) {
  const col = await getSubscriptionsCollection();
  await col.deleteOne({ endpoint });
}