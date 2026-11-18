import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'base',
        'high_school',
        'special_intermediate',
        'integrated',
        'competitive',
        'tech_skills',
        'professional',
      ],
      index: true,
    },
    listCategory: {
      type: String,
      enum: ['List-A', 'List-B', 'List-C', 'List-D', 'List-E', 'List-F', 'List-H'],
      required: true,
      index: true,
    },
    classLevel: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    medium: {
      type: String,
      enum: ['English', 'Hindi', 'Bilingual'],
      default: 'English',
      index: true,
    },
    stream: {
      type: String,
      enum: [
        'PCM',
        'PCB',
        'Commerce',
        'Arts',
        'General',
        'Technical',
        'Management',
        'Teaching',
        'Civil Services',
        'Banking',
        'Law',
        'Defence',
        'Higher Education',
        'Other',
      ],
      default: 'General',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    duration: {
      type: String,
      default: 'March 2025',
    },
    classDaysPerWeek: {
      type: Number,
      default: 6,
    },
    classesPerDay: {
      type: String,
      default: '3-4',
    },
    classDurationMinutes: {
      type: Number,
      default: 45,
    },
    hasWeeklyTest: {
      type: Boolean,
      default: true,
    },
    hasPaidTest: {
      type: Boolean,
      default: true,
    },
    hasRecognition: {
      type: Boolean,
      default: true,
    },
    hasWorkshop: {
      type: Boolean,
      default: false,
    },
    hasNotes: {
      type: Boolean,
      default: true,
    },
    hasClassTest: {
      type: Boolean,
      default: true,
    },
    coverageSyllabusWithRevision: {
      type: Boolean,
      default: true,
    },
    syllabusExtension: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
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

courseSchema.index({ category: 1, medium: 1, isActive: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;
