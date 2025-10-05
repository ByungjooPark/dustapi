import fs from 'fs';
import dotenv from 'dotenv';

const envFiles = ['.env.production', '.env.test', '.env'];

for(const file of envFiles) {
  if(fs.existsSync(file)) {
    dotenv.config({
      path: file,
      debug: file === '.env' ? true : false
    });
    console.log(`Loaded environment from ${file}`);
    break; // 첫 번째 발견된 파일만 로드
  }
}