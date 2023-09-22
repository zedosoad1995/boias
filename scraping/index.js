const axios = require("axios");
require("dotenv").config();

const characteristic = {
  height: 1,
  period: 2,
  direction: 3,
  temperature: 4,
};

const cols = ["SDATA", "HMAX", "HS", "TZ", "TP", "THTP", "TEMP"];

const NaNToUndefined = (rows) => {
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, v === "NaN" ? null : v]))
  );
};

const updateData = (existingRows, newRows) => {
  const returnRows = JSON.parse(JSON.stringify(existingRows));

  for (const newRow of newRows) {
    const idx = returnRows.findIndex((row) => row.SDATA === newRow.SDATA);
    if (idx === -1) continue;

    returnRows[idx] = newRow;
  }

  return returnRows;
};

const get_buoys_data = async () => {
  console.log(process.env.BIN_ID, process.env.JSON_KEY);
  return await axios
    .get(`https://api.jsonbin.io/v3/b/${process.env.BIN_ID}`, {
      headers: {
        "X-Master-Key": process.env.JSON_KEY,
      },
    })
    .then(({ data }) => data.record);
};

const scrape_buoys_data = async () => {
  try {
    var existingData = await get_buoys_data();
  } catch (_) {
    var existingData = {};
  }

  for (const [key, val] of Object.entries(characteristic)) {
    const path = `https://www.hidrografico.pt/json/boia.graph.php?id_est=1005&id_eqp=1009&gmt=GMT&dtz=Europe/Lisbon&dbn=monican&par=${val}&per=3`;
    let { data } = await axios.get(path);

    data = NaNToUndefined(data);

    if (key in existingData) {
      existingData[key] = updateData(existingData[key], data);
    } else {
      existingData[key] = data;
    }
  }

  await axios
    .put(`https://api.jsonbin.io/v3/b/${process.env.BIN_ID}`, existingData, {
      headers: {
        "X-Master-Key": process.env.JSON_KEY,
      },
    })
    .catch(console.error);
};

scrape_buoys_data();
