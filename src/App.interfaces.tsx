export interface IPostFormField {
    code: string,
    minLength: number | undefined,
    maxLength: number | undefined,
    placeholder: string | undefined,
    value: string | undefined
}

export interface ISlideFormField {
    id?: number,
    text: string,
    imageUrl: string
}