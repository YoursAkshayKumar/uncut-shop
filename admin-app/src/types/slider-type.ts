export interface ISliderItem {
  _id: string;
  title: string;
  preTitle?: string;
  backgroundImage: string;
  backgroundImageTablet?: string;
  backgroundImageMobile?: string;
  productImage?: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface SliderResponse {
  success: boolean;
  result: ISliderItem[];
}

export interface IAddSlider {
  title: string;
  preTitle?: string;
  backgroundImage: string;
  backgroundImageTablet?: string;
  backgroundImageMobile?: string;
  productImage?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  status?: "active" | "inactive";
}

export interface ISliderAddResponse {
  status: string;
  message: string;
  data: ISliderItem;
}

export interface SliderDelResponse {
  success: boolean;
  message: string;
}

