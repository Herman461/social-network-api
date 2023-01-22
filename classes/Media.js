'use strict';

import path from 'path'
import gm from 'gm'
import fs from 'fs'

const ABSPATH = path.dirname(process.mainModule.filename)

const exists = (path) => {
    try {
        return fs.statSync(path).isFile()
    } catch(e) {
        return false
    }
}

const getFileExtension = (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

class Media {
    constructor(path) {
        this.src = path
    }

    isValidMedia(src) {
        return '/\.(jpe?g|png)$/'.test(src)
    }

    isValidBaseDir(src) {
        return /^\/public\/images/.test(src)
    }

    thumb(request, response) {
        const image = ABSPATH + this.src

        if (this.isValidBaseDir(this.src) && this.isValidMedia(this.src && exists(image))) {
            const width = 50;
            const height = 50

            const extension = getFileExtension(this.src)
            const mime = (extension === 'jpeg' || extension === 'jpg') ? 'jpeg' : 'png'

            gm(image).resize(width, height).stream().pipe(response)
        } else {
            response.sendStatus(404)
        }
    }
}

export default Media
