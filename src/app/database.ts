import mongoose from 'mongoose';

const database = () => {
    try{
        const database = process.env.DATABASE as string;

        const development = process.env.NODE_ENV === "development"

        const database_password: any = process.env.DATABASE_PASSWORD;

        const db = database.replace('<password>', database_password);

        mongoose.set('strictQuery', true);

        mongoose.connect( db );

        if (development) console.log("DB connection successful!");

    } catch (err){
        console.log("Could not connect to database");
    }
}

export default database