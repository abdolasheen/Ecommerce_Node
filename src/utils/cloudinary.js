import path from 'path'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import * as dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '../../config/.env') })

import cloudinary from 'cloudinary';


cloudinary.config({
    cloud_name: "dolpelvnv",
    api_key: "995472745231143",
    api_secret: "KpXoegwaB2RWFW4q5Y2qyVEOYIA",
    secure: true
})



export default cloudinary.v2;