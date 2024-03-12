import { ObjectId } from "mongoose";

interface ISalon {
  _id?: string;
  vendorId: ObjectId;
  salonName: string;
  landmark: string;
  locality: string;
  district: string;
  openingTime: string;
  closingTime: string;
  contactNumber: string;
  chairCount: string;
  location: object;
  status?: string;
  banners: Array<Object> | any;
  facilities: Array<string>;
  services: Array<any>;
}
export default ISalon;
