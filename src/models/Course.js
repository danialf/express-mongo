import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
     title: {
          type: String,
          trim: true,
          required: [true, 'Please add a course title']
     },
     description: {
          type: String,
          requred: [true, 'Please add a description']
     },
     weeks: {
          type: Number,
          requred: [true, 'Please add number of weeks']
     },
     tuition: {
          type: Number,
          requred: [true, 'Please add tuition cost']
     },
     minimumSkill: {
          type: String,
          requred: [true, 'Please add a minimum skill'],
          enum: ['beginner', 'intermediate', 'advanced']
     },
     scholarshipAvailable: {
          type: Boolean,
          default: false
     },
     createdAt: {
          type: Date,
          default: Date.now
     },
     bootcamp: {
          type: mongoose.Types.ObjectId,
          ref: 'bootcamp',
          required: true
     }

});

const Course = mongoose.model('course', CourseSchema);

export default Course;

