import ImageKit from "imagekit";

var imagekit = new ImageKit({
    publicKey : process.env.IMK_PUBLIC_KEY,
    privateKey : process.env.IMK_PRIVATE_KEY,
    urlEndpoint : process.env.IMK_URL_ENDPOINT
});

export default imagekit