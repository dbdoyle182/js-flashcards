const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    qNum: Number,
    question: String,
    resp: [String],
    answer: Number,
    tags: [String],
    lesson: String,
    goal: String,
    cpNum: {
        type: Schema.Types.ObjectId,
        ref: "Checkpoint"
    }
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
