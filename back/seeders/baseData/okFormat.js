import ok from './ok.js';
import fs from 'fs';

let idx = 0;
let cnt = 1;

const mangNameArr = [
  ['교외대기', 27],
  ['국가배경', 11],
  ['도로변대기', 66],
  ['도시대기', 530],
  ['항만대기', 33],
];

const result = ok.map(item => {
  item.mang_name = mangNameArr[idx][0];
  cnt++;

  if(cnt > mangNameArr[idx][1]) {
    idx++;
    cnt = 1;
  }

  const [intPartX, decimalPartX] = item.tm_x.split(".");
  item.tm_x = `${intPartX}.${decimalPartX.slice(0, 6)}`;
  const [intPartY, decimalPartY] = item.tm_y.split(".");
  item.tm_y = `${intPartY}.${decimalPartY.slice(0, 6)}`;
  item.created_at = "MY_DATE";
  item.updated_at = "MY_DATE";
  return item;
});

try {
  fs.writeFileSync('baseData/ok_format.txt', JSON.stringify(result, null, 2));
} catch(error) {
  console.log(error);
}