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
     },
     user:{
          type: mongoose.Types.ObjectId,
          ref: 'user',
          required: true
     }

});

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId)
{
     const obj = await this.aggerage([
          {
               $match: { bootcamp: bootcampId}
          },
          {
               $group:{
                    _id: '$bootcamp',
                    averageCost: {$avg: '$tuition'}
               }
          }
     ]);

     try {
          await this.model('bootcamp').findByIdAndUpdate(bootcampId,{
               averageCost: Math.ceil(obj[0].averageCost / 10)* 10
          });
     } catch (error) {
          console.error(error);
     }
}

// Call getAverageCost after save
CourseSchema.post('save',function(){
     this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove',function(){
     this.constructor.getAverageCost(this.bootcamp);
});

const Course = mongoose.model('course', CourseSchema);

export default Course;

