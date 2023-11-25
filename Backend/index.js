
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const PORT = 5555;
const MONGODB_URI = "mongodb+srv://Teja:teja@cluster1.lgo3ddb.mongodb.net/Vote?retryWrites=true&w=majority";

const app = express();
app.use(express.json());
app.use(cors());

// Define the Vote model
const voteSchema = new mongoose.Schema({
  voterId: { type: String, unique: true },
  selectedCandidate: String,
});

const Vote = mongoose.model('Vote', voteSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Handle vote submission
app.post("/vote", async (request, response) => {
  try {
    const { voterId, selectedCandidate } = request.body;

    // Check if the user has already voted
    const existingVote = await Vote.findOne({ voterId });

    if (existingVote) {
      return response.status(200).send("You already voted for this candidate.");
    }

    // Create a new vote record
    const newVote = {
      voterId,
      selectedCandidate,
    };

    await Vote.create(newVote);

    return response.status(200).send("Vote recorded successfully");
  } catch (error) {
    return response.status(500).send({ message: "Internal Server Error" });
  }
});

app.get('/vote', async (request, response) => {
  try {
    const votes = await Vote.aggregate([
      {
        $group: {
          _id: '$selectedCandidate',
          count: { $sum: 1 },
        },
      },
    ]);

    const candidateVotes = votes.map((vote) => ({
      candidate: vote._id,
      count: vote.count,
    }));

    return response.status(200).json({
      data: candidateVotes,
    });
  } catch (error) {
    return response.status(500).send({ message: 'Internal Server Error' });
  }
});
