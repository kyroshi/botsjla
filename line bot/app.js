const { VK } = require('vk-io');
const vk = new VK({
    token: "d4b4d96f5bdbccee64dd7b08618babd451bc85823113fba24033420bcf3740ae3ceb983a17d7666b484d8"
});
const fs = require('fs')
const { Image, createCanvas } = require('canvas');
var img = new Image();

vk.updates.hear(/\/помощь/i, async(message) => {
    message.send(`Хочешь наложить полосочки на фото?
    Пиши: /полоски [фото]
    
    [Фото] писать не нужно, лучше прикрепи картинку`);
});

vk.updates.hear(/\/полоски/i, async(message) => {
    try
    {
        let url_image_raw = message.attachments[0].sizes;
        let url_image = message.attachments[0].sizes[url_image_raw.length-1].url;
        let width = message.attachments[0].sizes[url_image_raw.length-1].width;
        let height = message.attachments[0].sizes[url_image_raw.length-1].height;
        img.src = url_image;
        img.onload = async() => {
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height);
            for (var i = -1; i<height; i++){
                ctx.fillRect(0,i*2,width,1);
            }
            canvas.createPNGStream().pipe(fs.createWriteStream('clock.png'))
            const buffer = canvas.toBuffer()
            await message.sendPhotos(buffer);
        }
    } catch
    {
        message.send('Проверь, прикрепил ли ты картинку?');
    }
})

vk.updates.start();