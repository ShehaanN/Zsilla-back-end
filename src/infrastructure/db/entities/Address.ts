import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line1: {
    type: String,
    reqired: true,
  },
  line2: {
    type: String,
    reqired: false,
  },
  city: {
    type: String,
    reqired: true,
  },
  phone: {
    type: String,
    reqired: true,
  },
});

const Address = mongoose.model("Address", addressSchema);

export default Address;
