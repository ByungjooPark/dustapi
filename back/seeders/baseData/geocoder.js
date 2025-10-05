import axios from 'axios';
import fs from 'fs';
import stationBase from './stationBase.js';
import '../configs/envConfig.js';

async function run() {
  const APP_KEY = process.env.VWORLD_APP_KEY;
  const typeArr = ['PARCEL','ROAD'];
  
  const url = process.env.VWORLD_BASE_URL;
  console.log(APP_KEY, url);
  const resultStatinBase = [];
  for(const item of stationBase) {
    const params = {
      service: "address",
      request: "GetCoord",
      version: "2.0",
      type: typeArr[0],
      address: item.addr,
      format: "json",
      key: APP_KEY
    }

    try {
      // PARCEL 시도
      let response = await axios.get(url, {params});

      // ROAD 시도
      if(response.data.response.status !== "OK") {
        params.type = typeArr[1];
        response = await axios.get(url, {params});

        // 없으면 파일작성
        if(response.data.response.status !== "OK") {
          try {
            fs.appendFileSync('baseData/not_found.txt', `${item.addr}\r\n`);
            continue;
          } catch(error) {
            console.log(error);
          }
        }
      }

      const data = response.data.response;

      // 획득 성공
      item.dm_x = data.result.point.x;
      item.dm_y = data.result.point.y;
      item.sido_name = data.refined.structure.level1;
      item.sgg_name = data.refined.structure.level2;
      item.umd_name = data.refined.structure.level3 !== '' ? data.refined.structure.level3 : data.refined.structure.level4L;

      resultStatinBase.push(item);
    } catch(error) {
      console.error(error);
    }
  }

  try {
    fs.writeFileSync('baseData/ok.txt', JSON.stringify(resultStatinBase, null, 2));
  } catch(error) {
    console.log(error);
  }
}

run();