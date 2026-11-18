import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Please provide question text'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: ['mcq', 'true_false'],
      default: 'mcq',
    },
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    correctOptionIndex: {
      type: Number,
      required: [true, 'Please specify the correct option index'],
    },
    marks: {
      type: Number,
      default: 1,
      min: 0.5,
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ quiz: 1, order: 1 });

export default mongoose.model('Question', questionSchema);
