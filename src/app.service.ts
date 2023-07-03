import { Injectable } from '@nestjs/common';
import { MessagesService } from './messages/messages.service';
var fs = require('fs');
var randomstring = require('randomstring');

@Injectable()
export class AppService {

  // constructor(private messageService : MessagesService){}
  welcome(): string {
    return "Bienvenu sur l'api de blabber";
  }


  async upload(file: Express.Multer.File, messageId: string) {

    let folder = 'public/data/publications'

    try{
      if (!fs.existsSync(folder))
        fs.mkdirSync(folder, { recursive: true });
    }
    catch(error){
      console.log("je suis par ici");
      
    }

    const name = `${randomstring.generate(5)}-${file.originalname}`;
    const filePath = `${folder}/${name}`;
    return fs.writeFileSync(filePath, file.buffer);

    
  }
}
