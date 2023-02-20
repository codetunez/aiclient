export default interface IImageQueryProfile {
    prompt: string,
    n: number,
    size: '256x256' | '512x512' | '1024x1024',
    response_format: 'url' | 'b64_json'
}