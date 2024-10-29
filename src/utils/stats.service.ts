import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  fileName: { type: String },
  userId: { type: Number },
  lastTimePlayed: { type: Date, default: Date.now },
  playCount: { type: Number, default: 1 },
});

const files = mongoose.model("Files", schema);

export class StatsService {
  private readonly mongoUrl: string = "mongodb://localhost:27017/data";

  async storePlayStatistic(userId: number, fileName: string) {
    const connection = await mongoose.connect(this.mongoUrl);
    const newFileRecord = new files({
      fileName,
      userId,
    });

    const existingFileRecord = await files.findOne({
      fileName,
      userId,
    });
    if (existingFileRecord) {
      existingFileRecord.playCount += 1;
      await existingFileRecord.save();
    } else {
      await newFileRecord.save();
    }
    await connection.disconnect();
  }

  async getMostlyPlayedFiles(userId: number) {
    const connection = await mongoose.connect(this.mongoUrl);

    const existingFileRecord = await files
      .find({ userId: userId })
      .sort({ playCount: -1 })
      .limit(25);
    await connection.disconnect();
    return existingFileRecord;
  }

  async getMostPopularFiles(): Promise<{ fileName: string; count: number }[]> {
    const connection = await mongoose.connect(this.mongoUrl);

    const values = await files
      .aggregate([
        {
          $group: {
            _id: "$fileName",
            count: { $sum: "$playCount" },
          },
        },
      ])
      .limit(25)
      .sort({ count: -1 });

    await connection.disconnect();

    return values.map((value) => ({
      fileName: value._id,
      count: value.count,
    }));
  }
}
