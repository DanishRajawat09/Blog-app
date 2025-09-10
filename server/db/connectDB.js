import mongoose from "mongoose"

async function connect() {
    try {
     await mongoose.connect(`${process.env.MONGODB_URI}/${"D-BLOG"}`)

    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

export default connect