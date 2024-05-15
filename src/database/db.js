import mongoose from "mongoose";

const connectDatabase = () => {
    console.log("espere a conexão com o banco de dados");

    mongoose.connect(process.env.MONGODB_URI,
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB Atlas Conectado"))
        .catch((error) => console.log(error)
        );
};

const connectDatabase2 = () => {
    mongoose.connect("mongodb+srv://root:root@cluster0.t9zlssk.mongodb.net/",
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB Atlas Conectado ²"))
        .catch((error) => console.log(error)
        );
};

export default connectDatabase2;
//connectDatabase;
