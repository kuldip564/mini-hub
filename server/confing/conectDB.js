import { connect } from "mongoose";
const DBurl = process.env.DBURL || 'mongodb://localhost:27017/'
const DBConect=async ()=>{
    try {
        const {connection} = await connect(DBurl)
        if (connection) {
            console.log(connection.host);  
        }
        
    } catch (error) {
        console.log(error);
      process.exit(1)
        
    }
    
}

export default DBConect
