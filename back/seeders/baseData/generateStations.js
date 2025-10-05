import axios from 'axios';
import '../../configs/envConfig.js';
import alternativeAddr from './alternativeAddr.js';
import fs from 'fs';
import readline from 'readline';
import locations from './locations.js';

const filePath = 'seeders/baseData/dustFile/2502.txt';
const resultStatinsBase = [];

try {
  console.log('Line Reder Open');
  const stream = fs.createReadStream(filePath);
  const reader = readline.createInterface({
    input: stream,
    culfDelay: Infinity
  });

  // 지역, 망, 측정소코드, 측정소명, 주소
  reader.on('line', line => {
    const splitLine = line.split('\t');
    const result = {
      station_code: parseInt(splitLine[2]),
      station_name: splitLine[3],
      address: splitLine[4],
      mang_name: splitLine[1],
    }
    if(!resultStatinsBase.some(item => item.station_code === result.station_code)) {
      resultStatinsBase.push(result);
    }
  });

  reader.on('close', line => {
    console.log('Line Reder Close');
    // fs.writeFileSync('stationBase.js', `export default ${JSON.stringify(resultStatinsBase, null, 2)}`);
    setGeocoder(resultStatinsBase);
  });
} catch(error) {
  console.log(error);
}

// import data from './stationBase.js';
// setGeocoder(data);

async function setGeocoder(result) {
  const appKey = process.env.VWORLD_APP_KEY;
  const url = process.env.VWORLD_BASE_URL;
  const typeArr = ['PARCEL','ROAD'];
  const resultStations = [];
  const resultErrorStations = [];

  for(const item of result) {
    const params = {
      service: "address",
      request: "GetCoord",
      version: "2.0",
      type: typeArr[0],
      address: item.address,
      format: "json",
      key: appKey
    }

    // 대체 주소 설정
    const alternativeAddrItem = alternativeAddr.find(alterItem => alterItem.origin === item.address);
    if(alternativeAddrItem) {
      params.address = alternativeAddrItem.alternative;
    }
    
    // PARCEL 시도
    let response = await axios.get(url, {params});

    // ROAD 시도
    if(response.data.response.status !== "OK") {
      params.type = typeArr[1];
      response = await axios.get(url, {params});

      // 없으면 파일작성
      if(response.data.response.status !== "OK") {
        try {
          resultErrorStations.push(item.address);
          continue;
        } catch(error) {
          console.log(error);
        }
      }
    }

    const data = response.data.response;

    // 획득 성공
    item.created_at = "MY_DATE";
    item.updated_at = "MY_DATE";
    item.sido_name = data.refined.structure.level1;
    item.sgg_name = data.refined.structure.level2.split(' ')[0];
    item.umd_name = data.refined.structure.level3 !== '' ? data.refined.structure.level3 : data.refined.structure.level4L;

    // 좌표 커스텀
    const [intPartX, decimalPartX] = data.result.point.x.split(".");
    item.tm_x = `${intPartX}.${decimalPartX.slice(0, 6)}`;
    const [intPartY, decimalPartY] = data.result.point.y.split(".");
    item.tm_y = `${intPartY}.${decimalPartY.slice(0, 6)}`;

    // 시도명 커스텀
    switch(item.sido_name) {
      case '서울특별시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '서울';
        break;
      case '부산광역시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '부산';
        break;
      case '대구광역시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '대구';
        break;
      case '인천광역시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '인천';
        break;
      case '광주광역시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '광주';
        break;
      case '대전광역시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '대전';
        break;
      case '울산광역시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '울산';
        break;
      case '경기도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '경기';
        break;
      case '강원특별자치도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '강원';
        break;
      case '충청북도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '충북';
        break;
      case '충청남도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '충남';
        break;
      case '전북특별자치도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '전북';
        break;
      case '전라남도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '전남';
        break;
      case '경상북도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '경북';
        break;
      case '경상남도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '경남';
        break;
      case '제주특별자치도':
        item.sido_fullname = item.sido_name;
        item.sido_name = '제주';
        break;
      case '세종특별자치시':
        item.sido_fullname = item.sido_name;
        item.sido_name = '세종';
        break;
      default:
        item.sido_fullname = null;
        break;
    }

    const exceptions = ['서울', '울산', '광주', '제주'];
    const exceptionFlg = exceptions.includes(item.sido_name);
    const [sggNameSplit] = item.sgg_name.split(' ');
    // location 커스텀
    for (const location of locations) {
      if(exceptionFlg && location.district_name === item.sido_name) {
        item.location_id = location.id;
        break;
      } else if(!exceptionFlg && location.district_name === item.sido_name && location.region_name.includes(sggNameSplit)) {
        item.location_id = location.id;
  
        if(item.sido_name === '인천') {
          if(('중산동,운서동'.includes(item.umd_name))) {
            item.location_id = 11;
          }
        }
        break;
      }
    }
    
    resultStations.push(item);
  }
  
  fs.writeFileSync('seeders/baseData/stations.txt', `export default ${JSON.stringify(resultStations, null, 2)}`);
  fs.writeFileSync('seeders/baseData/stations_error.txt', JSON.stringify(resultErrorStations, null, 2));
}