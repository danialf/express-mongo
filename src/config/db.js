import { connect } from 'mongoose';

const connectDb = async () =>{
     const connection = await connect(process.env.MONGO_URI,{
          useNewUrlParser:true,
          useCreateIndex:true,
          useFindAndModify:false,
          useUnifiedTopology:true
     });

     console.log('MongoDB Connected')
}

export default connectDb;