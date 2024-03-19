interface IService {
  _id?: string;
  serviceName: string;
  duration: number;
  price?: number;
  category: string;
  isVisible: boolean;
}

export default IService;
