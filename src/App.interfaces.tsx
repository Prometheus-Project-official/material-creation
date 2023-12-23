export interface IPostFormData {
    title: string,
    subtitle: string,
    caption: string,
    sources: string,
    slides: ISlideFormField[]
}

export interface ISlideFormField {
    id?: number,
    text: string,
    imageUrl?: string,
    position: number
}

export interface IPostSlide {
    text: string,
    imageUrl?: string,
    position: number
}

export interface IPost {
    title: string,
    subtitle: string,
    caption: string,
    sources: string,
    slides: IPostSlide[]
}