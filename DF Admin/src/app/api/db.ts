import dbConnect from '../../lib/dbConnect';
import Nomination from '../../models/Nomination';
import Donation from '../../models/Donation';
import Delegate from '../../models/Delegate';
import Volunteer from '../../models/Volunteer';
import Enquiry from '../../models/Enquiry';
import ActivityLog from '../../models/ActivityLog';
import Gallery from '../../models/Gallery';
import Event from '../../models/Event';

export interface DatabaseSchema {
  nominations: any[];
  donations: any[];
  delegates: any[];
  volunteers: any[];
  enquiries: any[];
  activityLogs: any[];
  gallery: any[];
  events: any[];
}

export async function readDb(): Promise<DatabaseSchema> {
  try {
    await dbConnect();
    
    // Fetch all collections in parallel
    const [
      nominations,
      donations,
      delegates,
      volunteers,
      enquiries,
      activityLogs,
      gallery,
      events
    ] = await Promise.all([
      Nomination.find({}).lean(),
      Donation.find({}).lean(),
      Delegate.find({}).lean(),
      Volunteer.find({}).lean(),
      Enquiry.find({}).lean(),
      ActivityLog.find({}).lean(),
      Gallery.find({}).lean(),
      Event.find({}).lean()
    ]);

    // Map Mongo objects (e.g. converting _id to id or returning as is)
    const mapMongoDoc = (doc: any) => {
      if (!doc) return doc;
      const { _id, __v, ...rest } = doc;
      return { id: rest.id || String(_id), ...rest };
    };

    return {
      nominations: nominations.map(mapMongoDoc),
      donations: donations.map(mapMongoDoc),
      delegates: delegates.map(mapMongoDoc),
      volunteers: volunteers.map(mapMongoDoc),
      enquiries: enquiries.map(mapMongoDoc),
      activityLogs: activityLogs.map(mapMongoDoc),
      gallery: gallery.map(mapMongoDoc),
      events: events.map(mapMongoDoc)
    };
  } catch (error) {
    console.error("Database read error:", error);
    throw error;
  }
}

export async function writeDb(data: DatabaseSchema): Promise<void> {
  try {
    await dbConnect();

    const syncCollection = async (model: any, list: any[]) => {
      if (!list || !Array.isArray(list)) return;
      
      // 1. Gather all IDs in the incoming list
      const incomingIds = list.map(item => item.id).filter(Boolean);

      // 2. Delete any records in MongoDB that are NOT in the incoming list
      await model.deleteMany({ id: { $nin: incomingIds } });

      // 3. Upsert the incoming records
      for (const item of list) {
        const query = item.id ? { id: item.id } : { _id: item._id };
        await model.findOneAndUpdate(query, item, { upsert: true, new: true });
      }
    };

    await Promise.all([
      syncCollection(Nomination, data.nominations),
      syncCollection(Donation, data.donations),
      syncCollection(Delegate, data.delegates),
      syncCollection(Volunteer, data.volunteers),
      syncCollection(Enquiry, data.enquiries),
      syncCollection(ActivityLog, data.activityLogs),
      syncCollection(Gallery, data.gallery),
      syncCollection(Event, data.events)
    ]);
  } catch (error) {
    console.error("Database write error:", error);
    throw error;
  }
}
